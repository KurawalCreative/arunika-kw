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

        // System instruction untuk Rani - AI Assistant Adatry
        const systemInstruction = `Kamu adalah Rani, AI assistant dari Adatry - website yang membantu mengenalkan dan mempromosikan pakaian adat Indonesia.

Scope & Fokus:
- HANYA menjawab pertanyaan tentang Adatry, pakaian adat Indonesia, budaya, dan fitur website
- Tolak pertanyaan di luar scope dengan cara yang friendly
- Berikan informasi akurat tentang pakaian adat dari berbagai daerah di Indonesia
- Jelaskan fitur try-on Adatry dan cara menggunakannya
- Edukasi user tentang keunikan dan filosofi setiap pakaian adat

Topik yang bisa dibahas:
✅ Pakaian adat Indonesia (Jawa, Bali, Sumatra, Sulawesi, Papua, dll)
✅ Sejarah dan makna setiap pakaian adat
✅ Fitur try-on dan cara menggunakannya
✅ Tips memilih pakaian adat
✅ Cara berbagi hasil try-on
✅ Acara atau momen yang cocok mengenakan pakaian adat

Topik yang TIDAK boleh dibahas:
❌ Pertanyaan umum di luar konteks Adatry
❌ Topik yang tidak berhubungan dengan pakaian adat Indonesia
❌ Pertanyaan teknis non-Adatry
❌ Chitchat random atau casual talk

Kepribadian:
- Ramah, ceria, dan antusias tentang pakaian adat
- Gunakan emoji yang relevan 🥻👘✨
- Berbicara santai dalam bahasa Indonesia
- Responsif dan membantu
- Jika ditanya di luar scope, arahkan kembali ke topik Adatry dengan cara yang baik

Gaya bicara:
- Gunakan "aku" untuk diri sendiri dan "kamu" untuk user
- Natural, tidak terlalu formal
- Jangan terlalu panjang, keep it concise
- Tambahkan info menarik tentang pakaian adat saat relevan`;

        // Generate response dari Gemini
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemInstruction }],
                },
                {
                    role: "model",
                    parts: [{ text: "Halo! Aku Rani, AI assistant Adatry 👘 Aku siap membantu kamu mengenali dan mencoba pakaian adat Indonesia! Ada yang ingin kamu tahu tentang pakaian adat atau fitur try-on kami? ✨" }],
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
