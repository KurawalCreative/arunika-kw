"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface CultureTabsProps {
    data?: {
        bahasa?: string;
        kuliner?: string;
        budaya?: string;
        wisata?: string;
    }
}

export default function CultureTabs({ data }: CultureTabsProps) {
    const [selectedLanguage, setSelectedLanguage] = useState(0);
    const [selectedKuliner, setSelectedKuliner] = useState(0);
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="py-16 px-6">
            <motion.div
                className="max-w-6xl mx-auto"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Informasi Budaya</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Jelajahi berbagai aspek kekayaan budaya daerah
                    </p>
                </div>

                {/* Tabs Navigation */}
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => {
                            setActiveTab(0);
                            setSelectedLanguage(0);
                        }}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 0
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Kenali Bahasa Daerah
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab(1);
                            setSelectedKuliner(0);
                        }}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 1
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Makanan Khas
                    </button>
                </div>

                {/* ...existing tab content... */}
            </motion.div>
        </div>
    );
}