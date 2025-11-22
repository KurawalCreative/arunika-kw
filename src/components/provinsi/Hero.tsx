"use client";

import Image from "next/image";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import test from '@/assets/svg/map.svg'
import ranibg1 from '@/assets/images/ranibg1.png'
import ranibg2 from '@/assets/images/ranibg2.png'
import ranibg3 from '@/assets/images/ranibg3.png'
import hi from '@/assets/images/rani.png'

interface HeroProps {
    provinceName: string;
    description: string;
}

export default function Hero({ provinceName, description }: HeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll({
        target: containerRef,
        offset: ["start start", "end center"]
    });

    const imageY = useTransform(scrollY, [0, 500], [0, -150]);
    const textY = useTransform(scrollY, [0, 500], [0, -100]);

    return (
        <div ref={containerRef} className="w-full h-[32rem] md:h-128 sticky top-0 overflow-hidden">
            <motion.div
                className="w-full h-full relative"
                style={{ y: imageY }}
            >
                <Image
                    src={test}
                    alt="Cultural Heritage"
                    fill
                    sizes="100vw"
                    className="object-cover blur-[2px] dark:brightness-75"
                    priority
                />
            </motion.div>

            {/* Content over Parallax Background */}
            <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-6"
                style={{ y: textY }}
            >
                <div className="flex flex-col lg:flex-row justify-center items-center gap-4 md:gap-8 lg:gap-12 w-full max-w-7xl" >
                    {/* Left Side Images */}
                    <motion.div
                        className="hidden lg:block relative w-40 xl:w-64 h-60 xl:h-80 flex-shrink-0"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {/* Polaroid 1 */}
                        <motion.div
                            className="absolute top-30 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 xl:p-3 shadow-lg"
                            initial={{ opacity: 0, scale: 0.8, rotate: 8 }}
                            animate={{ opacity: 1, scale: 1, rotate: 8 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            whileHover={{ scale: 1.05, rotate: 5, zIndex: 30 }}
                        >
                            <Image
                                src={ranibg1}
                                alt="biji"
                                height={120}
                                width={120}
                                className="object-cover xl:h-[180px] xl:w-[180px]"
                            />
                            <div className="h-3 xl:h-4 bg-white dark:bg-gray-800"></div>
                        </motion.div>

                        {/* Polaroid 2 */}
                        <motion.div
                            className="absolute top-50 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 xl:p-3 shadow-lg"
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: -5 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            whileHover={{ scale: 1.05, rotate: -8, zIndex: 30 }}
                        >
                            <Image
                                src={ranibg2}
                                alt="biji"
                                height={120}
                                width={120}
                                className="object-cover xl:h-[180px] xl:w-[180px]"
                            />
                            <div className="h-3 xl:h-4 bg-white dark:bg-gray-800"></div>
                        </motion.div>

                        {/* Polaroid 3 */}
                        <motion.div
                            className="absolute top-40 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 xl:p-3 shadow-lg"
                            initial={{ opacity: 0, scale: 0.8, rotate: 3 }}
                            animate={{ opacity: 1, scale: 1, rotate: 3 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
                        >
                            <Image
                                src={ranibg3}
                                alt="biji"
                                height={120}
                                width={120}
                                className="object-cover xl:h-[180px] xl:w-[180px]"
                            />
                            <div className="h-3 xl:h-4 bg-white dark:bg-gray-800"></div>
                        </motion.div>
                    </motion.div>

                    {/* Center Card */}
                    <motion.div
                        className="bg-white dark:bg-gray-800 h-fit w-full lg:w-fit shadow-2xl py-6 md:py-10 px-6 md:px-10 rounded-lg mx-auto relative overflow-hidden"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10 dark:opacity-5">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
                            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)]" />
                        </div>

                        <div className="mr-0 md:mr-40 relative z-10">
                            <motion.h1
                                className="text-lg md:text-xl font-bold text-gray-900 dark:text-white"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                Yuk kenalan dengan daerah <span className="text-primary-blue dark:text-blue-400">{provinceName}</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                                className="mt-4 text-sm md:text-base text-gray-700 dark:text-gray-300"
                            >
                                {description}...
                            </motion.p>
                        </div>
                        <div className="rounded-full"></div>
                        <Image
                            src={hi}
                            alt="Rani"
                            height={150}
                            width={150}
                            className="object-contain absolute bottom-0 right-0 z-10 md:h-[200px] md:w-[200px] hidden sm:block"
                        />
                    </motion.div>

                    {/* Right Side Images */}
                    <motion.div
                        className="hidden lg:block relative w-40 xl:w-64 h-60 xl:h-80 flex-shrink-0"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {/* Polaroid 1 */}
                        <motion.div
                            className="absolute top-30 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 xl:p-3 shadow-lg"
                            initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
                            animate={{ opacity: 1, scale: 1, rotate: -8 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            whileHover={{ scale: 1.05, rotate: -5, zIndex: 30 }}
                        >
                            <Image
                                src={ranibg1}
                                alt="biji"
                                height={120}
                                width={120}
                                className="object-cover xl:h-[180px] xl:w-[180px]"
                            />
                            <div className="h-3 xl:h-4 bg-white dark:bg-gray-800"></div>
                        </motion.div>

                        {/* Polaroid 2 */}
                        <motion.div
                            className="absolute top-50 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 xl:p-3 shadow-lg"
                            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 5 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            whileHover={{ scale: 1.05, rotate: 8, zIndex: 30 }}
                        >
                            <Image
                                src={ranibg2}
                                alt="biji"
                                height={120}
                                width={120}
                                className="object-cover xl:h-[180px] xl:w-[180px]"
                            />
                            <div className="h-3 xl:h-4 bg-white dark:bg-gray-800"></div>
                        </motion.div>

                        {/* Polaroid 3 */}
                        <motion.div
                            className="absolute top-40 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 xl:p-3 shadow-lg"
                            initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
                            animate={{ opacity: 1, scale: 1, rotate: -3 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
                        >
                            <Image
                                src={ranibg3}
                                alt="biji"
                                height={120}
                                width={120}
                                className="object-cover xl:h-[180px] xl:w-[180px]"
                            />
                            <div className="h-3 xl:h-4 bg-white dark:bg-gray-800"></div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
