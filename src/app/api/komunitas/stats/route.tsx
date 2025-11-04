import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        // Get total posts
        const totalPosts = await prisma.post.count();

        // Get total users
        const totalUsers = await prisma.user.count();

        // Get total comments
        const totalComments = await prisma.comment.count();

        // Get active users today (users who posted or commented today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const activeUsersToday = await prisma.user.count({
            where: {
                OR: [
                    {
                        Post: {
                            some: {
                                createdAt: {
                                    gte: today,
                                    lt: tomorrow,
                                },
                            },
                        },
                    },
                    {
                        Comment: {
                            some: {
                                createdAt: {
                                    gte: today,
                                    lt: tomorrow,
                                },
                            },
                        },
                    },
                ],
            },
        });

        return NextResponse.json({
            totalPosts,
            totalUsers,
            totalComments,
            activeToday: activeUsersToday,
        });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: "error" }, { status: 500 });
    }
}
