import prisma from "@/lib/prisma";

const channels = [
    { name: "Aceh", slug: "aceh", description: "Peugah" },
    { name: "Sumatera Utara", slug: "sumatera-utara", description: "Horas!" },
    { name: "Sumatera Barat", slug: "sumatera-barat", description: "Alahai!" },
    { name: "Riau", slug: "riau", description: "Apa khabar!" },
    { name: "Kepulauan Riau", slug: "kepulauan-riau", description: "Apa khabar!" },
    { name: "Jambi", slug: "jambi", description: "Apa khabar!" },
    { name: "Bengkulu", slug: "bengkulu", description: "Apa khabar!" },
    { name: "Sumatera Selatan", slug: "sumatera-selatan", description: "Horas!" },
    { name: "Kepulauan Bangka Belitung", slug: "kepulauan-bangka-belitung", description: "Apa khabar!" },
    { name: "Lampung", slug: "lampung", description: "Mellamo" },
    { name: "Banten", slug: "banten", description: "Wilujeng sumping" },
    { name: "Jawa Barat", slug: "jawa-barat", description: "Wilujeng sumping" },
    { name: "Jawa Tengah", slug: "jawa-tengah", description: "Sugeng rawuh" },
    { name: "Daerah Istimewa Yogyakarta", slug: "daerah-istimewa-yogyakarta", description: "Sugeng rawuh" },
    { name: "Jawa Timur", slug: "jawa-timur", description: "Sugeng rawuh" },
    { name: "DKI Jakarta", slug: "dki-jakarta", description: "Assalamualaikum" },
    { name: "Bali", slug: "bali", description: "Om Swastiastu" },
    { name: "Nusa Tenggara Barat", slug: "nusa-tenggara-barat", description: "Rampes" },
    { name: "Nusa Tenggara Timur", slug: "nusa-tenggara-timur", description: "Rusa" },
    { name: "Kalimantan Barat", slug: "kalimantan-barat", description: "Apa khabar!" },
    { name: "Kalimantan Tengah", slug: "kalimantan-tengah", description: "Apa khabar!" },
    { name: "Kalimantan Selatan", slug: "kalimantan-selatan", description: "Salam Banjar" },
    { name: "Kalimantan Timur", slug: "kalimantan-timur", description: "Apa khabar!" },
    { name: "Kalimantan Utara", slug: "kalimantan-utara", description: "Apa khabar!" },
    { name: "Sulawesi Utara", slug: "sulawesi-utara", description: "Torang samua basudara" },
    { name: "Gorontalo", slug: "gorontalo", description: "Helo Hulontalo" },
    { name: "Sulawesi Tengah", slug: "sulawesi-tengah", description: "Apa khabar!" },
    { name: "Sulawesi Barat", slug: "sulawesi-barat", description: "Apa khabar!" },
    { name: "Sulawesi Selatan", slug: "sulawesi-selatan", description: "Assalamu'alaikum" },
    { name: "Sulawesi Tenggara", slug: "sulawesi-tenggara", description: "Apa khabar!" },
    { name: "Maluku", slug: "maluku", description: "Halo Maluku" },
    { name: "Maluku Utara", slug: "maluku-utara", description: "Halo Maluku Utara" },
    { name: "Papua Barat", slug: "papua-barat", description: "Along" },
    { name: "Papua", slug: "papua", description: "Along" },
    { name: "Papua Tengah", slug: "papua-tengah", description: "Along" },
    { name: "Papua Pegunungan", slug: "papua-pegunungan", description: "Along" },
    { name: "Papua Selatan", slug: "papua-selatan", description: "Along" },
    { name: "Papua Barat Daya", slug: "papua-barat-daya", description: "Along" },
];

async function main() {
    try {
        for (const ch of channels) {
            if (!ch.slug) continue;
            await prisma.channel.upsert({
                where: { slug: ch.slug },
                update: {
                    name: ch.name,
                    description: ch.description,
                    updatedAt: new Date(),
                },
                create: {
                    name: ch.name,
                    slug: ch.slug,
                    description: ch.description,
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
