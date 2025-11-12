import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { NextResponse } from "next/server";

export async function GET() {
    const agentId = process.env.ELEVENLABS_AGENT_ID;
    if (!agentId) {
        return NextResponse.json({ error: "ELEVENLABS_AGENT_ID is not set" }, { status: 500 });
    }

    try {
        const elevenlabs = new ElevenLabsClient({
            apiKey: process.env.ELEVENLABS_API_KEY,
        });
        const response = await elevenlabs.conversationalAi.conversations.getSignedUrl({
            agentId,
        });

        return NextResponse.json({ signedUrl: response.signedUrl });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Failed to get signed URL" }, { status: 500 });
    }
}
