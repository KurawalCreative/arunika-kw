import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session) {
        return NextResponse.json({ error: "Belum login" }, { status: 401 });
    }
    const userId = (session.user as any)?.id as string | undefined;
    if (!userId) return NextResponse.json({ error: "Belum login" }, { status: 401 });

    try {
        const { postId } = await req.json();

        if (!postId) {
            return NextResponse.json({ error: "Post ID tidak ditemukan" }, { status: 400 });
        }

        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return NextResponse.json({ error: "Post tidak ditemukan" }, { status: 404 });
        }

        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: userId,
                    postId: postId,
                },
            },
        });

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            });

            const newCount = await prisma.like.count({ where: { postId } });

            return NextResponse.json({
                success: true,
                liked: false,
                likesCount: newCount,
                message: "Post unliked",
            });
        } else {
            await prisma.like.create({
                data: {
                    userId: userId,
                    postId: postId,
                },
            });

            const newCount = await prisma.like.count({ where: { postId } });

            return NextResponse.json({
                success: true,
                liked: true,
                likesCount: newCount,
                message: "Post liked",
            });
        }
    } catch (error) {
        console.error("Error toggle like:", error);
        return NextResponse.json({ error: "Gagal toggle like" }, { status: 500 });
    }
}
