import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        // Get posts with most likes and comments in the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const trendingPosts = await prisma.post.findMany({
            where: {
                createdAt: {
                    gte: sevenDaysAgo,
                },
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
            orderBy: [{ likes: { _count: "desc" } }, { comments: { _count: "desc" } }],
            take: 5,
        });

        const posts = trendingPosts.map((post) => ({
            id: post.id,
            content: post.content.length > 100 ? post.content.substring(0, 100) + "..." : post.content,
            author: post.author,
            likesCount: post._count.likes,
            commentsCount: post._count.comments,
            score: post._count.likes + post._count.comments * 2, // Weight comments more
            createdAt: post.createdAt,
        }));

        return NextResponse.json({ posts });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: "error" }, { status: 500 });
    }
}
