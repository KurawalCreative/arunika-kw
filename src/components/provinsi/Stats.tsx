"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import logotari from '@/assets/images/logotari.png'
import logomusik from '@/assets/images/logomusik.png'
import logokerajinan from '@/assets/images/logokerajinan.png'

const statsData = [
    { image: logotari, title: 'Seni Pertunjukan', desc: 'Wayang, Tari Tradisional, Teater' },
    { image: logomusik, title: 'Musik Tradisional', desc: 'Gamelan, Angklung, Orkes Dangdut' },
    { image: logokerajinan, title: 'Kerajinan & Seni', desc: 'Batik, Ukiran, Keramik Tradisional' }
];

export default function Stats() {
    return (
        <div className="relative bg-white">
            <div className="flex gap-6 justify-center px-6 flex-wrap">
                {statsData.map((item, index) => (
                    <motion.div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-8 w-full sm:w-80 text-center hover:shadow-lg transition-shadow"
                        initial={{ opacity: 0, y: -50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                    >
                        <div className="w-30 h-30 mx-auto mb-4 relative">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover rounded-full"
                            />
                        </div>
                        <h2 className="text-2xl font-bold text-accent-coral mb-2">{item.title}</h2>
                        <p className="text-sm text-gray-700">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
