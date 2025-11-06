"use server";

import prisma from "@/lib/prisma";

export async function getChannels() {
    const data = await prisma.channel.findMany();
    return data;
}
