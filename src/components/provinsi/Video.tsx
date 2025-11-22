"use client";

import { motion } from "framer-motion";

interface VideoData {
    title: string;
    description: string;
    videoUrl: string;
    duration: string;
    rating: string;
    views: string;
    year: string;
}

const defaultVideoData: VideoData = {
    title: "Petualangan Timun Mas: Legenda Perlindungan dan Keberanian",
    description: "Dokumentasi cerita rakyat klasik yang mengajarkan tentang keberanian, kecerdikan, dan bagaimana menghadapi tantangan dengan bijak. Sebuah narasi yang telah diturunkan turun-temurun dari generasi ke generasi.",
    videoUrl: "https://www.youtube.com/embed/SQ1DCsHBnU8?si=Ffz_dfZHYu0wjsdP",
    duration: "12:45",
    rating: "⭐ 4.8",
    views: "125K+",
    year: "2024",
};

const tags = ["Cerita Rakyat", "Dokumenter", "Budaya Indonesia", "Pendidikan", "Keluarga"];

interface VideoProps {
    videoData?: VideoData;
}

export default function Video({ videoData = defaultVideoData }: VideoProps) {
    return (
        <div className="bg-linear-to-b from-orange-50 to-white px-4 py-12 md:px-6 md:py-20 dark:from-gray-800 dark:to-gray-900">
            <motion.div className="mx-auto max-w-5xl" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <div className="mb-10 text-center md:mb-16">
                    <motion.h2 className="mb-3 text-2xl font-bold text-gray-800 md:mb-4 md:text-4xl dark:text-white" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        📖 Cerita Rakyat & Budaya
                    </motion.h2>
                    <motion.p className="mx-auto max-w-3xl px-4 text-sm text-gray-600 md:text-lg dark:text-gray-400" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                        Saksikan dokumentasi menarik tentang kekayaan cerita rakyat dan warisan budaya daerah yang dipenuhi dengan nilai-nilai tradisional dan kebijaksanaan leluhur
                    </motion.p>
                </div>

                <motion.div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}>
                    {/* Video Container */}
                    <div className="relative w-full bg-black dark:bg-gray-950" style={{ paddingBottom: "56.25%" }}>
                        <iframe className="absolute top-0 left-0 h-full w-full" src={videoData.videoUrl} title="Cerita Rakyat dan Budaya" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                    </div>

                    {/* Card Info */}
                    <div className="p-4 md:p-8">
                        <div className="mb-4 flex flex-col items-start justify-between md:mb-6 md:flex-row">
                            <div className="flex-1">
                                <h3 className="mb-2 text-lg font-bold text-gray-800 md:text-2xl dark:text-white">{videoData.title}</h3>
                                <p className="mb-4 text-sm text-gray-600 md:text-base dark:text-gray-300">{videoData.description}</p>
                            </div>
                            <motion.div className="ml-0 text-3xl md:ml-4 md:text-5xl" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                                🎬
                            </motion.div>
                        </div>

                        {/* Stats Grid */}
                        <div className="mb-4 grid grid-cols-2 gap-3 border-b border-gray-200 pb-4 md:mb-6 md:grid-cols-4 md:gap-4 md:pb-6 dark:border-gray-700">
                            <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                                <p className="text-lg font-bold text-orange-500 md:text-2xl dark:text-orange-400">{videoData.duration}</p>
                                <p className="text-xs text-gray-600 md:text-sm dark:text-gray-400">Durasi Video</p>
                            </motion.div>
                            <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                                <p className="text-lg font-bold text-orange-500 md:text-2xl dark:text-orange-400">{videoData.rating}</p>
                                <p className="text-xs text-gray-600 md:text-sm dark:text-gray-400">Rating</p>
                            </motion.div>
                            <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                                <p className="text-lg font-bold text-orange-500 md:text-2xl dark:text-orange-400">{videoData.views}</p>
                                <p className="text-xs text-gray-600 md:text-sm dark:text-gray-400">Views</p>
                            </motion.div>
                            <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                                <p className="text-lg font-bold text-orange-500 md:text-2xl dark:text-orange-400">{videoData.year}</p>
                                <p className="text-xs text-gray-600 md:text-sm dark:text-gray-400">Tahun Produksi</p>
                            </motion.div>
                        </div>

                        {/* Tags */}
                        <div className="mb-4 md:mb-6">
                            <p className="mb-3 text-xs font-semibold text-gray-700 md:text-sm dark:text-gray-300">Kategori & Genre:</p>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag, index) => (
                                    <motion.span key={index} className="inline-block cursor-pointer rounded-full bg-orange-100 px-3 py-1.5 text-xs font-medium text-orange-700 hover:bg-orange-200 md:px-4 md:py-2 md:text-sm dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50" whileHover={{ scale: 1.1 }}>
                                        #{tag}
                                    </motion.span>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 sm:flex-row md:gap-4">
                            <motion.button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 md:py-3 md:text-base" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <svg className="h-4 w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                                Tandai Favorit
                            </motion.button>
                            <motion.button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-300 md:py-3 md:text-base dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <svg className="h-4 w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                                </svg>
                                Bagikan
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Related Info */}
                <motion.div className="mt-8 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2 md:gap-6" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                    {/* AI Story Companion */}
                    <div className="rounded-xl border border-purple-200 bg-linear-to-br from-purple-50 to-purple-100 p-5 md:p-6 dark:border-purple-700 dark:from-purple-900/20 dark:to-purple-800/20">
                        <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800 md:mb-3 md:text-base dark:text-white">
                            <span>🤖</span> AI Story Companion
                        </h4>
                        <p className="mb-3 text-xs leading-relaxed text-gray-600 md:mb-4 md:text-sm dark:text-gray-300">"Halo! Saya adalah pendamping cerita Anda. Mari kita jelajahi kisah Timun Mas bersama-sama. Apakah Anda ingin tahu lebih banyak tentang karakter utama, latar belakang budaya, atau pesan moral dari cerita ini?"</p>
                        <motion.button className="w-full rounded-lg bg-purple-500 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-600 md:text-base" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            Tanya AI
                        </motion.button>
                    </div>

                    {/* Ringkasan & Badge */}
                    <div className="rounded-xl border border-blue-200 bg-linear-to-br from-blue-50 to-blue-100 p-5 md:p-6 dark:border-blue-700 dark:from-blue-900/20 dark:to-blue-800/20">
                        <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800 md:mb-3 md:text-base dark:text-white">
                            <span>📋</span> Ringkasan & Achievement
                        </h4>
                        <p className="mb-3 text-xs leading-relaxed text-gray-600 md:mb-4 dark:text-gray-300">Cerita Timun Mas mengajarkan keberanian, kecerdikan, dan cara menghadapi tantangan. Raih badge dengan menyelesaikan kuis!</p>
                        <div className="flex gap-2">
                            <motion.div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-xl shadow-md md:h-12 md:w-12 md:text-2xl" whileHover={{ scale: 1.1 }}>
                                🏆
                            </motion.div>
                            <motion.div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-xl opacity-50 md:h-12 md:w-12 md:text-2xl dark:bg-gray-700" title="Kunci: Selesaikan kuis">
                                🔒
                            </motion.div>
                            <motion.div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-xl opacity-50 md:h-12 md:w-12 md:text-2xl dark:bg-gray-700" title="Kunci: Cari semua cerita">
                                🔒
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
