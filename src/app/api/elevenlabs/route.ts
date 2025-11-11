import { NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY!,
});

export async function POST(req: Request) {
    const body = await req.json();
    const { text } = body;

    if (!text) {
        return new Response(JSON.stringify({ error: "Text is required" }), { status: 400 });
    }

    try {
        const audio = await elevenlabs.textToSpeech.convert("3AwU3nHsI4YWeBJbz6yn", {
            // Replace with the actual voice model ID for Rani
            text,
            modelId: "eleven_multilingual_v2", // Ensure this matches the voice model for Rani
            voiceSettings: {
                stability: 0.5, // Adjust stability for a more natural tone
                similarityBoost: 0.8, // Adjust similarity to match the voice of a young girl
            },
            outputFormat: "mp3_44100_128",
        });

        const reader = audio.getReader();
        const initialBuffer: Uint8Array[] = [];

        // Buffer the first few chunks
        for (let i = 0; i < 3; i++) {
            const { value, done } = await reader.read();
            if (done) break;
            if (value) initialBuffer.push(value);
        }

        const stream = new ReadableStream({
            async start(controller) {
                // Send the initial buffer as one chunk
                if (initialBuffer.length > 0) {
                    controller.enqueue(Buffer.concat(initialBuffer));
                }
            },
            async pull(controller) {
                const { value, done } = await reader.read();
                if (done) {
                    controller.close();
                } else {
                    controller.enqueue(value);
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "audio/mpeg",
                "Transfer-Encoding": "chunked",
                Connection: "keep-alive",
            },
        });
    } catch {
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
