"use server";

import prisma from "@/lib/prisma";

export async function getPostWithComments(postId: string) {
    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
            author: true,
            channel: true,
            images: true,
            comments: {
                include: {
                    author: true,
                    replies: {
                        include: {
                            author: true,
                        },
                        orderBy: { createdAt: "asc" },
                    },
                },
                orderBy: { createdAt: "desc" },
            },
            _count: {
                select: { likes: true, comments: true },
            },
        },
    });
    return post;
}
