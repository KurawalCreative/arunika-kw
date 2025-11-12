import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { province, description } = await req.json();

    if (!province) {
      return NextResponse.json({ error: "Nama provinsi diperlukan." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

    const prompt = `
      Buat 3 pertanyaan kuis pilihan ganda tentang budaya, tarian, makanan, dan tradisi dari provinsi ${province}.
      Gunakan deskripsi berikut sebagai referensi tambahan: ${description || "Tidak ada deskripsi tambahan."}
      Format output HARUS JSON murni tanpa teks tambahan, tanpa markdown, tanpa \`\`\`json.
      Contoh format yang diharapkan:
      {
        "province": "${province}",
        "questions": [
          {
            "question": "Apa nama tarian khas dari ${province}?",
            "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
            "answer": "Pilihan A",
            "explanation": "Penjelasan singkat tentang jawabannya."
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // 🧹 Bersihkan format markdown & ekstrak isi JSON valid
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/^[^{]*({[\s\S]*})[^}]*$/m, "$1") // Ambil isi {...} saja
      .trim();

    let data;

    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("Gagal parse JSON mentah:", text);
      throw new Error("Format output AI tidak valid, gagal parse JSON.");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error generating quiz:", error);
    return NextResponse.json(
      { error: error.message || "Gagal membuat kuis." },
      { status: 500 }
    );
  }
}
