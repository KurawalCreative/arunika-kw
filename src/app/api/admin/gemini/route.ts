import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const configs = await prisma.geminiConfig.findMany();
        return NextResponse.json(configs);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch gemini configs" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();
        const config = await prisma.geminiConfig.create({
            data: { url },
        });
        return NextResponse.json(config);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create gemini config" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { id, url } = await request.json();
        const config = await prisma.geminiConfig.update({
            where: { id },
            data: { url },
        });
        return NextResponse.json(config);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update gemini config" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        await prisma.geminiConfig.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete gemini config" }, { status: 500 });
    }
}
