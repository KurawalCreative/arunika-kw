"use client";

import { useState } from "react";
import { DottedMap } from "../ui/dotted-map";
import { Cursor, CursorFollow, CursorProvider, type CursorFollowProps } from "@/components/animate-ui/components/animate/cursor";

interface CursorDemoProps {
    global?: boolean;
    enableCursor?: boolean;
    enableCursorFollow?: boolean;
    side?: CursorFollowProps["side"];
    sideOffset?: number;
    align?: CursorFollowProps["align"];
    alignOffset?: number;
}

const steps = [
    {
        num: "01",
        title: "Masuk atau Buat Akun",
        desc: "Login pake Google/Apple, langsung bisa coba semua 700+ pakaian adat dari 38 provinsi",
        color: "text-orange-500",
        border: "border-orange-500",
    },
    {
        num: "02",
        title: "Buka Peta Indonesia",
        desc: "Klik provinsi mana saja dari Sabang sampai Merauke.",
        component: <DottedMap />,
        color: "text-primary-blue",
        border: "border-primary-blue",
    },
    {
        num: "03",
        title: "Dengar Cerita di Baliknya",
        desc: "Setiap motif dan warna punya makna & kisah seru yang langsung muncul.",
        color: "text-accent-coral",
        border: "border-accent-coral",
    },
    {
        num: "04",
        title: "Pilih & Pakai Baju Adat",
        desc: "Coba langsung baju adatnya secara virtual – foto bareng juga bisa!",
        color: "text-secondary-green",
        border: "border-secondary-green",
    },
];

export default function HowItWorksSection({ global = false, enableCursor = true, enableCursorFollow = true, side = "bottom", sideOffset = 15, align = "end", alignOffset = 5 }: CursorDemoProps) {
    const [active, setActive] = useState(1);

    return (
        <section className="w-full px-4 py-14">
            {/* Header */}
            <div className="text-text-primary mx-auto mb-12 max-w-5xl px-4 text-center sm:mb-16 dark:text-white">
                <h1 className="text-2xl leading-snug font-semibold text-gray-900 sm:text-3xl dark:text-white">
                    Cobain seluruh <span className="text-primary-blue dark:text-primary-blue-dark">Baju Adat Nusantara</span> Cuma 4 Langkah!
                </h1>
                <p className="text-text-secondary mx-auto mt-2 max-w-3xl text-base leading-relaxed font-medium sm:text-xl dark:text-neutral-100">Ganti baju adat, tahu ceritanya, foto keren, dan bangga jadi anak Indonesia – semuanya dalam hitungan detik!</p>
            </div>

            {/* Content */}
            <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-8 sm:gap-12 lg:flex-row">
                <div className="relative flex min-h-[300px] flex-1 items-center justify-center overflow-hidden rounded-md border shadow-sm sm:h-[400px] dark:bg-neutral-800">
                    <div className="h-full text-base italic sm:text-lg"> {steps[active - 1]?.component}</div>
                    <CursorProvider global={global}>
                        {enableCursor && <Cursor />}
                        {enableCursorFollow && (
                            <CursorFollow side={side} sideOffset={sideOffset} align={align} alignOffset={alignOffset}>
                                Kamu
                            </CursorFollow>
                        )}
                    </CursorProvider>
                </div>
                <div className="flex flex-1 flex-col justify-center">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                        {steps.map((step, index) => {
                            const isActive = active === index + 1;
                            return (
                                <button key={step.num} onClick={() => setActive(index + 1)} className={`group relative flex h-full flex-col rounded-lg border-2 p-4 text-left transition-all duration-300 sm:p-6 ${isActive ? `${step.border} bg-white shadow-md dark:bg-neutral-800` : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"}`}>
                                    <span className={`mb-3 text-2xl font-bold transition-colors duration-300 sm:text-3xl ${isActive ? step.color : "text-gray-300 dark:text-gray-600"}`}>{step.num}</span>
                                    <h3 className={`mb-2 text-sm leading-tight font-semibold transition-colors duration-300 sm:text-lg ${isActive ? step.color : "text-gray-600 dark:text-gray-400"}`}>{step.title}</h3>
                                    <p className={`text-xs leading-relaxed transition-colors duration-300 sm:text-sm ${isActive ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}`}>{step.desc}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
