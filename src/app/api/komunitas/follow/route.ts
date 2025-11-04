import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = (session.user as any)?.id as string | undefined;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { followingId } = body;

        if (!followingId) {
            return NextResponse.json({ error: "followingId is required" }, { status: 400 });
        }

        if (userId === followingId) {
            return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
        }

        // Check if already following
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: userId,
                    followingId,
                },
            },
        });

        if (existingFollow) {
            return NextResponse.json({ error: "Already following" }, { status: 400 });
        }

        const follow = await prisma.follow.create({
            data: {
                followerId: userId,
                followingId,
            },
        });

        return NextResponse.json({ success: true, follow });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = (session.user as any)?.id as string | undefined;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { followingId } = body;

        if (!followingId) {
            return NextResponse.json({ error: "followingId is required" }, { status: 400 });
        }

        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: userId,
                    followingId,
                },
            },
        });

        if (!follow) {
            return NextResponse.json({ error: "Not following" }, { status: 400 });
        }

        await prisma.follow.delete({
            where: { id: follow.id },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = (session.user as any)?.id as string | undefined;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const followerId = searchParams.get("followerId");
        const followingId = searchParams.get("followingId");

        if (!followerId || !followingId) {
            return NextResponse.json({ error: "followerId and followingId are required" }, { status: 400 });
        }

        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });

        return NextResponse.json({ isFollowing: !!follow });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}