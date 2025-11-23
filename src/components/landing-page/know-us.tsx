import { ArrowUpRight } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import mapSvg from "@/assets/svg/map-dark.svg";
import kids from "@/assets/svg/kids.svg";

const leaders = [
    { rank: 2, name: "Aulia", score: 780, color: "#00B894" },
    { rank: 1, name: "Rafi", score: 890, color: "#3ABEFF" },
    { rank: 3, name: "Sinta", score: 750, color: "#FF6B6B" },
];

const KnowUsSection = () => {
    return (
        <section className="mx-auto flex w-full max-w-7xl px-4 py-14">
            <div className="flex w-full flex-col lg:flex-row">
                <div className="flex flex-1 justify-end text-end md:mb-12 md:justify-center md:text-center lg:mb-0 lg:justify-start lg:text-start">
                    <div className="md:max-w-3xl lg:max-w-xl">
                        <h1 className="text-text-primary text-2xl leading-snug font-bold sm:text-3xl md:text-4xl dark:text-white">
                            Pakai <span className="text-primary-blue">Pakaian Adat</span> Nusantara & Dengar <span className="text-secondary-green">Ceritanya</span>
                        </h1>
                        <p className="text-text-secondary pt-2 pb-6 text-base dark:text-gray-300">Satu klik, kamu sudah pakai baju adat dan langsung tahu kisah di baliknya. Seru, interaktif, dan bikin bangga jadi anak Indonesia!</p>
                        <div className="relative flex justify-end md:justify-center lg:justify-start">
                            <Link href="/" className="hover:bg-primary-blue-hover bg-primary-blue dark:bg-primary-blue-dark dark:hover:bg-primary-blue-hover-dark flex w-fit items-center justify-center gap-3 rounded-full py-1 pr-1 pl-4 font-normal text-white">
                                Mulai Petualangan
                                <span className="text-primary-blue dark:text-primary-blue-dark flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-gray-100">
                                    <ArrowUpRight size={28} />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="hidden flex-1 flex-col-reverse md:flex lg:ml-12 lg:flex-col">
                    <div className="grid grid-cols-1 gap-4">
                        {/* Atas */}
                        <div className="bg-gray-background relative col-span-1 flex h-60 flex-col justify-center overflow-hidden shadow-sm md:h-70 md:rounded-xl dark:bg-neutral-800">
                            <div className="absolute inset-6 top-0 right-0">
                                <Image src={mapSvg} alt="map-dark" fill draggable={false} className="object-cover" />
                                <div className="relative h-full">
                                    <div className="absolute right-0 bottom-0 px-4 text-end md:block">
                                        <div className="relative bottom-18 md:right-[50%] lg:right-35 lg:bottom-14">
                                            <div className="absolute top-4 left-0 flex flex-col items-center">
                                                <Image src={kids} alt="minangkabau-dance" className="relative top-0 h-40 w-40 scale-x-[-1] object-cover" />
                                            </div>
                                        </div>

                                        <div className="pointer-events-none absolute right-0 bottom-4 z-0 h-24 w-96 rounded-xl bg-linear-to-l from-stone-50 via-stone-50/70 to-transparent blur-3xl dark:from-neutral-800 dark:via-neutral-800/70" />
                                        <h1 className="text-text-primary relative z-10 text-2xl font-semibold dark:text-neutral-100">
                                            Jelajahi <span className="text-accent-coral dark:text-red-400">Peta Interaktif Nusantara</span>
                                        </h1>
                                        <p className="text-text-secondary relative z-10 mt-1 text-sm md:w-120 lg:w-105 dark:text-gray-300">Satu klik, kamu langsung “berkunjung” ke 38 provinsi! Coba pakaian adatnya, pelajari makna motifnya, dan dengar cerita di balik setiap kain.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default KnowUsSection;
