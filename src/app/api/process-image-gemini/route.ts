import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const image = formData.get("image") as File;
        const prompt = formData.get("prompt") as string;

        if (!image || !prompt) {
            return NextResponse.json({ error: "Image and prompt are required" }, { status: 400 });
        }

        // Get configs from DB and pick one with lowest usageCount for round-robin
        const configs = await prisma.geminiConfig.findMany({ orderBy: { usageCount: "asc" } });
        if (configs.length === 0) {
            return NextResponse.json({ error: "No Gemini configs configured" }, { status: 500 });
        }
        const selectedConfig = configs[0];

        // Increment usageCount
        await prisma.geminiConfig.update({
            where: { id: selectedConfig.id },
            data: { usageCount: selectedConfig.usageCount + 1 },
        });

        // Prepare FormData for Gemini API
        const geminiFormData = new FormData();
        geminiFormData.append("image", image);
        geminiFormData.append("prompt", prompt);

        const response = await axios.post(`${selectedConfig.url}/generate`, geminiFormData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        const jsonResponse = response.data;
        if (jsonResponse.image) {
            return NextResponse.json({ image: jsonResponse.image });
        } else {
            throw new Error("No image in response");
        }
    } catch (error) {
        console.error("Error processing image with Gemini:", error);
        return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
    }
}
