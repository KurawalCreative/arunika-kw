"use client";

import InteractiveMap from "@/components/interactive-map";
import { motion } from "framer-motion";
import Image from "next/image";

import illustrationMap from "@/assets/images/map-illustration.png";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function JelajahiNusantaraPage() {
    return (
        <section className="flex min-h-screen flex-1 flex-col items-center bg-white pt-8 dark:bg-neutral-900">
            {/* Intro headline above map */}
            <div className="w-full">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
                    <motion.div className="mb-6 flex flex-col gap-3 text-center lg:text-left" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                        <h1 className="text-text-primary text-3xl font-semibold sm:text-4xl dark:text-white">
                            Jelajahi 38 Provinsi lewat <span className="text-primary-blue dark:text-blue-400">Pakaian Adat Indonesia</span>
                        </h1>
                        <p className="text-text-secondary mx-auto max-w-3xl text-sm lg:mx-0 dark:text-gray-300">Cukup klik provinsi di peta, pilih pakaian adatnya, lalu unggah foto Anda. Dalam hitungan detik, pakaian adat akan terpasang secara realistis — lengkap dengan cerita dan makna di balik setiap motif.</p>
                    </motion.div>
                </div>
            </div>

            {/* Map Section */}
            <InteractiveMap />

            <div className="mx-auto mt-8 mb-16 flex w-full max-w-7xl flex-col items-center gap-8 px-4 sm:mt-16 sm:mb-32 sm:gap-10 lg:flex-row">
                {/* Kiri: Gambar ilustrasi */}
                <motion.div className="hidden flex-1 items-center justify-center lg:flex" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <Image src={illustrationMap} alt="Ilustrasi peta Indonesia" className="h-auto w-64 rounded-lg object-contain sm:w-72 lg:w-96" />
                </motion.div>

                {/* Kanan: Teks penjelasan */}
                <motion.div className="flex-1 text-start mt-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <h2 className="text-text-primary text-2xl leading-snug font-bold sm:text-3xl dark:text-white">
                        Cara Menggunakan <span className="text-primary-blue dark:text-primary-blue-dark">Peta Interaktif</span>
                    </h2>
                    <p className="text-text-secondary text-base sm:text-lg dark:text-gray-300">Arahkan kursor atau sentuh provinsi yang ingin Anda kunjungi. Semua informasi dan pakaian adat akan langsung tersedia.</p>
                    <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Cara Mencoba Pakaian Adat Secara Virtual</AccordionTrigger>
                            <AccordionContent className="text-text-secondary space-y-3 text-base leading-relaxed dark:text-gray-300">
                                <p>1. Klik salah satu provinsi pada peta</p>
                                <p>2. Pilih pakaian adat yang diinginkan (tersedia untuk pria, wanita, dan anak-anak)</p>
                                <p>3. Unggah foto wajah atau seluruh badan</p>
                                <p>4. Dalam 2-3 detik, pakaian adat akan terpasang dengan presisi tinggi</p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2">
                            <AccordionTrigger>Penjelasan & Cerita di Balik Pakaian Adat</AccordionTrigger>
                            <AccordionContent className="text-text-secondary space-y-3 text-base leading-relaxed dark:text-gray-300">
                                <p>Setelah memakai pakaian adat, Anda akan mendapatkan informasi lengkap:</p>
                                <p>• Makna filosofis warna dan motif</p>
                                <p>• Sejarah serta asal-usul busana</p>
                                <p>• Konteks penggunaan dalam upacara adat</p>
                                <p>• Tersedia dalam teks dan narasi audio</p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3">
                            <AccordionTrigger>Menyimpan & Membagikan Hasil</AccordionTrigger>
                            <AccordionContent className="text-text-secondary space-y-3 text-base leading-relaxed dark:text-gray-300">
                                <p>• Unduh foto berkualitas tinggi secara langsung</p>
                                <p>• Bagikan ke media sosial hanya dengan satu klik</p>
                                <p>• Daftar akun gratis untuk menyimpan seluruh koleksi dan lencana provinsi</p>
                                <p>• Kumpulkan 38 lencana untuk mendapatkan gelar “Penjaga Warisan Nusantara”</p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </motion.div>
            </div>
        </section>
    );
}
