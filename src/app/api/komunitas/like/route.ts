import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return NextResponse.json({ error: "Belum login" }, { status: 401 });
    }

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
                    userId: session.user.id,
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

            return NextResponse.json({
                success: true,
                liked: false,
                message: "Post unliked",
            });
        } else {
            const like = await prisma.like.create({
                data: {
                    userId: session.user.id,
                    postId: postId,
                },
            });

            return NextResponse.json({
                success: true,
                liked: true,
                like,
                message: "Post liked",
            });
        }
    } catch (error) {
        console.error("Error toggle like:", error);
        return NextResponse.json({ error: "Gagal toggle like" }, { status: 500 });
    }
}
