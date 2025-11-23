import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const image = formData.get("image") as File;
        const pakaian_id = formData.get("pakaian_id") as string;

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        // Get configs from DB and pick one with lowest usageCount for round-robin
        const configs = await prisma.modalConfig.findMany({ orderBy: { usageCount: "asc" } });
        if (configs.length === 0) {
            return NextResponse.json({ error: "No Modal configs configured" }, { status: 500 });
        }
        const selectedConfig = configs[0];

        // Increment usageCount
        await prisma.modalConfig.update({
            where: { id: selectedConfig.id },
            data: { usageCount: selectedConfig.usageCount + 1 },
        });

        const modalFormData = new FormData();
        modalFormData.append("pakaian_id", pakaian_id);
        modalFormData.append("image", image);

        const seed = Math.floor(Math.random() * 999) + 1;
        modalFormData.append("seed", seed.toString());

        const response = await axios.post(`${selectedConfig.url}/generate`, modalFormData, {
            headers: {
                Authorization: `Bearer ${selectedConfig.token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        // The response is JSON with url
        const data = response.data;
        return NextResponse.json({ image: data.url });
    } catch (error) {
        console.error("Error processing image with Modal:", error);
        return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
    }
}
