"use client";

import InteractiveMap from "@/components/interactive-map";
import { motion } from "framer-motion";
import Image from "next/image";

import illustrationMap from "@/assets/images/illustration-map.jpg";

export default function JelajahiNusantaraPage() {
    return (
        <section className="flex flex-1 flex-col items-center pt-20">
            {/* Map Section */}
            <InteractiveMap />

            <div className="mx-auto mt-16 mb-32 flex w-full max-w-6xl flex-col items-center gap-10 px-4 lg:flex-row">
                {/* Kiri: Teks penjelasan */}
                <motion.div className="flex-1 space-y-4 text-center lg:text-left" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <h2 className="text-3xl leading-snug font-bold">Cara Menggunakan Peta Interaktif</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">Arahkan kursor ke peta untuk melihat nama provinsi dan informasi budayanya. Kamu juga dapat mencari provinsi tertentu melalui kolom pencarian di atas.</p>
                </motion.div>

                {/* Kanan: Gambar ilustrasi */}
                <motion.div className="flex flex-1 items-center justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <Image src={illustrationMap} alt="Ilustrasi peta Indonesia" className="h-auto w-72 object-contain lg:w-96" />
                </motion.div>
            </div>
        </section>
    );
}
