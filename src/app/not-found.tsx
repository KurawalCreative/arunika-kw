"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Home, Search, MapPin, Camera, Music, Palette, BookOpen, Heart, Star, Sparkles, ArrowLeft, RotateCcw } from "lucide-react";
import image404 from "@/assets/images/404.png";
import "@/app/globals.css";

const floatingIcons = [
    { Icon: Home, delay: 0, x: -100, y: -50 },
    { Icon: Search, delay: 1, x: 120, y: -80 },
    { Icon: MapPin, delay: 2, x: -150, y: 30 },
    { Icon: Camera, delay: 3, x: 100, y: 60 },
    { Icon: Music, delay: 4, x: -80, y: -120 },
    { Icon: Palette, delay: 5, x: 140, y: -20 },
    { Icon: BookOpen, delay: 6, x: -120, y: 80 },
    { Icon: Heart, delay: 7, x: 80, y: 100 },
];

export default function NotFound() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-900">
            {/* Floating Icons Background */}
            {floatingIcons.map(({ Icon, delay, x, y }, index) => (
                <motion.div
                    key={index}
                    className="absolute text-gray-200 dark:text-gray-700"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        x: [0, x, x * 2],
                        y: [0, y, y * 2],
                        rotate: [0, 360, 720],
                    }}
                    transition={{
                        duration: 8,
                        delay: delay,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                    }}
                    style={{
                        left: `${20 + index * 10}%`,
                        top: `${20 + index * 8}%`,
                    }}
                >
                    <Icon size={24 + index * 2} />
                </motion.div>
            ))}

            {/* Sparkle Effects */}
            <motion.div
                className="absolute top-20 right-20 text-yellow-400"
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <Sparkles size={32} />
            </motion.div>

            <motion.div
                className="absolute bottom-32 left-16 text-blue-400"
                animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, -180, -360],
                    opacity: [0.3, 1, 0.3],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
            >
                <Star size={28} />
            </motion.div>

            {/* Main Content */}
            <div className="relative z-10 flex h-screen flex-col items-center justify-center px-8 py-8 text-center">
                {/* 404 Number */}
                <motion.div className="mb-4 text-7xl font-black text-gray-300 md:text-8xl dark:text-gray-600" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                    4
                    <motion.span
                        className="inline-block text-orange-500"
                        animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        0
                    </motion.span>
                    4
                </motion.div>

                {/* Rani Character */}
                <motion.div className="mb-4" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}>
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, 2, -2, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <Image src={image404} alt="404 Not Found" width={100} height={75} sizes="(max-width: 640px) 50px, (max-width: 768px) 70px, (max-width: 1024px) 100px, 120px" className="" priority />
                    </motion.div>
                </motion.div>

                {/* Text Content */}
                <motion.div className="max-w-2xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
                    <motion.h1
                        className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white"
                        animate={{
                            textShadow: ["0 0 0px rgba(249, 115, 22, 0)", "0 0 20px rgba(249, 115, 22, 0.5)", "0 0 0px rgba(249, 115, 22, 0)"],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        Wah, Halaman Hilang! 🫣
                    </motion.h1>

                    <motion.p className="mb-4 text-base text-gray-600 md:text-lg dark:text-gray-300" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }}>
                        Rani juga bingung nih, halaman yang kamu cari sepertinya sedang berpetualang ke dimensi lain. Mari kita kembali ke tempat yang aman!
                    </motion.p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div className="flex flex-col gap-2 sm:flex-row" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="rounded-full bg-orange-500 px-8 py-4 font-semibold text-white shadow-lg transition-colors hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 focus:outline-none dark:focus:ring-orange-800">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <Home size={20} />
                            Kembali ke Beranda
                        </Link>
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 rounded-full border-2 border-gray-300 bg-white px-8 py-4 font-semibold text-gray-700 shadow-lg transition-colors hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                        <ArrowLeft size={20} />
                        Kembali
                    </motion.button>
                </motion.div>

                {/* Fun Message */}
                <motion.div className="mt-4 text-sm text-gray-500 dark:text-gray-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.2 }}>
                    <motion.p
                        animate={{
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        💡 Tip: Coba periksa URL atau gunakan navigasi di atas
                    </motion.p>
                </motion.div>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 -z-10 opacity-5">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #f97316 2px, transparent 2px),
                                    radial-gradient(circle at 75% 75%, #f97316 2px, transparent 2px)`,
                        backgroundSize: "50px 50px",
                    }}
                />
            </div>
        </div>
    );
}
