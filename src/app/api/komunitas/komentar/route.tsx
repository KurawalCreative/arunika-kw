import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return NextResponse.json({ error: "Belum login" }, { status: 401 });

        const body = (await req.json()) as { postId?: string; content?: string; targetUserId?: string | null; parentId?: string | null };
        const { postId, content, targetUserId, parentId } = body;

        if (!postId || !content) return NextResponse.json({ error: "postId dan content wajib ada" }, { status: 400 });

        const comment = await prisma.comment.create({
            data: {
                content,
                authorId: session.user.id,
                postId,
                parentId: parentId || null,
                targetUserId: targetUserId || null,
            },
            include: {
                author: true,
                targetUser: true,
                replies: {
                    include: {
                        author: true,
                        targetUser: true,
                        replies: true, // nested replies
                    },
                    orderBy: { createdAt: "asc" },
                },
            },
        });

        return NextResponse.json({ success: true, comment });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return NextResponse.json({ error: "Belum login" }, { status: 401 });

        // Accept JSON body { commentId } or query param id
        const url = new URL(req.url);
        const qid = url.searchParams.get("id");
        let commentId: string | undefined = qid || undefined;

        if (!commentId) {
            const body = await req.json().catch(() => ({}));
            commentId = (body && (body as any).commentId) || undefined;
        }

        if (!commentId) return NextResponse.json({ error: "commentId wajib ada" }, { status: 400 });

        const comment = await prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) return NextResponse.json({ error: "Komentar tidak ditemukan" }, { status: 404 });

        if (comment.authorId !== session.user.id && (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Tidak memiliki akses" }, { status: 403 });
        }

        // Recursive delete function
        async function deleteCommentAndReplies(id: string) {
            // Find all direct replies
            const replies = await prisma.comment.findMany({ where: { parentId: id } });
            // Recursively delete each reply
            for (const reply of replies) {
                await deleteCommentAndReplies(reply.id);
            }
            // Delete the comment itself
            await prisma.comment.delete({ where: { id } });
        }

        await deleteCommentAndReplies(commentId);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "error" }, { status: 500 });
    }
}
