import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const imageFile = formData.get("image") as File;
        const prompt = formData.get("prompt") as string;

        if (!imageFile || !prompt) {
            return NextResponse.json({ error: "Image and prompt are required" }, { status: 400 });
        }

        // Convert file to base64
        const bytes = await imageFile.arrayBuffer();
        const base64Image = Buffer.from(bytes).toString("base64");

        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: imageFile.type,
            },
        };

        const result = await model.generateContent([`Edit this image based on the following prompt: ${prompt}`, imagePart]);

        const response = await result.response;
        const text = response.text();

        // Placeholder: return the original image as base64 for now
        const base64 = Buffer.from(bytes).toString("base64");
        return NextResponse.json({ image: `data:${imageFile.type};base64,${base64}` });
    } catch (error) {
        console.error("Error processing image with Gemini:", error);
        return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
    }
}
