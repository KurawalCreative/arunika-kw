import historyIndonesia from "@/assets/images/history-indonesia.jpg";
import traditionalFood from "@/assets/images/food-traditional.jpg";
import traditionalCloth from "@/assets/images/traditional-clothing.jpg";
import traditionalDance from "@/assets/images/traditional-dance.jpg";
import traditionalWeapon from "@/assets/images/traditional-weapon.jpg";
import cultureBuilding from "@/assets/images/culture-building.jpg";
import Image from "next/image";

const photo = [
    {
        id: 1,
        src: historyIndonesia,
        alt: "sejarah-indonesia",
    },
    {
        id: 2,
        src: traditionalFood,
        alt: "makanan-tradisional",
    },
    {
        id: 3,
        src: traditionalCloth,
        alt: "pakaian-tradisional",
    },
    {
        id: 4,
        src: traditionalDance,
        alt: "tarian-tradisional",
    },
    {
        id: 5,
        src: traditionalWeapon,
        alt: "senjata-tradisional",
    },
    {
        id: 6,
        src: cultureBuilding,
        alt: "bangunan-bersejarah",
    },
];

const WhatCanLearnSection = () => {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-20">
            <div className="flex w-full flex-col gap-8 lg:flex-row lg:gap-0">
                <div className="flex-1">
                    <div className="max-w-xl">
                        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white">
                            Apa yang bisa kamu <span className="text-primary-blue dark:text-blue-400">pelajari disini?</span>
                        </h1>
                        <p className="text-text-secondary mt-2 text-lg sm:text-xl dark:text-gray-300">
                            Temukan keindahan budaya Indonesia lewat cara belajar yang <span className="text-secondary-green dark:text-green-400">seru, interaktif, dan penuh warna.</span>
                        </p>
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-text-muted text-base sm:text-lg dark:text-gray-400">Dari pakaian adat hingga bahasa daerah, setiap halaman membawa kamu mengenal kisah dan makna di balik tradisi Nusantara. Yuk, jelajahi dan temukan betapa kayanya Indonesia dari Sabang sampai Merauke!</p>
                </div>
            </div>
            <div className="mx-auto mt-12 max-w-5xl">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {photo.map((v, i) => (
                        <div key={i} className="relative aspect-4/5 w-full overflow-hidden rounded-sm shadow-md">
                            <Image src={v.src} alt={v.alt} fill className="object-cover transition-transform duration-300 ease-out hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent dark:from-black/60 dark:via-black/20" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhatCanLearnSection;
