import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const tags = await prisma.tag.findMany({
            select: {
                name: true,
                _count: {
                    select: { posts: true },
                },
            },
            orderBy: {
                posts: { _count: "desc" },
            },
            take: 10,
        });

        const popularTags = tags.map((tag) => ({
            name: tag.name,
            count: tag._count.posts,
        }));

        return NextResponse.json({ tags: popularTags });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: "error" }, { status: 500 });
    }
}
