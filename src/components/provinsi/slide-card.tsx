"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dress from "@/assets/images/culture-dress.jpg";
import bali from "@/assets/images/culture-bali.jpg";
import kebaya from "@/assets/images/kebaya.jpg";
import ule from "@/assets/images/ulebalang.jpg";
import minang from "@/assets/images/minangkabau-dance.jpg";
import budi from "@/assets/images/budisusanto.png";

interface CardData {
    province: string;
    baju: string;
    isCurrent?: boolean;
}

interface CardCarouselProps {
    data?: CardData[];
    selectedIndex?: number;
    onSelectCard?: (index: number) => void;
}

const defaultData: CardData[] = [
    { province: "Aceh", baju: "Ulee Balang", isCurrent: true },
    { province: "Sumatera Utara", baju: "Uis Melayu", isCurrent: false },
    { province: "Sumatera Barat", baju: "Teluk Belanga", isCurrent: false },
    { province: "Riau", baju: "Melayu Riau", isCurrent: false },
    { province: "Jambi", baju: "Setelan Melayu", isCurrent: false },
    { province: "Sumatera Selatan", baju: "Ulos", isCurrent: false },
    { province: "Bengkulu", baju: "Beskap", isCurrent: false },
    { province: "Lampung", baju: "Tapis", isCurrent: false },
    { province: "Bali", baju: "Payas Agung", isCurrent: false },
    { province: "Jawa Tengah", baju: "Kebaya Jawa", isCurrent: false },
];

const gradients = ["from-amber-500 via-orange-500 to-red-500", "from-blue-500 via-indigo-500 to-purple-500", "from-green-500 via-emerald-500 to-teal-500", "from-yellow-500 via-amber-500 to-orange-500", "from-purple-500 via-pink-500 to-rose-500", "from-cyan-500 via-blue-500 to-indigo-500", "from-rose-500 via-red-500 to-orange-500", "from-teal-500 via-green-500 to-emerald-500"];

const images = [ule.src, bali.src, kebaya.src, dress.src, minang.src, budi.src, bali.src, kebaya.src];

export default function CardCarousel({ data = defaultData, selectedIndex: externalSelectedIndex, onSelectCard }: CardCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [internalSelectedIndex, setInternalSelectedIndex] = React.useState<number | null>(null);

    // Use external selectedIndex if provided, otherwise use internal state
    const selectedIndex = externalSelectedIndex !== undefined ? externalSelectedIndex : internalSelectedIndex;

    const handleCardClick = (index: number) => {
        if (onSelectCard) {
            onSelectCard(index);
        } else {
            setInternalSelectedIndex(index);
        }
    };

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = current.children[0].clientWidth + 16;

            if (direction === "left") {
                current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    };

    return (
        <div className="relative mx-auto h-fit w-lg overflow-hidden py-4">
            <button onClick={() => scroll("left")} className="absolute top-1/2 left-0 z-20 -translate-y-1/2 rounded-full bg-white p-2 shadow-xl transition-all hover:scale-110 hover:shadow-2xl md:left-2 dark:bg-gray-800" aria-label="Scroll Left">
                <ChevronLeft className="h-4 w-4 text-gray-800 dark:text-white" />
            </button>

            <div ref={scrollContainerRef} className="no-scrollbar flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto scroll-smooth px-10 pb-3">
                {data.map((item, index) => {
                    const isSelected = selectedIndex === index;
                    const gradient = isSelected ? "from-primary-blue via-blue-500/20 to-indigo-500/30" : "from-gray-500 via-gray-600 to-gray-700";
                    const image = images[index % images.length];

                    return (
                        <div key={`${item.province}-${index}`} onClick={() => handleCardClick(index)} className={`group relative h-[280px] w-[calc(33.333%-0.67rem)] min-w-[220px] shrink-0 cursor-pointer snap-start overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-xl md:h-80 ${isSelected ? "ring-primary-blue ring-2 ring-offset-2" : ""}`}>
                            <div className="absolute inset-0">
                                <div className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${image})` }} />
                                <div className={`absolute inset-0 bg-linear-to-t ${gradient} transition-all duration-500 ${isSelected ? "opacity-80" : "opacity-70"} group-hover:opacity-80`} />
                            </div>

                            {item.isCurrent && (
                                <div className="absolute top-2 left-2 z-10">
                                    <span className="rounded-full bg-blue-500 px-2.5 py-0.5 text-[9px] font-bold text-white shadow-lg">Baju Daerah Ini</span>
                                </div>
                            )}

                            <div className="relative flex h-full flex-col justify-between p-3 text-white md:p-4">
                                <div className="flex justify-end">
                                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[9px] font-semibold backdrop-blur-md">{item.province}</span>
                                </div>

                                <div className="transform space-y-1.5 transition-transform duration-500 group-hover:-translate-y-1">
                                    <div className="h-0.5 w-10 rounded-full bg-white/40" />
                                    <h3 className="text-base leading-tight font-bold md:text-lg">{item.baju}</h3>
                                    <p className="text-[10px] leading-relaxed text-white/90">Pakaian adat dari {item.province}</p>
                                </div>
                            </div>

                            <div className="absolute top-0 right-0 h-20 w-20 translate-x-5 -translate-y-5 rounded-full bg-white/10 blur-2xl" />
                        </div>
                    );
                })}
            </div>

            <button onClick={() => scroll("right")} className="absolute top-1/2 right-0 z-20 -translate-y-1/2 rounded-full bg-white p-2 shadow-xl transition-all hover:scale-110 hover:shadow-2xl md:right-2 dark:bg-gray-800" aria-label="Scroll Right">
                <ChevronRight className="h-4 w-4 text-gray-800 dark:text-white" />
            </button>
        </div>
    );
}
