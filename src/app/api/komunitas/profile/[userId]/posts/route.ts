import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    try {
        const session = (await getServerSession(authOptions as any)) as any;
        const currentUserId = (session?.user as any)?.id as string | undefined;

        const { userId } = await params;
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const posts = await prisma.post.findMany({
            where: { authorId: userId },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        role: true,
                    },
                },
                images: {
                    select: {
                        id: true,
                        url: true,
                    },
                },
                tags: {
                    include: {
                        tag: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        });

        // If user logged in, fetch likes by this user for these posts
        let likedSet = new Set<string>();
        if (currentUserId && posts.length > 0) {
            const liked = await prisma.like.findMany({
                where: { userId: currentUserId, postId: { in: posts.map((p) => p.id) } },
                select: { postId: true },
            });
            likedSet = new Set(liked.map((l) => l.postId));
        }

        // Transform posts to include commentCount, likesCount and full image URLs
        const transformedPosts = posts.map((post) => ({
            id: post.id,
            content: post.content,
            authorId: post.authorId,
            author: post.author,
            createdAt: post.createdAt.toISOString(),
            images: post.images.map((img) => ({ ...img, url: process.env.NEXT_PUBLIC_S3_PUBLIC_URL! + "/" + img.url })),
            tags: post.tags.map((t) => ({ id: t.id, tag: t.tag })),
            likesCount: post._count?.likes || 0,
            likedByUser: currentUserId ? likedSet.has(post.id) : false,
            commentCount: post._count?.comments || 0,
        }));

        return NextResponse.json({ posts: transformedPosts });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}