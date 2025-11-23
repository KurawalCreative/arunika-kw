import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const image = formData.get("image") as File;
        const pakaian_id = formData.get("pakaian_id") as string;

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        // Get URLs from env and pick one randomly for round-robin
        const urls = process.env.MODAL_URLS?.split(",");
        if (!urls || urls.length === 0) {
            return NextResponse.json({ error: "No Modal URLs configured" }, { status: 500 });
        }
        const selectedUrl = urls[Math.floor(Math.random() * urls.length)];

        const modalFormData = new FormData();
        modalFormData.append("pakaian_id", pakaian_id);
        modalFormData.append("image", image);

        const seed = Math.floor(Math.random() * 999) + 1;
        modalFormData.append("seed", seed.toString());

        const response = await axios.post(`${selectedUrl}/generate`, modalFormData, {
            headers: {
                Authorization: `Bearer ${process.env.MODAL_ACCESS_TOKEN}`,
                "Content-Type": "multipart/form-data",
            },
        });

        // The response is JSON with url
        const data = response.data;
        return NextResponse.json({ image: data.url });
    } catch (error) {
        console.error("Error processing image with Modal:", error);
        return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
    }
}
