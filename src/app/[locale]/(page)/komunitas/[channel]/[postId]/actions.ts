"use server";

import { getServerAuthSession } from "@/lib/auth";
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

export async function getComments(postId: string) {
    const comments = await prisma.comment.findMany({
        where: { postId, parent: null },
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

    if (!comment) return false;

    // User hanya bisa delete jika mereka author atau admin
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    const isAuthor = comment.authorId === session.user.id;
    const isAdmin = user?.role === "admin";

    if (!isAuthor && !isAdmin) return false;

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

    if (!reply) return false;

    // User hanya bisa delete jika mereka author atau admin
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    const isAuthor = reply.authorId === session.user.id;
    const isAdmin = user?.role === "admin";

    if (!isAuthor && !isAdmin) return false;

    await prisma.comment.delete({
        where: { id: replyId },
    });

    return true;
}
