import { Channel } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

const channels = [
    { name: "Aceh", slug: "aceh", description: "Peugah", region: "Sumatera" },
    { name: "Sumatera Utara", slug: "sumatera-utara", description: "Horas!", region: "Sumatera" },
    { name: "Sumatera Barat", slug: "sumatera-barat", description: "Alahai!", region: "Sumatera" },
    { name: "Riau", slug: "riau", description: "Apa khabar!", region: "Sumatera" },
    { name: "Kepulauan Riau", slug: "kepulauan-riau", description: "Apa khabar!", region: "Sumatera" },
    { name: "Jambi", slug: "jambi", description: "Apa khabar!", region: "Sumatera" },
    { name: "Bengkulu", slug: "bengkulu", description: "Apa khabar!", region: "Sumatera" },
    { name: "Sumatera Selatan", slug: "sumatera-selatan", description: "Horas!", region: "Sumatera" },
    { name: "Kepulauan Bangka Belitung", slug: "kepulauan-bangka-belitung", description: "Apa khabar!", region: "Sumatera" },
    { name: "Lampung", slug: "lampung", description: "Mellamo", region: "Sumatera" },
    { name: "Banten", slug: "banten", description: "Wilujeng sumping", region: "Jawa" },
    { name: "Jawa Barat", slug: "jawa-barat", description: "Wilujeng sumping", region: "Jawa" },
    { name: "Jawa Tengah", slug: "jawa-tengah", description: "Sugeng rawuh", region: "Jawa" },
    { name: "Daerah Istimewa Yogyakarta", slug: "daerah-istimewa-yogyakarta", description: "Sugeng rawuh", region: "Jawa" },
    { name: "Jawa Timur", slug: "jawa-timur", description: "Sugeng rawuh", region: "Jawa" },
    { name: "DKI Jakarta", slug: "dki-jakarta", description: "Assalamualaikum", region: "Jawa" },
    { name: "Bali", slug: "bali", description: "Om Swastiastu", region: "Bali dan Nusa Tenggara" },
    { name: "Nusa Tenggara Barat", slug: "nusa-tenggara-barat", description: "Rampes", region: "Bali dan Nusa Tenggara" },
    { name: "Nusa Tenggara Timur", slug: "nusa-tenggara-timur", description: "Rusa", region: "Bali dan Nusa Tenggara" },
    { name: "Kalimantan Barat", slug: "kalimantan-barat", description: "Apa khabar!", region: "Kalimantan" },
    { name: "Kalimantan Tengah", slug: "kalimantan-tengah", description: "Apa khabar!", region: "Kalimantan" },
    { name: "Kalimantan Selatan", slug: "kalimantan-selatan", description: "Salam Banjar", region: "Kalimantan" },
    { name: "Kalimantan Timur", slug: "kalimantan-timur", description: "Apa khabar!", region: "Kalimantan" },
    { name: "Kalimantan Utara", slug: "kalimantan-utara", description: "Apa khabar!", region: "Kalimantan" },
    { name: "Sulawesi Utara", slug: "sulawesi-utara", description: "Torang samua basudara", region: "Sulawesi" },
    { name: "Gorontalo", slug: "gorontalo", description: "Helo Hulontalo", region: "Sulawesi" },
    { name: "Sulawesi Tengah", slug: "sulawesi-tengah", description: "Apa khabar!", region: "Sulawesi" },
    { name: "Sulawesi Barat", slug: "sulawesi-barat", description: "Apa khabar!", region: "Sulawesi" },
    { name: "Sulawesi Selatan", slug: "sulawesi-selatan", description: "Assalamu'alaikum", region: "Sulawesi" },
    { name: "Sulawesi Tenggara", slug: "sulawesi-tenggara", description: "Apa khabar!", region: "Sulawesi" },
    { name: "Maluku", slug: "maluku", description: "Halo Maluku", region: "Maluku" },
    { name: "Maluku Utara", slug: "maluku-utara", description: "Halo Maluku Utara", region: "Maluku" },
    { name: "Papua Barat", slug: "papua-barat", description: "Along", region: "Papua" },
    { name: "Papua", slug: "papua", description: "Along", region: "Papua" },
    { name: "Papua Tengah", slug: "papua-tengah", description: "Along", region: "Papua" },
    { name: "Papua Pegunungan", slug: "papua-pegunungan", description: "Along", region: "Papua" },
    { name: "Papua Selatan", slug: "papua-selatan", description: "Along", region: "Papua" },
    { name: "Papua Barat Daya", slug: "papua-barat-daya", description: "Along", region: "Papua" },
] as Channel[];

async function main() {
    try {
        for (const ch of channels) {
            if (!ch.slug) continue;
            await prisma.channel.upsert({
                where: { slug: ch.slug },
                update: {
                    name: ch.name,
                    description: ch.description,
                    region: ch.region,
                    updatedAt: new Date(),
                },
                create: {
                    name: ch.name,
                    slug: ch.slug,
                    description: ch.description,
                    region: ch.region,
                },
            });
        }
        console.log("Channels upsert completed");
    } catch (e) {
        console.error("Seed error:", e);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }
}

main();
