import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "@/lib/s3";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const tag = searchParams.get("tag") || "";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const where: any = {};
        if (search) {
            where.OR = [{ content: { contains: search, mode: "insensitive" } }, { author: { name: { contains: search, mode: "insensitive" } } }, { tags: { some: { tag: { name: { contains: search, mode: "insensitive" } } } } }];
        }
        if (tag) {
            where.tags = { some: { tag: { name: tag } } };
        }

        const posts = await prisma.post.findMany({
            where,
            include: {
                author: true,
                likes: {
                    include: {
                        user: true,
                    },
                },
                tags: { include: { tag: true } },
                images: true,
                _count: {
                    select: { comments: true },
                },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        });

        const total = await prisma.post.count({ where });

        const res = posts.map((v) => ({
            ...v,
            likes: v.likes.map((like) => ({ id: like.id, userId: like.userId })),
            images: v.images.map((x) => ({
                ...x,
                url: process.env.NEXT_PUBLIC_S3_PUBLIC_URL! + "/" + x.url,
            })),
        }));

        return NextResponse.json({ posts: res, hasMore: skip + posts.length < total });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: "error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session) return NextResponse.json({ error: "Belum login" }, { status: 401 });
    const userId = (session.user as any)?.id as string | undefined;
    const userRole = (session.user as any)?.role as string | undefined;
    if (!userId) return NextResponse.json({ error: "Belum login" }, { status: 401 });

    const body = (await req.json()) as {
        content: string;
        tags: string[];
        images: string[];
    };

    const content = body.content;
    const tags = body.tags;
    const images = body.images;

    for (const path of images) {
        if (path && !path.startsWith(process.env.NEXT_PUBLIC_S3_PUBLIC_URL!)) {
            return NextResponse.json({ error: "URL gambar tidak valid atau bukan dari sumber resmi" }, { status: 400 });
        }
    }

    const post = await prisma.post.create({
        data: {
            content,
            authorId: userId,
            images: {
                create: images.map((url) => ({ url: url.replace(process.env.NEXT_PUBLIC_S3_PUBLIC_URL! + "/", ""), status: "success" })),
            },
            tags: {
                create: tags.map((t: string) => ({
                    tag: { connectOrCreate: { where: { name: t }, create: { name: t } } },
                })),
            },
        },
        include: {
            author: true,
            likes: true,
            comments: {
                include: {
                    author: true,
                },
            },
            tags: { include: { tag: true } },
            images: true,
        },
    });

    return NextResponse.json({
        success: true,
        post: {
            ...post,
            likes: post.likes.map((like) => ({ id: like.id, userId: like.userId })),
            images: post.images.map((x) => ({
                ...x,
                url: process.env.NEXT_PUBLIC_S3_PUBLIC_URL! + "/" + x.url,
            })),
        },
    });
}

export async function DELETE(req: NextRequest) {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session) return NextResponse.json({ error: "Belum login" }, { status: 401 });
    const userId = (session.user as any)?.id as string | undefined;
    const userRole = (session.user as any)?.role as string | undefined;
    if (!userId) return NextResponse.json({ error: "Belum login" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("id");

    if (!postId) {
        return NextResponse.json({ error: "ID post tidak ditemukan" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { author: true, images: true },
    });

    if (!post) {
        return NextResponse.json({ error: "Post tidak ditemukan" }, { status: 404 });
    }

    if (post.authorId !== userId && userRole !== "admin") {
        return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 });
    }

    // Hapus semua gambar dari S3
    if (post.images.length > 0) {
        for (const img of post.images) {
            try {
                const key = img.url.replace(`${process.env.NEXT_PUBLIC_S3_PUBLIC_URL!}/`, "");
                await s3.send(
                    new DeleteObjectCommand({
                        Bucket: process.env.S3_BUCKET!,
                        Key: key,
                    }),
                );
            } catch (error) {
                console.error("Error menghapus gambar dari S3:", error);
            }
        }
    }

    await prisma.post.delete({
        where: { id: postId },
    });

    return NextResponse.json({ success: true, message: "Post berhasil dihapus" });
}

export async function PATCH(req: NextRequest) {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session) return NextResponse.json({ error: "Belum login" }, { status: 401 });
    const userId = (session.user as any)?.id as string | undefined;
    const userRole = (session.user as any)?.role as string | undefined;
    if (!userId) return NextResponse.json({ error: "Belum login" }, { status: 401 });

    const body = (await req.json()) as {
        postId: string;
        content: string;
        tags: string[];
        images: string[];
    };

    const postId = body.postId;
    const content = body.content;
    const tags = body.tags;
    const images = body.images;

    if (!postId) {
        return NextResponse.json({ error: "ID post tidak ditemukan" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { images: true },
    });

    if (!post) {
        return NextResponse.json({ error: "Post tidak ditemukan" }, { status: 404 });
    }

    if (post.authorId !== userId) {
        return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 });
    }

    // ✅ validasi sumber gambar sama seperti di POST
    for (const path of images) {
        if (path && !path.startsWith(process.env.NEXT_PUBLIC_S3_PUBLIC_URL!)) {
            return NextResponse.json({ error: "URL gambar tidak valid atau bukan dari sumber resmi" }, { status: 400 });
        }
    }

    // 🧹 hapus gambar lama dari S3
    for (const img of post.images) {
        try {
            const key = img.url.replace(`${process.env.NEXT_PUBLIC_S3_PUBLIC_URL!}/`, "");
            await s3.send(
                new DeleteObjectCommand({
                    Bucket: process.env.S3_BUCKET!,
                    Key: key,
                }),
            );
        } catch (error) {
            console.error("Error menghapus gambar lama:", error);
        }
    }

    // 🧹 hapus relasi lama dari database
    await prisma.postImage.deleteMany({ where: { postId } });
    await prisma.postTag.deleteMany({ where: { postId } });

    // ✏️ update post baru dengan gambar & tag baru
    const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
            content: content || post.content,
            images: {
                create: images.map((url) => ({
                    url: url.replace(process.env.NEXT_PUBLIC_S3_PUBLIC_URL! + "/", ""),
                    status: "success",
                })),
            },
            tags: {
                create: tags.map((t: string) => ({
                    tag: { connectOrCreate: { where: { name: t }, create: { name: t } } },
                })),
            },
        },
        include: {
            author: true,
            likes: true,
            comments: { include: { author: true } },
            tags: { include: { tag: true } },
            images: true,
        },
    });

    return NextResponse.json({
        success: true,
        post: {
            ...updatedPost,
            likes: updatedPost.likes.map((like) => ({ id: like.id, userId: like.userId })),
            images: updatedPost.images.map((x) => ({
                ...x,
                url: process.env.NEXT_PUBLIC_S3_PUBLIC_URL! + "/" + x.url,
            })),
        },
    });
}

export async function PUT(req: NextRequest) {
    // Cleanup orphaned images (pending status > 30 minutes)
    try {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

        const orphanedImages = await prisma.postImage.findMany({
            where: {
                status: "pending",
                createdAt: { lt: thirtyMinutesAgo },
            },
        });

        let deletedCount = 0;
        for (const img of orphanedImages) {
            try {
                // Delete from S3
                const key = img.url;
                await s3.send(
                    new DeleteObjectCommand({
                        Bucket: process.env.S3_BUCKET!,
                        Key: key,
                    }),
                );
                // Delete from DB
                await prisma.postImage.delete({ where: { id: img.id } });
                deletedCount++;
            } catch (error) {
                console.error("Error deleting orphaned image:", error);
            }
        }

        return NextResponse.json({ success: true, deletedCount });
    } catch (error) {
        console.error("Cleanup error:", error);
        return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
    }
}
