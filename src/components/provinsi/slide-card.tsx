"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Pastikan install lucide-react atau ganti dengan icon lain

interface CardData {
    id: number;
    title: string;
    description: string;
    color: string;
}

const data: CardData[] = [
    { id: 1, title: "Card 1", description: "Deskripsi singkat 1", color: "bg-red-500" },
    { id: 2, title: "Card 2", description: "Deskripsi singkat 2", color: "bg-blue-500" },
    { id: 3, title: "Card 3", description: "Deskripsi singkat 3", color: "bg-green-500" },
    { id: 4, title: "Card 4", description: "Deskripsi singkat 4", color: "bg-yellow-500" },
    { id: 5, title: "Card 5", description: "Deskripsi singkat 5", color: "bg-purple-500" },
];

export default function CardCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            // Mengambil lebar card pertama untuk menentukan jarak scroll
            const scrollAmount = current.children[0].clientWidth + 16; // +16 untuk gap (gap-4 = 1rem = 16px)

            if (direction === "left") {
                current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    };

    return (
        <div className="relative mx-auto w-full max-w-4xl py-10">
            {/* Tombol Kiri */}
            <button onClick={() => scroll("left")} className="absolute top-1/2 left-0 z-10 -ml-4 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white md:-ml-10" aria-label="Scroll Left">
                <ChevronLeft className="h-6 w-6 text-gray-800" />
            </button>

            {/* Container Scroll */}
            {/* Penjelasan Class Penting:
         - overflow-x-auto: Mengaktifkan scroll horizontal
         - snap-x snap-mandatory: Membuat efek 'magnet' saat berhenti scroll
         - no-scrollbar: Menyembunyikan batang scroll (dari css global tadi)
         - px-8 md:px-0: Memberikan ruang di pinggir agar efek 'peek' terlihat di mobile
      */}
            <div ref={scrollContainerRef} className="no-scrollbar flex snap-x snap-mandatory items-center gap-4 overflow-x-auto scroll-smooth px-8 pb-4">
                {data.map((item) => (
                    <div
                        key={item.id}
                        // Logika 'Peek':
                        // w-[85%] atau w-[300px]: Lebar card tidak boleh 100% agar card sebelah terlihat
                        // shrink-0: Mencegah card mengecil (gepeng)
                        // snap-center: Posisi card akan berhenti tepat di tengah saat discroll
                        className={`flex h-64 w-[85%] shrink-0 snap-center flex-col items-center justify-center rounded-2xl text-white shadow-md transition-transform duration-300 hover:scale-105 md:w-[300px] ${item.color} `}
                    >
                        <h2 className="text-2xl font-bold">{item.title}</h2>
                        <p className="mt-2 opacity-90">{item.description}</p>
                    </div>
                ))}
            </div>

            {/* Tombol Kanan */}
            <button onClick={() => scroll("right")} className="absolute top-1/2 right-0 z-10 -mr-4 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white md:-mr-10" aria-label="Scroll Right">
                <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>
        </div>
    );
}
