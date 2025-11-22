"use client";

import InteractiveMap from "@/components/interactive-map";
import { motion } from "framer-motion";
import Image from "next/image";

import illustrationMap from "@/assets/images/illustration-map.jpg";
import illustrationMapDark from "@/assets/images/illustration-map-dark.jpeg";

export default function JelajahiNusantaraPage() {
    return (
        <section className="flex min-h-screen flex-1 flex-col items-center bg-white pt-20 dark:bg-gray-900">
            {/* Intro headline above map */}
            <div className="w-full">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
                    <motion.div className="mb-6 flex flex-col gap-3 text-center lg:text-left" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                        <p className="text-xs font-semibold tracking-[0.4em] text-sky-500 uppercase dark:text-sky-300">Peta Interaktif</p>
                        <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl dark:text-white">Jelajahi Nusantara dengan cara baru</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Selusuri kebudayaan dan cerita di tiap provinsi: mulai dari peta detail hingga rekomendasi kegiatan lokal, semuanya terintegrasi di satu layar.</p>
                    </motion.div>
                </div>
            </div>

            {/* Map Section */}
            <InteractiveMap />

            <div className="mx-auto mt-8 mb-16 flex w-full max-w-7xl flex-col items-center gap-8 px-4 sm:mt-16 sm:mb-32 sm:gap-10 lg:flex-row">
                {/* Kiri: Teks penjelasan */}
                <motion.div className="flex-1 space-y-4 text-center lg:text-left" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <h2 className="text-2xl leading-snug font-bold text-gray-900 sm:text-3xl dark:text-white">Cara Menggunakan Peta Interaktif</h2>
                    <p className="text-base text-gray-600 sm:text-lg dark:text-gray-300">Arahkan kursor ke peta untuk melihat nama provinsi dan informasi budayanya. Kamu juga dapat mencari provinsi tertentu melalui kolom pencarian di atas.</p>
                </motion.div>

                {/* Kanan: Gambar ilustrasi */}
                <motion.div className="flex flex-1 items-center justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <Image src={illustrationMapDark} alt="Ilustrasi peta Indonesia dark" className="hidden h-auto w-64 rounded-lg object-contain sm:w-72 lg:w-96 dark:block" sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 384px" />
                    <Image src={illustrationMap} alt="Ilustrasi peta Indonesia" className="block h-auto w-64 rounded-lg object-contain sm:w-72 lg:w-96 dark:hidden" sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 384px" />
                </motion.div>
            </div>
        </section>
    );
}
