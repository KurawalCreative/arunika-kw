"use server";

import { Post, PostImage, User } from "@/generated/prisma/client";
import { getServerAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import s3 from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Channel } from "diagnostics_channel";

export async function getChannelBySlug(slug: string) {
    const data = await prisma.channel.findFirst({
        where: { slug },
    });
    return data;
}

export async function getPostById(postId: string) {
    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
            author: true,
            images: true,
            channel: true,
            _count: { select: { likes: true, comments: true } },
        },
    });

    return post;
}

export async function getPresignedUrl(fileName: string, type: string) {
    const bucket = process.env.S3_BUCKET;

    const ext = type.split("/")[1];
    const key = `posts/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: type,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 60 });

    const publicUrl = `${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${key}`;

    return { url, key, publicUrl };
}

export async function getPost(slug: string, page: number = 1, limit: number = 10) {
    const session = (await getServerAuthSession()) as any;
    if (!session?.user) return { posts: [], total: 0 };

    const userId = session?.user?.id;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where: { channel: { slug } },
            include: {
                author: true,
                images: true,
                _count: { select: { comments: true, likes: true } },
                likes: { where: { userId }, select: { id: true } },
                channel: true,
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.post.count({
            where: { channel: { slug } },
        }),
    ]);

    return {
        posts: posts.map((post) => ({
            ...post,
            isLikedByUser: post.likes.length > 0,
        })),
        total,
    };
}

export async function storePost(content: string, images: string[], slug: string) {
    const session = (await getServerAuthSession()) as any;

    if (!session?.user) return;

    await prisma.post.create({
        data: {
            content,
            author: {
                connect: { id: session.user.id },
            },
            channel: {
                connect: { slug: slug },
            },
            images: {
                create: images.map((v) => ({ url: v })),
            },
        },
    });
}

export async function toggleLike(postId: string) {
    const session = (await getServerAuthSession()) as any;
    if (!session?.user) return null;

    const userId = session.user.id;
    const existing = await prisma.like.findFirst({
        where: { postId, userId },
    });

    if (existing) {
        await prisma.like.delete({ where: { id: existing.id } });
    } else {
        await prisma.like.create({
            data: { postId, userId },
        });
    }

    const count = await prisma.like.count({ where: { postId } });
    return count;
}

export async function deletePost(postId: string) {
    const session = (await getServerAuthSession()) as any;
    if (!session?.user) return false;

    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true },
    });

    if (!post) return false;

    // User hanya bisa delete jika mereka author atau admin
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    const isAuthor = post.authorId === session.user.id;
    const isAdmin = user?.role === "admin";

    if (!isAuthor && !isAdmin) return false;

    // Delete all replies first (comments yang punya parentId)
    await prisma.comment.deleteMany({
        where: {
            postId,
            parentId: { not: null },
        },
    });

    // Then delete all parent comments (comments yang parentId-nya null)
    await prisma.comment.deleteMany({
        where: {
            postId,
            parentId: null,
        },
    });

    // Finally delete the post
    await prisma.post.delete({
        where: { id: postId },
    });

    return true;
}

export async function searchPosts(slug: string, query: string, page: number = 1, limit: number = 10) {
    const session = (await getServerAuthSession()) as any;
    if (!session?.user) return { posts: [], total: 0 };

    const userId = session?.user?.id;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where: {
                channel: { slug },
                content: { contains: query, mode: "insensitive" },
            },
            include: {
                author: true,
                images: true,
                _count: { select: { comments: true, likes: true } },
                likes: { where: { userId } },
                channel: true,
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.post.count({
            where: {
                channel: { slug },
                content: { contains: query, mode: "insensitive" },
            },
        }),
    ]);

    return {
        posts: posts.map((post) => ({
            ...post,
            isLikedByUser: post.likes.length > 0,
        })),
        total,
    };
}

export async function getUserLikedPosts(slug: string) {
    const session = (await getServerAuthSession()) as any;
    if (!session?.user) return [];

    const likes = await prisma.like.findMany({
        where: {
            userId: session.user.id,
            post: { channel: { slug } },
        },
        select: { postId: true },
    });

    return likes.map((l) => l.postId);
}
