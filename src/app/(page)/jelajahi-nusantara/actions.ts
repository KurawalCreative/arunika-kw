"use server";

import prisma from "@/lib/prisma";
import type { Channel } from "@/generated/prisma/client";

// Simple in-memory cache (per server instance)
const CACHE = new Map<string, { data: Channel | null; expires: number }>();
const TTL = 1000 * 60 * 5; // 5 menit

/**
 * Server action: ambil channel berdasarkan slug, cache hasilnya di memory.
 * @param slug string
 * @returns Channel|null
 */
export async function getChannelBySlug(slug: string): Promise<Channel | null> {
    if (!slug) return null;
    const key = slug.toLowerCase();
    const now = Date.now();
    const cached = CACHE.get(key);
    if (cached && cached.expires > now) return cached.data;
    const channel = await prisma.channel.findUnique({ where: { slug: key } });
    CACHE.set(key, { data: channel, expires: now + TTL });
    return channel;
}
