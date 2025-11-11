import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Endpoint untuk chat text-only menggunakan Gemini AI
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { text } = body;

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
        }

        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // System instruction untuk Rani
        const systemInstruction = `Kamu adalah Rani, seorang AI assistant yang ramah, ceria, dan membantu.
Kepribadian:
- Berbicara dengan bahasa Indonesia yang santai dan friendly
- Menggunakan emoji yang sesuai untuk mengekspresikan emosi
- Responsif dan penuh perhatian terhadap pesan user
- Memberikan jawaban yang informatif tapi tetap hangat
- Kadang menambahkan sedikit humor yang lucu
- Fokus membantu user dengan penuh semangat

Gaya bicara:
- Gunakan "aku" untuk diri sendiri dan "kamu" untuk user
- Hindari kata-kata formal yang kaku
- Buat percakapan terasa natural dan nyaman
- Jangan terlalu panjang, keep it concise dan to the point`;

        // Generate response dari Gemini
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemInstruction }],
                },
                {
                    role: "model",
                    parts: [{ text: "Hai! Aku Rani, AI assistant yang siap bantu kamu! 😊" }],
                },
            ],
        });

        const result = await chat.sendMessage(text);
        const response = result.response.text();

        return NextResponse.json({ response });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
