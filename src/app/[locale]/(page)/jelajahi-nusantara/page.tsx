"use client";

import { useState } from "react";
import InteractiveMap from "@/components/interactive-map";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const provinces = [
    "Aceh",
    "Sumatera Utara",
    "Sumatera Barat",
    "Riau",
    "Jambi",
    "Sumatera Selatan",
    "Bengkulu",
    "Lampung",
    "Banten",
    "Jawa Barat",
    "DKI Jakarta",
    "Jawa Tengah",
    "DI Yogyakarta",
    "Jawa Timur",
    "Bali",
    "Nusa Tenggara Barat",
    "Nusa Tenggara Timur",
    "Kalimantan Barat",
    "Kalimantan Tengah",
    "Kalimantan Selatan",
    "Kalimantan Timur",
    "Kalimantan Utara",
    "Sulawesi Utara",
    "Sulawesi Tengah",
    "Sulawesi Selatan",
    "Sulawesi Tenggara",
    "Gorontalo",
    "Maluku",
    "Maluku Utara",
    "Papua",
    "Papua Barat",
    "Papua Selatan",
    "Papua Tengah",
    "Papua Pegunungan",
    "Papua Barat Daya",
];

export default function JelajahiNusantaraPage() {
    const [search, setSearch] = useState("");
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

    const filteredProvinces = provinces.filter((prov) => prov.toLowerCase().includes(search.toLowerCase()));

    return (
        <section className="flex h-screen flex-col items-center  lg:mt-24">
            {/* Map Section */}
            <div className="w-full max-w-7xl">
                <InteractiveMap selectedProvince={selectedProvince} />
            </div>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex w-full max-w-7xl flex-col items-center text-center justify-center">
                <div className="flex w-full max-w-6xl gap-2">
                    <Input placeholder="Cari provinsi..." value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-full h-12" />
                    <Button onClick={() => setSelectedProvince(search)} className="bg-orange rounded-full p-4 h-12 w-12 text-white hover:bg-orange-400">
                        <Search size={16} />
                    </Button>
                </div>

                {search && (
                    <div className="mt-2 max-h-48 w-full max-w-md overflow-y-auto rounded-lg border bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-900">
                        {filteredProvinces.length ? (
                            filteredProvinces.map((prov) => (
                                <div
                                    key={prov}
                                    onClick={() => {
                                        setSelectedProvince(prov);
                                        setSearch(prov);
                                    }}
                                    className="cursor-pointer px-4 py-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                >
                                    {prov}
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-center text-sm text-gray-500">Provinsi tidak ditemukan</p>
                        )}
                    </div>
                )}
            </motion.div>
        </section>
    );
}
