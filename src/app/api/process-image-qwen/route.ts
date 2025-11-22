import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const imageFile = formData.get("image") as File;
        const prompt = formData.get("prompt") as string;

        if (!imageFile || !prompt) {
            return NextResponse.json({ error: "Image and prompt are required" }, { status: 400 });
        }

        // Prepare FormData for Qwen API
        const qwenFormData = new FormData();
        qwenFormData.append("image", imageFile);
        qwenFormData.append("prompt", prompt);

        const response = await axios.post("https://qwen.aikit.club/v1/images/edits", qwenFormData, {
            headers: {
                Authorization: `Bearer ${process.env.QWEN_ACCESS_TOKEN}`,
                "Content-Type": "multipart/form-data",
            },
        });

        const jsonResponse = response.data;
        if (jsonResponse.data && jsonResponse.data[0] && jsonResponse.data[0].url) {
            const imageUrl = jsonResponse.data[0].url;
            const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
            const base64 = Buffer.from(imageResponse.data).toString("base64");
            return NextResponse.json({ image: `data:image/png;base64,${base64}` });
        } else {
            throw new Error("No image URL in response");
        }
    } catch (error) {
        console.error("Error processing image with Qwen:", error);
        return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
    }
}
