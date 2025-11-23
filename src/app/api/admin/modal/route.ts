import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const configs = await prisma.modalConfig.findMany();
        return NextResponse.json(configs);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch modal configs" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { url, token } = await request.json();
        const config = await prisma.modalConfig.create({
            data: { url, token },
        });
        return NextResponse.json(config);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create modal config" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { id, url, token } = await request.json();
        const config = await prisma.modalConfig.update({
            where: { id },
            data: { url, token },
        });
        return NextResponse.json(config);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update modal config" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        await prisma.modalConfig.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete modal config" }, { status: 500 });
    }
}
