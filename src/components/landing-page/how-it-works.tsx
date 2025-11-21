import { useState } from "react";
import Image from "next/image";

const steps = [
    {
        num: "01",
        title: "Pilih Daerah di Peta",
        desc: "Klik peta interaktif untuk menjelajahi provinsi yang ingin kamu pelajari.",
        color: "text-primary-blue",
        border: "border-primary-blue",
    },
    {
        num: "02",
        title: "Eksplorasi Konten Budaya",
        desc: "Temukan sejarah, baju adat, makanan khas, hingga tarian tradisional dari daerah pilihanmu.",
        color: "text-secondary-green",
        border: "border-secondary-green",
    },
    {
        num: "03",
        title: "Belajar Sambil Bermain",
        desc: "Ikuti mini game, kuis cepat, atau dengarkan storyteller audio untuk memperdalam pemahamanmu.",
        color: "text-accent-coral",
        border: "border-accent-coral",
    },
    {
        num: "04",
        title: "Kumpulkan Lencana Budaya",
        desc: "Setiap kali menyelesaikan aktivitas, kamu mendapatkan lencana unik dari tiap daerah.",
        color: "text-orange",
        border: "border-orange",
    },
];

export default function HowItWorksSection() {
    const [active, setActive] = useState(1);

    return (
        <section className="w-full px-6 py-20">
            {/* Header */}
            <div className="text-text-primary mx-auto mb-16 max-w-5xl px-4 text-center dark:text-white">
                <h1 className="text-3xl leading-snug font-semibold text-gray-900 dark:text-white">
                    <span className="text-primary-blue dark:text-blue-400">Belajar budaya Indonesia</span> nggak harus membosankan.
                </h1>
                <h4 className="text-text-secondary mx-auto mt-2 max-w-3xl text-xl leading-relaxed font-medium dark:text-gray-300">
                    Di sini, kamu bisa <span className="text-secondary-green dark:text-green-400">menjelajahi peta, bermain kuis, dan mendengarkan cerita menarik dari setiap daerah Nusantara!</span>
                </h4>
            </div>

            {/* Content */}
            <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-12 md:flex-row">
                {/* Kiri (Placeholder) */}
                <div className="relative flex min-h-[400px] flex-1 items-center justify-center overflow-hidden rounded-md bg-gray-100 shadow-sm dark:bg-gray-800">
                    <div className="text-lg text-gray-400 italic dark:text-gray-500"></div>
                </div>

                {/* Kanan (Langkah-langkah interaktif) */}
                <div className="flex flex-1 flex-col justify-center">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {steps.map((step, index) => {
                            const isActive = active === index + 1;
                            return (
                                <button key={step.num} onClick={() => setActive(index + 1)} className={`group relative flex h-full flex-col rounded-lg border-2 p-6 text-left transition-all duration-300 ${isActive ? `${step.border} bg-white shadow-md dark:bg-gray-800` : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"}`}>
                                    <span className={`mb-3 text-3xl font-bold transition-colors duration-300 ${isActive ? step.color : "text-gray-300 dark:text-gray-600"}`}>{step.num}</span>
                                    <h3 className={`mb-2 text-lg leading-tight font-semibold transition-colors duration-300 ${isActive ? step.color : "text-gray-600 dark:text-gray-400"}`}>{step.title}</h3>
                                    <p className={`text-sm leading-relaxed transition-colors duration-300 ${isActive ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}`}>{step.desc}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
