import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import petaInteraktif from "@/assets/svg/peta-interaktif.svg";
import audio from "@/assets/svg/audio.svg";
import medal from "@/assets/svg/medal.svg";
import tshirt from "@/assets/svg/t-shirt.svg";
import camera from "@/assets/svg/camera.svg";
import instagram from "@/assets/svg/instagram.svg";

const features = [
    {
        id: 1,
        icon: petaInteraktif,
        color: "bg-[#E7FFD7]",
        title: "Peta Interaktif 38 Provinsi",
        desc: "Klik provinsi mana saja, langsung muncul semua pakaian adatnya.",
    },
    {
        id: 2,
        icon: tshirt,
        color: "bg-[#D7EBFF]",
        title: "Virtual Try-On Instan",
        desc: "Upload foto sekali → langsung bisa coba semua baju adat secara realistis.",
    },
    {
        id: 3,
        icon: camera,
        color: "bg-[#FFE2C9]",
        title: "Foto Keren & Simpan Koleksi",
        desc: "Pose bareng teman, download, atau simpan di galeri pakaian adatmu.",
    },
    {
        id: 4,
        icon: instagram, // atau instagram-like icon
        color: "bg-[#E7FFD7]",
        title: "Share ke Medsos",
        desc: "Pamer foto berbaju adat ke Instagram, TikTok, atau Stories dalam 1 klik.",
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
        <section className="mx-auto max-w-7xl px-4 py-14">
            <div className="flex flex-col gap-12 md:flex-col lg:flex-row">
                {/* Kiri */}
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex-1">
                    <h1 className="text-text-primary text-2xl leading-snug font-semibold md:text-3xl dark:text-neutral-100">
                        Upload Foto Sekali, <span className="text-primary-blue dark:text-primary-blue-dark">Pakai Semua Baju Adat Indonesia!</span>
                    </h1>
                    <p className="text-text-secondary mt-4 leading-relaxed font-medium sm:text-xl dark:text-neutral-200">Dari Ulee Balang Aceh sampai Baju Adat Rote coba, foto, dengar ceritanya, dan bangga jadi anak Nusantara.</p>
                    <Link href="/" className="bg-primary-blue hover:bg-primary-blue-hover dark:bg-primary-blue-dark dark:hover:bg-primary-blue-hover-dark mt-4 inline-flex items-center gap-3 rounded-full py-2 pr-2 pl-5 font-medium text-white transition-all">
                        Menjelajah Nusantara
                        <span className="text-primary-blue dark:text-primary-blue-dark flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-gray-100">
                            <ArrowUpRight size={22} />
                        </span>
                    </Link>
                </motion.div>

                {/* Kanan */}
                <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid flex-1/4 grid-cols-1 items-center gap-5 sm:grid-cols-2">
                    {features.map((f) => (
                        <motion.div key={f.id} variants={itemVariants} className="flex items-start gap-4">
                            <div className={`h-12 w-12 ${f.color} dark:bg-opacity-20 flex shrink-0 items-center justify-center rounded-lg`}>
                                <Image src={f.icon} alt={f.title} width={28} height={28} />
                            </div>
                            <div>
                                <h3 className="text-text-primary text-sm font-semibold md:text-lg dark:text-white">{f.title}</h3>
                                <p className="text-font-secondary text-text-secondary mt-1 text-sm leading-snug md:text-sm dark:text-gray-400">{f.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturesSection;
