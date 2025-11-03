import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { headers } from "next/headers";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "@/lib/s3";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const fileName = searchParams.get("fileName");
        const fileType = searchParams.get("fileType");

        const isWantUrl = searchParams.get("mode") === "url";

        if (isWantUrl) {
            if (!fileType || !fileName) {
                return NextResponse.json({ error: "fileName dan fileType wajib ada" }, { status: 400 });
            }

            const ext = fileName.includes(".") ? fileName.split(".").pop() : "";
            const randomName = Math.random().toString(36).substring(2, 10);
            const key = ext ? `posts/${Date.now()}-${randomName}.${ext}` : `posts/${Date.now()}-${randomName}`;

            const command = new PutObjectCommand({
                Bucket: process.env.S3_BUCKET!,
                Key: key,
                ContentType: fileType,
            });

            const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

            return NextResponse.json({ uploadUrl, fileUrl: `${process.env.NEXT_PUBLIC_S3_PUBLIC_URL!}/${key}` });
        }

        const posts = await prisma.post.findMany({
            include: {
                author: true,
                likes: {
                    include: {
                        user: true,
                    },
                },
                comments: {
                    include: {
                        author: true,
                    },
                    orderBy: { createdAt: "desc" },
                },
                tags: { include: { tag: true } },
                images: true,
            },
            orderBy: { createdAt: "desc" },
        });

        const res = posts.map((v) => ({
            ...v, //
            images: v.images.map((x) => ({
                ...x, //
                url: process.env.NEXT_PUBLIC_S3_PUBLIC_URL! + "/" + x.url,
            })),
        }));

        return NextResponse.json(res);
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: "error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Belum login" }, { status: 401 });

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
            authorId: session.user.id,
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

    return NextResponse.json({ success: true, post });
}

export async function DELETE(req: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Belum login" }, { status: 401 });

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

    if (post.authorId !== session.user.id && (session.user as any).role !== "admin") {
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
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Belum login" }, { status: 401 });

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

    if (post.authorId !== session.user.id) {
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

    return NextResponse.json({ success: true, post: updatedPost });
}
