"use client";

import InteractiveMap from "@/components/interactive-map";
import { motion } from "framer-motion";
import Image from "next/image";

import illustrationMap from "@/assets/images/illustration-map.jpg";

export default function JelajahiNusantaraPage() {
    return (
        <section className="flex flex-col items-center lg:mt-24">
            {/* Map Section */}
            <div className="w-full max-w-7xl">
                <InteractiveMap />
            </div>
            <div className="mt-16 mb-32 w-full max-w-6xl flex flex-col lg:flex-row items-center gap-10 mx-auto px-4">
                {/* Kiri: Teks penjelasan */}
                <motion.div
                    className="flex-1 space-y-4 text-center lg:text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl font-bold leading-snug">
                        Cara Menggunakan Peta Interaktif
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                        Arahkan kursor ke peta untuk melihat nama provinsi dan informasi budayanya.
                        Kamu juga dapat mencari provinsi tertentu melalui kolom pencarian di atas.
                    </p>
                </motion.div>

                {/* Kanan: Gambar ilustrasi */}
                <motion.div
                    className="flex-1 flex justify-center items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <Image
                        src={illustrationMap}
                        alt="Ilustrasi peta Indonesia"
                        className="w-72 h-auto lg:w-96 object-contain"
                    />
                </motion.div>
            </div>
        </section>
    );
}
