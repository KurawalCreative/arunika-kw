import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import petaInteraktif from "@/assets/svg/peta-interaktif.svg";
import audio from "@/assets/svg/audio.svg";
import medal from "@/assets/svg/medal.svg";
import chatBot from "@/assets/svg/chat-bot.svg";
import aiGame from "@/assets/svg/ai-game.svg";
import classIcon from "@/assets/svg/class.svg";

const features = [
    {
        id: 1,
        icon: petaInteraktif,
        color: "bg-[#E7FFD7]",
        title: "Peta Interaktif Nusantara",
        desc: "Jelajahi Indonesia lewat peta! Klik tiap daerah untuk melihat tradisi, makanan, dan budaya uniknya.",
    },
    {
        id: 2,
        icon: chatBot,
        color: "bg-[#D7EBFF]",
        title: "AI Budaya Assistant",
        desc: "Asisten cerdas yang siap menjawab pertanyaan dan merekomendasikan topik budaya menarik.",
    },
    {
        id: 3,
        icon: audio,
        color: "bg-[#D7EBFF]",
        title: "Storyteller Audio",
        desc: "Dengarkan dongeng dan legenda dari berbagai daerah dengan suara ekspresif.",
    },
    {
        id: 4,
        icon: aiGame,
        color: "bg-[#FFE2C9]",
        title: "Mini Game & Kuis",
        desc: "Belajar budaya sambil bermain lewat game dan kuis seru!",
    },
    {
        id: 5,
        icon: medal,
        color: "bg-[#FFE2C9]",
        title: "Lencana Budaya",
        desc: "Kumpulkan lencana dari tiap daerah yang sudah kamu jelajahi.",
    },
    {
        id: 6,
        icon: classIcon,
        color: "bg-[#E7FFD7]",
        title: "Ruang Belajar Anak",
        desc: "Pelajari budaya lewat video, infografis, dan aktivitas interaktif yang menyenangkan.",
    },
];

const FeaturesSection = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    return (
        <section className="mx-auto max-w-7xl px-4 py-20">
            <div className="flex flex-col gap-12 md:flex-row">
                {/* Kiri */}
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex-1">
                    <h1 className="text-3xl leading-snug font-semibold text-gray-900 dark:text-white">
                        Belajar budaya dengan <span className="text-primary-blue dark:text-blue-400">cara baru yang seru, interaktif, dan cerdas!</span>
                    </h1>
                    <p className="text-text-secondary mt-2 leading-relaxed font-medium dark:text-gray-300">Setiap fitur di Arunika dirancang agar anak-anak bisa menjelajahi kekayaan budaya Indonesia sambil bermain dan berimajinasi.</p>
                    <Link href="/" className="bg-primary-blue hover:bg-primary-blue-hover mt-4 inline-flex items-center gap-3 rounded-full py-2 pr-2 pl-5 font-medium text-white transition-all dark:bg-blue-600 dark:hover:bg-blue-700">
                        Menjelajah Nusantara
                        <span className="text-primary-blue flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-gray-800 dark:text-blue-400">
                            <ArrowUpRight size={22} />
                        </span>
                    </Link>
                </motion.div>

                {/* Kanan */}
                <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid flex-2/6 grid-cols-1 gap-6 sm:grid-cols-2">
                    {features.map((f) => (
                        <motion.div key={f.id} variants={itemVariants} className="flex items-start gap-4">
                            <div className={`h-12 w-12 ${f.color} dark:bg-opacity-20 flex shrink-0 items-center justify-center rounded-lg`}>
                                <Image src={f.icon} alt={f.title} width={28} height={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{f.title}</h3>
                                <p className="text-font-secondary mt-1 text-sm leading-snug dark:text-gray-400">{f.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturesSection;
