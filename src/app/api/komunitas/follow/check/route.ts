import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const followerId = searchParams.get("followerId");
        const followingIds = searchParams.get("followingIds");

        if (!followerId) {
            return NextResponse.json({ error: "followerId is required" }, { status: 400 });
        }

        // If followingIds is provided, check multiple relationships
        if (followingIds) {
            const ids = followingIds.split(',').filter(id => id.trim());
            if (ids.length === 0) {
                return NextResponse.json({ error: "followingIds cannot be empty" }, { status: 400 });
            }

            const follows = await prisma.follow.findMany({
                where: {
                    followerId,
                    followingId: {
                        in: ids
                    }
                },
                select: {
                    followingId: true
                }
            });

            const followingSet = new Set(follows.map(f => f.followingId));
            const results = ids.reduce((acc, id) => {
                acc[id] = followingSet.has(id);
                return acc;
            }, {} as Record<string, boolean>);

            return NextResponse.json({ followingStatus: results });
        }

        // Single check (backward compatibility)
        const followingId = searchParams.get("followingId");
        if (!followingId) {
            return NextResponse.json({ error: "followingId or followingIds is required" }, { status: 400 });
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