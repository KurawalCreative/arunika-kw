"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface CultureTabsProps {
    data?: {
        bahasa?: string;
        kuliner?: string;
        ibuKota?: string | null;
        pulau?: string | null;
    };
}

export default function CultureTabs({ data }: CultureTabsProps) {
    const [activeTab, setActiveTab] = useState(0);

    // Split bahasa dan kuliner jika ada
    const bahasaList = data?.bahasa?.split(", ") || [];
    const kulinerList = data?.kuliner?.split(", ") || [];

    return (
        <div className="px-4 py-12 md:px-6 md:py-16">
            <motion.div className="mx-auto max-w-6xl" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <div className="mb-8 text-center md:mb-12">
                    <h2 className="mb-3 text-2xl font-bold text-gray-800 md:mb-4 md:text-4xl dark:text-white">Informasi Budaya</h2>
                    <p className="mx-auto max-w-2xl px-4 text-sm text-gray-600 md:text-lg dark:text-gray-400">Jelajahi berbagai aspek kekayaan budaya daerah</p>
                </div>

                {/* Tabs Navigation */}
                <div className="mb-6 flex flex-col justify-center gap-2 sm:flex-row md:mb-8 md:gap-4">
                    <button onClick={() => setActiveTab(0)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all md:px-6 md:py-3 md:text-base ${activeTab === 0 ? "bg-orange-500 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"}`}>
                        Kenali Bahasa Daerah
                    </button>
                    <button onClick={() => setActiveTab(1)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all md:px-6 md:py-3 md:text-base ${activeTab === 1 ? "bg-orange-500 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"}`}>
                        Makanan Khas
                    </button>
                    <button onClick={() => setActiveTab(2)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all md:px-6 md:py-3 md:text-base ${activeTab === 2 ? "bg-orange-500 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"}`}>
                        Informasi Umum
                    </button>
                </div>

                {/* Tab Content */}
                <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg md:p-8 dark:border-gray-700 dark:bg-gray-800">
                    {activeTab === 0 && (
                        <div>
                            <h3 className="mb-4 text-xl font-bold text-orange-500 md:mb-6 md:text-2xl dark:text-orange-400">Bahasa Daerah</h3>
                            {bahasaList.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
                                    {bahasaList.map((bahasa, idx) => (
                                        <motion.div key={idx} className="rounded-lg border border-orange-100 bg-orange-50 p-4 md:p-5 dark:border-gray-600 dark:bg-gray-700" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: idx * 0.1 }} whileHover={{ scale: 1.05 }}>
                                            <p className="text-base font-semibold text-gray-800 md:text-lg dark:text-white">{bahasa}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600 md:text-base dark:text-gray-400">Informasi bahasa daerah belum tersedia.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 1 && (
                        <div>
                            <h3 className="mb-4 text-xl font-bold text-orange-500 md:mb-6 md:text-2xl dark:text-orange-400">Makanan Khas</h3>
                            {kulinerList.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
                                    {kulinerList.map((makanan, idx) => (
                                        <motion.div key={idx} className="rounded-lg border border-orange-100 bg-orange-50 p-4 md:p-5 dark:border-gray-600 dark:bg-gray-700" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: idx * 0.1 }} whileHover={{ scale: 1.05 }}>
                                            <p className="text-base font-semibold text-gray-800 md:text-lg dark:text-white">{makanan}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600 md:text-base dark:text-gray-400">Informasi kuliner belum tersedia.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 2 && (
                        <div>
                            <h3 className="mb-4 text-xl font-bold text-orange-500 md:mb-6 md:text-2xl dark:text-orange-400">Informasi Umum</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                                <motion.div className="rounded-lg border border-orange-100 bg-orange-50 p-5 md:p-6 dark:border-gray-600 dark:bg-gray-700" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                    <h4 className="mb-2 text-base font-bold text-gray-800 md:text-lg dark:text-white">Ibu Kota</h4>
                                    <p className="text-xl font-bold text-orange-500 md:text-2xl dark:text-orange-400">{data?.ibuKota || "-"}</p>
                                </motion.div>
                                <motion.div className="rounded-lg border border-orange-100 bg-orange-50 p-5 md:p-6 dark:border-gray-600 dark:bg-gray-700" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                                    <h4 className="mb-2 text-base font-bold text-gray-800 md:text-lg dark:text-white">Pulau</h4>
                                    <p className="text-xl font-bold text-orange-500 md:text-2xl dark:text-orange-400">{data?.pulau || "-"}</p>
                                </motion.div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}
