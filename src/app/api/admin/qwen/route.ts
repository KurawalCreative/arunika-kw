import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const tokens = await prisma.qwenToken.findMany();
        return NextResponse.json(tokens);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch qwen tokens" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();
        const qwenToken = await prisma.qwenToken.create({
            data: { token },
        });
        return NextResponse.json(qwenToken);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create qwen token" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { id, token: tokenValue } = await request.json();
        const qwenToken = await prisma.qwenToken.update({
            where: { id },
            data: { token: tokenValue },
        });
        return NextResponse.json(qwenToken);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update qwen token" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        await prisma.qwenToken.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete qwen token" }, { status: 500 });
    }
}
