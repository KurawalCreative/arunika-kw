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
        <div ref={containerRef} className="w-full h-128 sticky top-0 overflow-hidden">
            <motion.div
                className="w-full h-full relative"
                style={{ y: imageY }}
            >
                <Image
                    src={test}
                    alt="Cultural Heritage"
                    fill
                    sizes="100vw"
                    className="object-cover blur-[2px]"
                    priority
                />
            </motion.div>

            {/* Content over Parallax Background */}
            <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center px-6"
                style={{ y: textY }}
            >
                <div className="flex justify-center items-center gap-12" >
                    {/* Left Side Images */}
                    <motion.div
                        className="relative w-64 h-80"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {/* Polaroid 1 */}
                        <motion.div
                            className="absolute  top-30 -translate-y-1/2 bg-white p-3 shadow-lg"
                            initial={{ opacity: 0, scale: 0.8, rotate: 8 }}
                            animate={{ opacity: 1, scale: 1, rotate: 8 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            whileHover={{ scale: 1.05, rotate: 5, zIndex: 30 }}
                        >
                            <Image
                                src={ranibg1}
                                alt="biji"
                                height={180}
                                width={180}
                                className="object-cover"
                            />
                            <div className="h-4 bg-white"></div>
                        </motion.div>

                        {/* Polaroid 2 */}
                        <motion.div
                            className="absolute top-50 -translate-y-1/2 bg-white p-3 shadow-lg"
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: -5 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            whileHover={{ scale: 1.05, rotate: -8, zIndex: 30 }}
                        >
                            <Image
                                src={ranibg2}
                                alt="biji"
                                height={180}
                                width={180}
                                className="object-cover"
                            />
                            <div className="h-4 bg-white"></div>
                        </motion.div>

                        {/* Polaroid 3 */}
                        <motion.div
                            className="absolute top-40 -translate-y-1/2 bg-white p-3 shadow-lg"
                            initial={{ opacity: 0, scale: 0.8, rotate: 3 }}
                            animate={{ opacity: 1, scale: 1, rotate: 3 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
                        >
                            <Image
                                src={ranibg3}
                                alt="biji"
                                height={180}
                                width={180}
                                className="object-cover"
                            />
                            <div className="h-4 bg-white"></div>
                        </motion.div>
                    </motion.div>

                    {/* Center Card */}
                    <motion.div
                        className="bg-white h-fit w-fit shadow-2xs py-10 px-10 rounded-lg mx-auto relative overflow-hidden"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
                            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)]" />
                        </div>

                        <div className="mr-40 relative z-10">
                            <motion.h1
                                className="text-xl font-bold text-text-primary"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                Yuk kenalan dengan daerah <span className="text-primary-blue">{provinceName}</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                                className="mt-4 text-gray-700"
                            >
                                {description}...
                            </motion.p>
                        </div>
                        <div className="rounded-full"></div>
                        <Image
                            src={hi}
                            alt="Rani"
                            height={200}
                            width={200}
                            className="object-contain absolute bottom-0 right-0 z-10"
                        />
                    </motion.div>

                    {/* Right Side Images */}
                    <motion.div
                        className="relative w-64 h-80"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {/* Polaroid 1 */}
                        <motion.div
                            className="absolute  top-30 -translate-y-1/2 bg-white p-3 shadow-lg"
                            initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
                            animate={{ opacity: 1, scale: 1, rotate: -8 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            whileHover={{ scale: 1.05, rotate: -5, zIndex: 30 }}
                        >
                            <Image
                                src={ranibg1}
                                alt="biji"
                                height={180}
                                width={180}
                                className="object-cover"
                            />
                            <div className="h-4 bg-white"></div>
                        </motion.div>

                        {/* Polaroid 2 */}
                        <motion.div
                            className="absolute top-50 -translate-y-1/2 bg-white p-3 shadow-lg"
                            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 5 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            whileHover={{ scale: 1.05, rotate: 8, zIndex: 30 }}
                        >
                            <Image
                                src={ranibg2}
                                alt="biji"
                                height={180}
                                width={180}
                                className="object-cover"
                            />
                            <div className="h-4 bg-white"></div>
                        </motion.div>

                        {/* Polaroid 3 */}
                        <motion.div
                            className="absolute top-40 -translate-y-1/2 bg-white p-3 shadow-lg"
                            initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
                            animate={{ opacity: 1, scale: 1, rotate: -3 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
                        >
                            <Image
                                src={ranibg3}
                                alt="biji"
                                height={180}
                                width={180}
                                className="object-cover"
                            />
                            <div className="h-4 bg-white"></div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
