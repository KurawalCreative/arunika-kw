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
            <div className="text-text-primary mx-auto mb-16 max-w-5xl px-4 text-center">
                <h1 className="text-3xl leading-snug font-semibold">
                    <span className="text-primary-blue">Belajar budaya Indonesia</span> nggak harus membosankan.
                </h1>
                <h4 className="text-text-secondary mx-auto mt-2 max-w-3xl text-xl leading-relaxed font-medium">
                    Di sini, kamu bisa <span className="text-secondary-green">menjelajahi peta, bermain kuis, dan mendengarkan cerita menarik dari setiap daerah Nusantara!</span>
                </h4>
            </div>

            {/* Content */}
            <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-12 md:flex-row">
                {/* Kiri (Placeholder) */}
                <div className="relative flex min-h-[400px] flex-1 items-center justify-center overflow-hidden rounded-md bg-gray-100 shadow-sm">
                    <div className="text-lg text-gray-400 italic"></div>
                </div>

                {/* Kanan (Langkah-langkah interaktif) */}
                <div className="flex flex-1 flex-col justify-center">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {steps.map((step, index) => {
                            const isActive = active === index + 1;
                            return (
                                <button key={step.num} onClick={() => setActive(index + 1)} className={`group relative flex h-full flex-col rounded-lg border-2 p-6 text-left transition-all duration-300 ${isActive ? `${step.border} bg-white shadow-md` : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"}`}>
                                    <span className={`mb-3 text-3xl font-bold transition-colors duration-300 ${isActive ? step.color : "text-gray-300"}`}>{step.num}</span>
                                    <h3 className={`mb-2 text-lg leading-tight font-semibold transition-colors duration-300 ${isActive ? step.color : "text-gray-600"}`}>{step.title}</h3>
                                    <p className={`text-sm leading-relaxed transition-colors duration-300 ${isActive ? "text-gray-700" : "text-gray-500"}`}>{step.desc}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
