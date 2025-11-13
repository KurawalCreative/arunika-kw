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
    year: "2024"
};

const tags = ['Cerita Rakyat', 'Dokumenter', 'Budaya Indonesia', 'Pendidikan', 'Keluarga'];

interface VideoProps {
    videoData?: VideoData;
}

export default function Video({ videoData = defaultVideoData }: VideoProps) {
    return (
        <div className="py-20 px-6 bg-linear-to-b from-orange-50 to-white">
            <motion.div
                className="max-w-5xl mx-auto"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="text-center mb-16">
                    <motion.h2
                        className="text-4xl font-bold text-gray-800 mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        📖 Cerita Rakyat & Budaya
                    </motion.h2>
                    <motion.p
                        className="text-lg text-gray-600 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Saksikan dokumentasi menarik tentang kekayaan cerita rakyat dan warisan budaya daerah yang dipenuhi dengan nilai-nilai tradisional dan kebijaksanaan leluhur
                    </motion.p>
                </div>

                <motion.div
                    className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-orange-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                >
                    {/* Video Container */}
                    <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src={videoData.videoUrl}
                            title="Cerita Rakyat dan Budaya"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>

                    {/* Card Info */}
                    <div className="p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    {videoData.title}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {videoData.description}
                                </p>
                            </div>
                            <motion.div
                                className="ml-4 text-5xl"
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                🎬
                            </motion.div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
                            <motion.div
                                className="text-center"
                                whileHover={{ scale: 1.05 }}
                            >
                                <p className="text-2xl font-bold text-orange-500">{videoData.duration}</p>
                                <p className="text-sm text-gray-600">Durasi Video</p>
                            </motion.div>
                            <motion.div
                                className="text-center"
                                whileHover={{ scale: 1.05 }}
                            >
                                <p className="text-2xl font-bold text-orange-500">{videoData.rating}</p>
                                <p className="text-sm text-gray-600">Rating</p>
                            </motion.div>
                            <motion.div
                                className="text-center"
                                whileHover={{ scale: 1.05 }}
                            >
                                <p className="text-2xl font-bold text-orange-500">{videoData.views}</p>
                                <p className="text-sm text-gray-600">Views</p>
                            </motion.div>
                            <motion.div
                                className="text-center"
                                whileHover={{ scale: 1.05 }}
                            >
                                <p className="text-2xl font-bold text-orange-500">{videoData.year}</p>
                                <p className="text-sm text-gray-600">Tahun Produksi</p>
                            </motion.div>
                        </div>

                        {/* Tags */}
                        <div className="mb-6">
                            <p className="text-sm font-semibold text-gray-700 mb-3">Kategori & Genre:</p>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag, index) => (
                                    <motion.span
                                        key={index}
                                        className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-200 cursor-pointer"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        #{tag}
                                    </motion.span>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <motion.button
                                className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                                Tandai Favorit
                            </motion.button>
                            <motion.button
                                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                                </svg>
                                Bagikan
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Related Info */}
                <motion.div
                    className="mt-12 grid md:grid-cols-2 gap-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    {/* AI Story Companion */}
                    <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <span>🤖</span> AI Story Companion
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            "Halo! Saya adalah pendamping cerita Anda. Mari kita jelajahi kisah Timun Mas bersama-sama. Apakah Anda ingin tahu lebih banyak tentang karakter utama, latar belakang budaya, atau pesan moral dari cerita ini?"
                        </p>
                        <motion.button
                            className="w-full bg-purple-500 text-white py-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Tanya AI
                        </motion.button>
                    </div>

                    {/* Ringkasan & Badge */}
                    <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <span>📋</span> Ringkasan & Achievement
                        </h4>
                        <p className="text-gray-600 text-xs leading-relaxed mb-4">
                            Cerita Timun Mas mengajarkan keberanian, kecerdikan, dan cara menghadapi tantangan. Raih badge dengan menyelesaikan kuis!
                        </p>
                        <div className="flex gap-2">
                            <motion.div
                                className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl shadow-md"
                                whileHover={{ scale: 1.1 }}
                            >
                                🏆
                            </motion.div>
                            <motion.div
                                className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl opacity-50"
                                title="Kunci: Selesaikan kuis"
                            >
                                🔒
                            </motion.div>
                            <motion.div
                                className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl opacity-50"
                                title="Kunci: Cari semua cerita"
                            >
                                🔒
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
