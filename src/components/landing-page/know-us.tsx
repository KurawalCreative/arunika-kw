import { ArrowUpRight } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import hinduTample from "@/assets/images/hindu-tample.jpg";
import minangkabauDance from "@/assets/images/minangkabau-dance.jpg";
import reogDance from "@/assets/images/reog-dance.jpg";
import mapSvg from "@/assets/svg/map-dark.svg";
import javaMapSvg from "@/assets/svg/java-map.svg";
import kids from "@/assets/svg/kids.svg";

const leaders = [
    { rank: 2, name: "Aulia", score: 780, color: "#00B894" },
    { rank: 1, name: "Rafi", score: 890, color: "#3ABEFF" },
    { rank: 3, name: "Sinta", score: 750, color: "#FF6B6B" },
];

const KnowUsSection = () => {
    return (
        <section className="mx-auto flex w-full max-w-7xl px-4 py-20">
            <div className="flex w-full flex-col lg:flex-row">
                <div className="mb-12 flex-1 lg:mb-0">
                    <div className="max-w-xl">
                        <h1 className="text-text-primary text-2xl leading-snug font-bold sm:text-3xl dark:text-white">
                            Mari Jelajahi Kekayaan <span className="text-primary-blue dark:text-blue-400">Budaya Indonesia</span> & Pelajari <span className="text-secondary-green dark:text-green-400">Cerita menarik</span> di Baliknya
                        </h1>
                        <p className="text-text-secondary text-font-secondary py-6 text-lg sm:text-xl dark:text-gray-300">Temukan cara seru belajar budaya lewat dongeng, sejarah, dan interaksi digital yang membuat anak-anak mencintai tanah airnya sejak dini.</p>

                        <div className="relative">
                            <Link href="/" className="hover:bg-primary-blue-hover bg-primary-blue flex w-fit items-center justify-center gap-3 rounded-full py-1 pr-1 pl-4 font-normal text-white dark:bg-blue-600 dark:hover:bg-blue-700">
                                Mulai Petualangan
                                <span className="text-primary-blue flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-gray-800 dark:text-blue-600">
                                    <ArrowUpRight size={28} />
                                </span>
                            </Link>
                            <div className="absolute bottom-12 left-70">
                                <div className="absolute top-2 left-0 flex h-32 w-24 -rotate-15 flex-col items-center bg-white p-1 shadow-lg dark:bg-gray-800">
                                    <Image src={minangkabauDance} alt="minangkabau-dance" className="relative top-0 h-25 w-24 object-cover" />
                                </div>
                                <div className="absolute top-2 left-4 flex h-32 w-24 rotate-15 flex-col items-center bg-white p-1 shadow-lg dark:bg-gray-800">
                                    <Image src={reogDance} alt="reog-dance" className="h-25 w-24 object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 lg:ml-12">
                    <div className="grid grid-cols-3 gap-4">
                        {/* Atas */}
                        <div className="bg-gray-background relative col-span-3 flex flex-col justify-center overflow-hidden rounded-xl shadow-sm md:h-62 dark:bg-gray-800">
                            <div className="absolute inset-6 top-0 right-0">
                                <Image src={mapSvg} alt="map-dark" fill draggable={false} className="object-cover" />
                                <div className="relative h-full">
                                    <div className="absolute right-0 bottom-0 px-4 text-end">
                                        <div className="relative bottom-21 -left-32">
                                            <div className="absolute top-6 left-0 flex h-32 w-24 -rotate-10 flex-col items-center bg-white p-1 shadow-lg dark:bg-gray-800">
                                                <Image src={minangkabauDance} alt="minangkabau-dance" className="relative top-0 h-25 w-24 object-cover" />
                                            </div>
                                            <div className="absolute top-2 left-4 flex h-32 w-24 -rotate-5 flex-col items-center bg-white p-1 shadow-lg dark:bg-gray-800">
                                                <Image src={reogDance} alt="reog-dance" className="h-25 w-24 object-cover" />
                                            </div>
                                        </div>

                                        <div className="pointer-events-none absolute right-0 bottom-4 z-0 h-24 w-96 rounded-xl bg-linear-to-l from-stone-50 via-stone-50/70 to-transparent blur-3xl dark:from-gray-700 dark:via-gray-700/70" />
                                        <h1 className="text-text-primary relative z-10 text-lg font-semibold dark:text-white">
                                            Jelajahi <span className="text-accent-coral dark:text-red-400">Peta Interaktif Nusantara</span>
                                        </h1>
                                        <p className="text-text-secondary relative z-10 mt-1 w-110 text-sm dark:text-gray-300">Temukan keunikan setiap daerah lewat peta interaktif yang seru! Dari pakaian adat, tarian tradisional, hingga cerita rakyat.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kiri bawah */}
                        <div className="bg-gray-background relative col-span-1 flex flex-col items-center justify-end rounded-2xl p-4 shadow-sm dark:bg-gray-800">
                            <div className="flex w-full items-end justify-between gap-3 text-center">
                                {leaders.map((l) => (
                                    <div key={l.rank} className="flex min-w-[68px] flex-col items-center gap-1 text-[11px] leading-tight sm:min-w-0 sm:flex-1 sm:text-sm">
                                        <div className={`relative flex w-full max-w-12 items-center justify-center ${l.rank === 1 ? "h-26" : l.rank === 2 ? "h-20" : "h-16"}`} style={{ backgroundColor: l.color }}>
                                            <span className="absolute bottom-2 text-sm font-bold text-white">{l.rank}</span>
                                        </div>
                                        <p className="text-text-primary mt-2 font-bold dark:text-white">{l.name}</p>
                                        <p className="text-text-secondary mt-0.5 text-xs dark:text-gray-400">{l.score} pts</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Kanan bawah */}
                        <div className="bg-gray-background relative col-span-2 h-full overflow-hidden rounded-2xl p-4 shadow-sm dark:bg-gray-800">
                            <div className="text-start">
                                <h1 className="text-text-primary text-lg font-semibold dark:text-white">
                                    Belajar budaya <span className="text-accent-coral dark:text-red-400">bareng yuk!</span>
                                </h1>
                                <p className="text-text-secondary mt-1 text-sm dark:text-gray-300">
                                    Yuk kenali budaya Indonesia dengan <br /> cara yang asyik!
                                </p>
                            </div>

                            <div className="object-cover">
                                <Image src={javaMapSvg} alt="java-map" draggable={false} className="pointer-events-none absolute bottom-7 left-4 z-10 w-48 md:w-64" />
                                <Image src={kids} alt="kids" draggable={false} className="pointer-events-none absolute right-4 bottom-0 z-10 w-34" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default KnowUsSection;
