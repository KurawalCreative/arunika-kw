import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "@/lib/s3";

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as { fileName?: string | null; fileType?: string | null };
        const { fileName, fileType } = body;

        if (!fileType || !fileName) {
            throw new Error("fileName dan fileType wajib ada");
        }

        const ext = fileName.includes(".") ? fileName.split(".").pop() : "";
        const randomName = Math.random().toString(36).substring(2, 10);
        const key = ext ? `posts/${Date.now()}-${randomName}.${ext}` : `posts/${Date.now()}-${randomName}`;

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET!,
            Key: key,
            ContentType: fileType,
        });

        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

        const fileUrl = `${process.env.NEXT_PUBLIC_S3_PUBLIC_URL!}/${key}`;

        return NextResponse.json({ uploadUrl, fileUrl });
    } catch (err: any) {
        const message = err?.message ?? "fileName dan fileType wajib ada";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
