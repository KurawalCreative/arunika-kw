"use server";

import { getServerAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            _count: {
                select: {
                    followers: true,
                    following: true,
                    Post: true,
                },
            },
        },
    });
    return user;
}

export async function getUserPosts(userId: string) {
    const session = (await getServerAuthSession()) as any;
    const currentUserId = session?.user?.id;

    const posts = await prisma.post.findMany({
        where: { authorId: userId },
        include: {
            author: true,
            images: true,
            _count: { select: { likes: true, comments: true } },
            likes: currentUserId ? { where: { userId: currentUserId }, select: { id: true } } : false,
        },
        orderBy: { createdAt: "desc" },
    });

    return posts.map((post) => ({
        ...post,
        likedByUser: currentUserId && Array.isArray(post.likes) ? post.likes.length > 0 : false,
        likesCount: post._count.likes,
    }));
}

export async function checkFollowing(followingId: string) {
    const session = (await getServerAuthSession()) as any;
    if (!session?.user) return false;

    const follow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: session.user.id,
                followingId,
            },
        },
    });

    return !!follow;
}

export async function toggleFollow(followingId: string) {
    const session = (await getServerAuthSession()) as any;
    if (!session?.user) return false;

    const followerId = session.user.id;
    if (followerId === followingId) return false;

    const existing = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId,
                followingId,
            },
        },
    });

    if (existing) {
        await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });
    } else {
        await prisma.follow.create({
            data: {
                followerId,
                followingId,
            },
        });
    }

    return true;
}
