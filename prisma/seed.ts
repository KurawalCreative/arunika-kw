import { Channel } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

const channels = [
    { name: "Publik", slug: "publik", description: "Komunitas untuk semua orang di seluruh Indonesia." },
    { name: "Aceh", slug: "aceh", description: "Peugah! Yuk ngobrol bareng di komunitas Aceh.", region: "Sumatera" },
    { name: "Sumatera Utara", slug: "sumatera-utara", description: "Horas! Gabung ngobrol santai di komunitas Sumut.", region: "Sumatera" },
    { name: "Sumatera Barat", slug: "sumatera-barat", description: "Alahai! Mari bercakap-cakap di komunitas Sumbar.", region: "Sumatera" },
    { name: "Riau", slug: "riau", description: "Apa khabar! Ayo ngobrol bareng di komunitas Riau.", region: "Sumatera" },
    { name: "Kepulauan Riau", slug: "kepulauan-riau", description: "Apa khabar! Yuk saling kenal di komunitas Kepri.", region: "Sumatera" },
    { name: "Jambi", slug: "jambi", description: "Apa khabar! Ayo ngobrol di komunitas Jambi.", region: "Sumatera" },
    { name: "Bengkulu", slug: "bengkulu", description: "Apa khabar! Mari gabung ngobrol di komunitas Bengkulu.", region: "Sumatera" },
    { name: "Sumatera Selatan", slug: "sumatera-selatan", description: "Horas! Yuk saling kenal di komunitas Sumsel.", region: "Sumatera" },
    { name: "Kepulauan Bangka Belitung", slug: "kepulauan-bangka-belitung", description: "Apa khabar! Mari ngobrol santai di komunitas Babel.", region: "Sumatera" },
    { name: "Lampung", slug: "lampung", description: "Mellamo! Gabung ngobrol di komunitas Lampung.", region: "Sumatera" },
    { name: "Banten", slug: "banten", description: "Wilujeng sumping! Yuk ngobrol di komunitas Banten.", region: "Jawa" },
    { name: "Jawa Barat", slug: "jawa-barat", description: "Wilujeng sumping! Ayo ngobrol santai di komunitas Jabar.", region: "Jawa" },
    { name: "Jawa Tengah", slug: "jawa-tengah", description: "Sugeng rawuh! Yuk gabung ngobrol di komunitas Jateng.", region: "Jawa" },
    { name: "Daerah Istimewa Yogyakarta", slug: "daerah-istimewa-yogyakarta", description: "Sugeng rawuh! Mari ngobrol santai di komunitas Jogja.", region: "Jawa" },
    { name: "Jawa Timur", slug: "jawa-timur", description: "Sugeng rawuh! Yuk ngobrol bareng di komunitas Jatim.", region: "Jawa" },
    { name: "DKI Jakarta", slug: "dki-jakarta", description: "Assalamualaikum! Gabung ngobrol di komunitas Jakarta.", region: "Jawa" },
    { name: "Bali", slug: "bali", description: "Om Swastiastu! Yuk kenalan dan ngobrol di komunitas Bali.", region: "Bali dan Nusa Tenggara" },
    { name: "Nusa Tenggara Barat", slug: "nusa-tenggara-barat", description: "Rampes! Gabung ngobrol santai di komunitas NTB.", region: "Bali dan Nusa Tenggara" },
    { name: "Nusa Tenggara Timur", slug: "nusa-tenggara-timur", description: "Rusa! Mari ngobrol bareng di komunitas NTT.", region: "Bali dan Nusa Tenggara" },
    { name: "Kalimantan Barat", slug: "kalimantan-barat", description: "Apa khabar! Yuk ngobrol di komunitas Kalbar.", region: "Kalimantan" },
    { name: "Kalimantan Tengah", slug: "kalimantan-tengah", description: "Apa khabar! Gabung ngobrol di komunitas Kalteng.", region: "Kalimantan" },
    { name: "Kalimantan Selatan", slug: "kalimantan-selatan", description: "Salam Banjar! Mari ngobrol santai di komunitas Kalsel.", region: "Kalimantan" },
    { name: "Kalimantan Timur", slug: "kalimantan-timur", description: "Apa khabar! Yuk gabung ngobrol di komunitas Kaltim.", region: "Kalimantan" },
    { name: "Kalimantan Utara", slug: "kalimantan-utara", description: "Apa khabar! Mari ngobrol di komunitas Kaltara.", region: "Kalimantan" },
    { name: "Sulawesi Utara", slug: "sulawesi-utara", description: "Torang samua basudara! Yuk ngobrol di komunitas Sulut.", region: "Sulawesi" },
    { name: "Gorontalo", slug: "gorontalo", description: "Helo Hulontalo! Gabung ngobrol santai di komunitas Gorontalo.", region: "Sulawesi" },
    { name: "Sulawesi Tengah", slug: "sulawesi-tengah", description: "Apa khabar! Mari ngobrol di komunitas Sulteng.", region: "Sulawesi" },
    { name: "Sulawesi Barat", slug: "sulawesi-barat", description: "Apa khabar! Yuk ngobrol bareng di komunitas Sulbar.", region: "Sulawesi" },
    { name: "Sulawesi Selatan", slug: "sulawesi-selatan", description: "Assalamu'alaikum! Gabung ngobrol di komunitas Sulsel.", region: "Sulawesi" },
    { name: "Sulawesi Tenggara", slug: "sulawesi-tenggara", description: "Apa khabar! Mari ngobrol santai di komunitas Sultra.", region: "Sulawesi" },
    { name: "Maluku", slug: "maluku", description: "Halo Maluku! Yuk ngobrol bareng di komunitas Maluku.", region: "Maluku" },
    { name: "Maluku Utara", slug: "maluku-utara", description: "Halo Maluku Utara! Gabung ngobrol santai di komunitas Malut.", region: "Maluku" },
    { name: "Papua Barat", slug: "papua-barat", description: "Along! Yuk ngobrol bareng di komunitas Papua Barat.", region: "Papua" },
    { name: "Papua", slug: "papua", description: "Along! Gabung ngobrol santai di komunitas Papua.", region: "Papua" },
    { name: "Papua Tengah", slug: "papua-tengah", description: "Along! Mari ngobrol bareng di komunitas Papua Tengah.", region: "Papua" },
    { name: "Papua Pegunungan", slug: "papua-pegunungan", description: "Along! Yuk gabung ngobrol di komunitas Papua Pegunungan.", region: "Papua" },
    { name: "Papua Selatan", slug: "papua-selatan", description: "Along! Mari ngobrol santai di komunitas Papua Selatan.", region: "Papua" },
    { name: "Papua Barat Daya", slug: "papua-barat-daya", description: "Along! Yuk ngobrol bareng di komunitas Papua Barat Daya.", region: "Papua" },
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
