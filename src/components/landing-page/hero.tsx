"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import Link from "next/link";
import Image from "next/image";
import PinMapDesign from "@/components/pin-map-design";
import SquarePinMap from "@/components/square-pin-map";
import petik from "@/assets/svg/petik.svg";

import map from "@/assets/svg/map.svg";
import pinmap1 from "@/assets/images/pin-map2.jpg";
import pinmap2 from "@/assets/images/pin-map3.jpg";
import pinmap3 from "@/assets/images/pin-map4.jpg";
import pinmap4 from "@/assets/images/pin-map5.jpg";
import pinmap5 from "@/assets/images/pin-map6.jpg";
import pinmap6 from "@/assets/images/pin-map7.jpg";
import pinmapsquare from "@/assets/images/square-pin.jpg";
import { ArrowUpRight } from "lucide-react";

const HeroSection = () => {
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const mapY = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const blurY = useTransform(scrollYProgress, [0, 1], [0, -150]);

    return (
        <div className="w-full">
            <div ref={ref} className="relative flex min-h-screen flex-col items-center justify-center">
                {/*  */}
                <motion.div style={{ y: mapY }} className="pointer-events-none absolute mt-48 w-full md:mt-40 lg:mt-32">
                    <div className="relative mx-auto aspect-video max-w-[1400px]">
                        <Image src={map} alt="map" draggable={false} loading="eager" fill className="transform-gpu object-contain object-center select-none" priority />

                        {/* Simplified pin positioning - single system */}
                        <div className="relative aspect-video w-full">
                            <div className="absolute bottom-[48%] left-[17%]">
                                <PinMapDesign src={pinmap1} className="absolute left-1/2 -translate-x-1/2 -translate-y-full" />
                            </div>
                            <div className="absolute bottom-[28%] left-[36%]">
                                <PinMapDesign src={pinmap2} className="absolute left-1/2 -translate-x-1/2 -translate-y-full" />
                            </div>
                            <div className="absolute bottom-[22%] left-[47.5%]">
                                <SquarePinMap src={pinmapsquare} className="absolute left-1/2 -translate-x-1/2 -translate-y-full" />
                            </div>
                            <div className="absolute right-[40%] bottom-[42%]">
                                <PinMapDesign src={pinmap3} className="absolute left-1/2 -translate-x-1/2 -translate-y-full" />
                            </div>
                            <div className="absolute bottom-[54%] left-[83%]">
                                <PinMapDesign src={pinmap6} className="absolute left-1/2 -translate-x-1/2 -translate-y-full" />
                            </div>
                            <div className="absolute right-[4%] bottom-[50%]">
                                <PinMapDesign src={pinmap5} className="absolute left-1/2 -translate-x-1/2 -translate-y-full" />
                            </div>
                            <div className="absolute right-[7%] bottom-[41%]">
                                <PinMapDesign src={pinmap4} className="absolute left-1/2 -translate-x-1/2 -translate-y-full" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div style={{ y: blurY }} className="pointer-events-none absolute -top-16 left-1/2 h-[72vh] w-full max-w-[1400px] -translate-x-1/2 rounded-[50%] bg-[#fffefe] blur-3xl sm:-top-20 md:-top-24 lg:-top-28 dark:bg-neutral-900" />

                <div className="relative mx-auto mb-48 flex max-w-7xl flex-col items-center justify-center gap-6 px-4 md:mb-40 lg:mb-32">
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="w-full max-w-6xl text-center text-2xl leading-tight font-extrabold text-gray-900 sm:text-3xl md:text-4xl lg:text-5xl dark:text-white">
                        Dari Sabang hingga Merauke, setiap <span className="text-secondary-green">pakaian adat punya cerita</span>
                    </motion.h1>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="relative max-w-[749px] text-center">
                        {/* Paper Plane */}
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 1 }} className="absolute hidden md:bottom-[220%] md:left-[122%] lg:block">
                            <svg width="106" height="126" viewBox="0 0 106 126" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <motion.path
                                    d="M1.5 93.7454C34.5652 143.627 69.9253 124.071 73.6696 93.7454C77.1796 65.3186 51.906 50.0689 36.4728 51.9765C21.7903 53.7913 21.2125 72.0027 34.5652 72.0027C50.8149 72.0027 58 51.9765 62.5 47.435"
                                    stroke="#3ABEFF"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeDasharray="7 7"
                                    initial={{ pathLength: 0, pathOffset: 1 }}
                                    animate={{
                                        pathLength: 1,
                                        pathOffset: 0,
                                        strokeDashoffset: [0, -14, 0],
                                    }}
                                    transition={{
                                        pathLength: { duration: 2, delay: 1.5, ease: "easeInOut" },
                                        pathOffset: { duration: 2, delay: 1.5, ease: "easeInOut" },
                                        strokeDashoffset: {
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "linear",
                                        },
                                    }}
                                />
                                <motion.path
                                    d="M104 1.43501L59.1849 14.8259C58.2352 15.1097 58.2326 16.4538 59.1813 16.7411L69.4861 19.8622M104 1.43501L69.4861 19.8622M104 1.43501L98.5959 28.2241C98.3534 29.4263 97.0959 30.129 95.9449 29.7056L81.5524 24.4107M104 1.43501L78.5234 23.2963M69.4861 19.8622V35.935M78.5234 23.2963L69.4861 35.935M78.5234 23.2963L81.5524 24.4107M69.4861 35.935L81.5524 24.4107"
                                    stroke="#3ABEFF"
                                    strokeWidth="2"
                                    strokeDasharray="0 1"
                                    initial={{ pathLength: 0, pathOffset: 1 }}
                                    animate={{ pathLength: 1, pathOffset: 0 }}
                                    transition={{ duration: 2.5, delay: 2, ease: "easeInOut" }}
                                />
                            </svg>
                        </motion.div>
                        <p className="text-text-primary relative text-base font-medium sm:text-lg dark:text-neutral-100">Dari pakaian adat yang memukau hingga kisah dan sejarah di baliknya, jelajahi semuanya bersama Adatry petualangan budaya Indonesia yang seru, interaktif, dan penuh warna!</p>
                        <div className="absolute -top-2 -right-7 hidden md:block">
                            <Image src={petik} alt="_" width={27} height={23} />
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}>
                        <Link href={"/jelajahi-nusantara"} className="bg-primary-blue hover:bg-primary-blue-hover dark:bg-primary-blue-dark dark:hover:bg-primary-blue-hover-dark flex items-center justify-center gap-3 rounded-full py-1 pr-1 pl-4 text-sm font-normal text-white transition-colors sm:text-base">
                            Coba Sekarang
                            <span className="text-primary-blue dark:text-primary-blue-dark flex h-9 w-9 items-center justify-center rounded-full bg-white transition-colors dark:bg-gray-100">
                                <ArrowUpRight size={28} />
                            </span>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
