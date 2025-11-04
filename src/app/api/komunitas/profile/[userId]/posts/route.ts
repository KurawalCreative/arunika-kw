import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    try {
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
                likes: {
                    select: {
                        id: true,
                        userId: true,
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
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        });

        // Transform posts to include commentCount and full image URLs
        const transformedPosts = posts.map(post => ({
            ...post,
            commentCount: post._count.comments,
            images: post.images.map((img) => ({
                ...img,
                url: process.env.NEXT_PUBLIC_S3_PUBLIC_URL! + "/" + img.url,
            })),
            _count: undefined, // Remove _count from response
        }));

        return NextResponse.json({ posts: transformedPosts });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}