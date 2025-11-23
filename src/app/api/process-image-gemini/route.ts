import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const image = formData.get("image") as File;
        const prompt = formData.get("prompt") as string;

        if (!image || !prompt) {
            return NextResponse.json({ error: "Image and prompt are required" }, { status: 400 });
        }

        // Prepare FormData for Gemini API
        const geminiFormData = new FormData();
        geminiFormData.append("image", image);
        geminiFormData.append("prompt", prompt);

        const response = await axios.post("https://test-saja-production.up.railway.app/generate", geminiFormData, {
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
