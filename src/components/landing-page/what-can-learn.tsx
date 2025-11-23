import historyIndonesia from "@/assets/images/history-indonesia.jpg";
import traditionalFood from "@/assets/images/food-traditional.jpg";
import traditionalCloth from "@/assets/images/traditional-clothing.jpg";
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
];

const WhatCanLearnSection = () => {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-14">
            <div className="flex w-full flex-col gap-8 lg:flex-row lg:gap-0">
                <div className="flex-1">
                    <div className="max-w-xl">
                        <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl dark:text-white">
                            Apa yang bisa kamu <span className="text-primary-blue dark:text-primary-blue-dark">lakukan di Adatry?</span>
                        </h1>
                        <p className="text-text-secondary mt-1 text-lg font-medium sm:text-xl dark:text-gray-300">
                            Pakai ratusan pakaian adat secara virtual, <span className="text-secondary-green dark:text-secondary-green-dark">dengar langsung cerita di balik setiap motif dan warna.</span>
                        </p>
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-text-muted text-base sm:text-lg dark:text-gray-400">Satu klik di peta, kamu sudah “berada” di provinsi itu: langsung ganti baju adat, tahu makna filosofinya, dan foto bareng teman dengan busana khas daerah. Seru, bangga, dan bikin ingin terus jelajah dari Sabang sampai Merauke!</p>
                </div>
            </div>
            <div className="mx-auto mt-12 max-w-6xl">
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
