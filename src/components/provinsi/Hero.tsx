"use client";

import Image from "next/image";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import test from "@/assets/svg/map.svg";
import ranibg1 from "@/assets/images/ranibg1.png";
import ranibg2 from "@/assets/images/ranibg2.png";
import ranibg3 from "@/assets/images/ranibg3.png";
import hi from "@/assets/images/rani.png";

interface HeroProps {
    provinceName: string;
    description: string;
}

export default function Hero({ provinceName, description }: HeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll({
        target: containerRef,
        offset: ["start start", "end center"],
    });

    const imageY = useTransform(scrollY, [0, 500], [0, -150]);
    const textY = useTransform(scrollY, [0, 500], [0, -100]);

    return (
        <div ref={containerRef} className="sticky top-0 h-screen w-full overflow-hidden md:h-96 lg:h-128">
            {/* <motion.div className="relative h-full w-full" style={{ y: imageY }}>
                <Image src={test} alt="Cultural Heritage" fill sizes="100vw" className="object-cover blur-[2px] dark:brightness-75" priority />
            </motion.div> */}

            {/* Content over Parallax Background */}
            <motion.div className="absolute inset-0 flex flex-col items-center justify-center px-3 py-8 sm:px-4 md:px-6" style={{ y: textY }}>
                <div className="flex w-full max-w-7xl flex-col items-center justify-center gap-4 md:gap-8 lg:flex-row lg:gap-12">
                    {/* Left Side Images - Hidden on mobile, visible on lg */}
                    <motion.div className="relative hidden h-60 w-40 shrink-0 lg:flex lg:items-center lg:justify-center xl:h-80 xl:w-64" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                        {/* Polaroid 1 */}
                        <motion.div className="absolute top-30 -translate-y-1/2 bg-white p-2 shadow-lg xl:p-3 dark:bg-gray-800" initial={{ opacity: 0, scale: 0.8, rotate: 8 }} animate={{ opacity: 1, scale: 1, rotate: 8 }} transition={{ duration: 0.6, delay: 0.4 }} whileHover={{ scale: 1.05, rotate: 5, zIndex: 30 }}>
                            <Image src={ranibg1} alt="biji" height={300} width={300} className="object-cover xl:h-[180px] xl:w-[180px]" />
                            <div className="h-3 bg-white xl:h-4 dark:bg-gray-800"></div>
                        </motion.div>

                        {/* Polaroid 2 */}
                        <motion.div className="absolute top-50 -translate-y-1/2 bg-white p-2 shadow-lg xl:p-3 dark:bg-gray-800" initial={{ opacity: 0, scale: 0.8, rotate: -5 }} animate={{ opacity: 1, scale: 1, rotate: -5 }} transition={{ duration: 0.6, delay: 0.5 }} whileHover={{ scale: 1.05, rotate: -8, zIndex: 30 }}>
                            <Image src={ranibg2} alt="biji" height={300} width={300} className="object-cover xl:h-[180px] xl:w-[180px]" />
                            <div className="h-3 bg-white xl:h-4 dark:bg-gray-800"></div>
                        </motion.div>

                        {/* Polaroid 3 */}
                        <motion.div className="absolute top-40 -translate-y-1/2 bg-white p-2 shadow-lg xl:p-3 dark:bg-gray-800" initial={{ opacity: 0, scale: 0.8, rotate: 3 }} animate={{ opacity: 1, scale: 1, rotate: 3 }} transition={{ duration: 0.6, delay: 0.6 }} whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}>
                            <Image src={ranibg3} alt="biji" height={300} width={300} className="object-cover xl:h-[180px] xl:w-[180px]" />
                            <div className="h-3 bg-white xl:h-4 dark:bg-gray-800"></div>
                        </motion.div>
                    </motion.div>

                    {/* Center Card - Responsive width */}
                    <motion.div className="relative mx-auto h-fit w-full overflow-hidden rounded-lg bg-white px-4 py-6 shadow-2xl sm:px-6 sm:py-8 md:w-fit md:px-10 md:py-10 lg:w-fit dark:bg-gray-800" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} whileHover={{ scale: 1.02 }}>
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10 dark:opacity-5">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
                            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)]" />
                        </div>
                        <motion.h1 className="text-base font-bold text-gray-900 sm:text-lg md:text-xl lg:text-2xl dark:text-white" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
                            Ciptakan dokumentasi visual bertema <span className="text-primary-blue dark:text-blue-400">{provinceName}</span>
                        </motion.h1>
                        <div className="relative z-10 mr-0 md:mr-40 lg:mr-40">
                            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.7 }} className="mt-3 text-xs text-gray-700 sm:text-sm md:text-base dark:text-gray-300">
                                Unggah fotomu lalu lihat langsung bagaimana tampilan tersebut disusun ulang agar cocok dengan nuansa {provinceName} sebelum kamu bagikan atau tampilkan.
                            </motion.p>
                        </div>
                        <div className="rounded-full"></div>
                        <Image src={hi} alt="Rani" height={150} width={150} className="absolute right-0 bottom-0 z-10 hidden object-contain sm:block sm:h-32 sm:w-32 md:h-[180px] md:w-[180px] lg:h-[200px] lg:w-[200px]" />
                    </motion.div>

                    {/* Right Side Images - Hidden on mobile, visible on lg */}
                    <motion.div className="relative hidden h-60 w-40 shrink-0 lg:flex lg:items-center lg:justify-center xl:h-80 xl:w-64" initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                        {/* Polaroid 1 */}
                        <motion.div className="absolute top-30 -translate-y-1/2 bg-white p-2 shadow-lg xl:p-3 dark:bg-gray-800" initial={{ opacity: 0, scale: 0.8, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: -8 }} transition={{ duration: 0.6, delay: 0.4 }} whileHover={{ scale: 1.05, rotate: -5, zIndex: 30 }}>
                            <Image src={ranibg1} alt="biji" height={300} width={300} className="object-cover xl:h-[180px] xl:w-[180px]" />
                            <div className="h-3 bg-white xl:h-4 dark:bg-gray-800"></div>
                        </motion.div>

                        {/* Polaroid 2 */}
                        <motion.div className="absolute top-50 -translate-y-1/2 bg-white p-2 shadow-lg xl:p-3 dark:bg-gray-800" initial={{ opacity: 0, scale: 0.8, rotate: 5 }} animate={{ opacity: 1, scale: 1, rotate: 5 }} transition={{ duration: 0.6, delay: 0.5 }} whileHover={{ scale: 1.05, rotate: 8, zIndex: 30 }}>
                            <Image src={ranibg2} alt="biji" height={300} width={300} className="object-cover xl:h-[180px] xl:w-[180px]" />
                            <div className="h-3 bg-white xl:h-4 dark:bg-gray-800"></div>
                        </motion.div>

                        {/* Polaroid 3 */}
                        <motion.div className="absolute top-40 -translate-y-1/2 bg-white p-2 shadow-lg xl:p-3 dark:bg-gray-800" initial={{ opacity: 0, scale: 0.8, rotate: -3 }} animate={{ opacity: 1, scale: 1, rotate: -3 }} transition={{ duration: 0.6, delay: 0.6 }} whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}>
                            <Image src={ranibg3} alt="biji" height={300} width={300} className="object-cover xl:h-[180px] xl:w-[180px]" />
                            <div className="h-3 bg-white xl:h-4 dark:bg-gray-800"></div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
