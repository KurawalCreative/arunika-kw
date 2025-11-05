"use server";

import { getServerAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import s3 from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getChannelBySlug(slug: string) {
    const data = await prisma.channel.findFirst({
        where: { slug },
    });
    return data;
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

export async function getPost(slug: string) {
    const posts = await prisma.post.findMany({
        where: { channel: { slug } },
        include: { author: true, images: true, _count: { select: { comments: true, likes: true } } },
        orderBy: { createdAt: "desc" },
    });
    return posts;
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

export async function getComments(postId: string) {
    const comments = await prisma.comment.findMany({
        where: { postId, parentId: null },
        include: { author: true, replies: { include: { author: true } } },
        orderBy: { createdAt: "desc" },
    });
    return comments;
}

export async function createComment(postId: string, content: string) {
    const session = (await getServerAuthSession()) as any;
    if (!session?.user) return null;

    const comment = await prisma.comment.create({
        data: {
            content,
            post: { connect: { id: postId } },
            author: { connect: { id: session.user.id } },
        },
        include: { author: true },
    });
    return comment;
}

export async function deleteComment(commentId: string) {
    const session = (await getServerAuthSession()) as any;
    if (!session?.user) return false;

    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { authorId: true },
    });

    if (!comment || comment.authorId !== session.user.id) return false;

    // delete replies dulu baru parent comment
    await prisma.comment.deleteMany({
        where: { parentId: commentId },
    });

    await prisma.comment.delete({
        where: { id: commentId },
    });

    return true;
}

export async function createReply(commentId: string, content: string) {
    const session = (await getServerAuthSession()) as any;
    if (!session?.user) return null;

    const parentComment = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { postId: true },
    });

    if (!parentComment) return null;

    const reply = await prisma.comment.create({
        data: {
            content,
            parentId: commentId,
            postId: parentComment.postId!,
            authorId: session.user.id,
        },
        include: { author: true },
    });

    return reply;
}

export async function deleteReply(replyId: string) {
    const session = (await getServerAuthSession()) as any;
    if (!session?.user) return false;

    const reply = await prisma.comment.findUnique({
        where: { id: replyId },
        select: { authorId: true },
    });

    if (!reply || reply.authorId !== session.user.id) return false;

    await prisma.comment.delete({
        where: { id: replyId },
    });

    return true;
}

export async function deletePost(postId: string) {
    const session = (await getServerAuthSession()) as any;
    if (!session?.user) return false;

    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true },
    });

    if (!post || post.authorId !== session.user.id) return false;

    await prisma.post.delete({
        where: { id: postId },
    });

    return true;
}

export async function searchPosts(slug: string, query: string) {
    const posts = await prisma.post.findMany({
        where: {
            channel: { slug },
            content: { contains: query, mode: "insensitive" },
        },
        include: { author: true, images: true, _count: { select: { comments: true, likes: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
    });
    return posts;
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
