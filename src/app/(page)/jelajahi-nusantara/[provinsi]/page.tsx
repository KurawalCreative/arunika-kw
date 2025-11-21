import Image from "next/image";
import QuizSection from "@/components/quiz/QuizSection";
import CultureTabs from "@/components/provinsi/CultureTabs";
import Hero from "@/components/provinsi/Hero";
import Stats from "@/components/provinsi/Stats";
import Video from "@/components/provinsi/Video";
import { getChannelBySlug } from "@/app/(page)/jelajahi-nusantara/actions";
import { notFound } from "next/navigation";

// Ubah tipe PageProps
type PageProps = {
    params: Promise<{ provinsi: string }>;
};

export default async function page({ params }: PageProps) {
    // Ubah ke async dan ambil params dengan await
    const { provinsi } = await params;

    // Konversi slug ke nama provinsi (contoh: "papua-barat-daya" -> "Papua Barat Daya")
    const provinceName = provinsi
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    // Ambil data dari database menggunakan server action
    const channelData = await getChannelBySlug(provinsi);

    // Jika data tidak ditemukan, tampilkan halaman 404
    if (!channelData) {
        notFound();
    }

    // Siapkan data provinsi dari database
    const provinceData = {
        name: channelData.name ?? provinceName,
        description: channelData.deskripsi2 ?? channelData.description ?? "",
        ibuKota: channelData.ibu_kota,
        pulau: channelData.pulau,
        bahasa: channelData.bahasa?.join(", ") ?? "",
        kuliner: channelData.kuliner?.join(", ") ?? "",
    };

    return (
        <div className="relative">
            {/* Hero Section - Client Component */}
            <Hero provinceName={provinceData.name} description={provinceData.description} />

            {/* Stats Section */}
            <Stats />

            {/* Culture Tabs - Client Component */}
            <div className="relative bg-white">
                <CultureTabs data={provinceData} />

                {/* Video Section - Client Component */}
                <Video />
                {/* QUiz Section */}
                <QuizSection province={provinceData.name} description={provinceData.description} />
                <div className="mb-20"></div>
            </div>
        </div>
    );
}
