import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { NextResponse } from "next/server";

// Endpoint untuk membuat atau mendapatkan agent dengan konfigurasi security
export async function POST() {
    const elevenlabs = new ElevenLabsClient({
        apiKey: process.env.ELEVENLABS_API_KEY,
    });

    try {
        const agentId = process.env.ELEVENLABS_AGENT_ID;

        // Jika agent ID sudah ada, kembalikan saja
        if (agentId) {
            return NextResponse.json({
                agentId,
                message: "Using existing agent from environment",
            });
        }

        // Jika belum ada, buat agent baru dengan security configuration
        const agent = await elevenlabs.conversationalAi.agents.create({
            conversationConfig: {
                agent: {
                    firstMessage: "Hi. I'm an authenticated agent.",
                },
            },
            platformSettings: {
                auth: {
                    enableAuth: false, // atau true untuk kombinasi dengan signed URL
                    allowlist: [
                        { hostname: "yourapp.vercel.app" },
                        { hostname: "www.yourapp.com" },
                        { hostname: "localhost:3000" }, // untuk development
                        { hostname: "localhost:3001" },
                    ],
                },
            },
        });

        return NextResponse.json({
            agentId: agent.agentId,
            message: "New agent created with security configuration",
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
