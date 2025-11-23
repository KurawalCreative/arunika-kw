"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import provinsiData from "@/assets/provinsi.json";
import CardCarousel from "@/components/provinsi/slide-card";

const pakaianAdatData = {
    total: 38,
    by_provinsi: {
        Aceh: [
            {
                id: "ulee_balang",
                name: "Ulee Balang (Aceh)",
                provinsi: "Aceh",
            },
        ],
        "Sumatera Barat": [
            {
                id: "bundo_kanduang",
                name: "Bundo Kanduang (Sumatera Barat)",
                provinsi: "Sumatera Barat",
            },
        ],
        "Sumatera Utara": [
            {
                id: "ulos",
                name: "Ulos (Sumatera Utara)",
                provinsi: "Sumatera Utara",
            },
        ],
        "Sumatera Selatan": [
            {
                id: "aesan_gede",
                name: "Aesan Gede (Sumatera Selatan)",
                provinsi: "Sumatera Selatan",
            },
        ],
        "Kepulauan Riau": [
            {
                id: "teluk_belanga",
                name: "Teluk Belanga (Kepulauan Riau)",
                provinsi: "Kepulauan Riau",
            },
        ],
        Riau: [
            {
                id: "kebaya_laboh_kurung",
                name: "Kebaya Laboh dan Kurung Cekak Musang (Riau)",
                provinsi: "Riau",
            },
        ],
        Bengkulu: [
            {
                id: "baju_betabur",
                name: "Baju Betabur (Bengkulu)",
                provinsi: "Bengkulu",
            },
        ],
        Jambi: [
            {
                id: "baju_kurung_jambi",
                name: "Baju Kurung (Jambi)",
                provinsi: "Jambi",
            },
        ],
        "Bangka Belitung": [
            {
                id: "paksian",
                name: "Paksian (Bangka Belitung)",
                provinsi: "Bangka Belitung",
            },
        ],
        Lampung: [
            {
                id: "tulang_bawang",
                name: "Tulang Bawang (Lampung)",
                provinsi: "Lampung",
            },
        ],
        Banten: [
            {
                id: "pangsi",
                name: "Pangsi (Banten)",
                provinsi: "Banten",
            },
        ],
        "DKI Jakarta": [
            {
                id: "kebaya_encim",
                name: "Kebaya Encim (DKI Jakarta)",
                provinsi: "DKI Jakarta",
            },
        ],
        "Jawa Barat": [
            {
                id: "kebaya_sunda",
                name: "Kebaya Sunda (Jawa Barat)",
                provinsi: "Jawa Barat",
            },
        ],
        "Daerah Istimewa Yogyakarta": [
            {
                id: "kesatrian_ageng",
                name: "Kesatrian Ageng (DI Yogyakarta)",
                provinsi: "Daerah Istimewa Yogyakarta",
            },
        ],
        "Jawa Tengah": [
            {
                id: "jawi_jangkep",
                name: "Jawi Jangkep (Jawa Tengah)",
                provinsi: "Jawa Tengah",
            },
        ],
        "Jawa Timur": [
            {
                id: "pesaan",
                name: "Pesa’an (Jawa Timur)",
                provinsi: "Jawa Timur",
            },
        ],
        Bali: [
            {
                id: "payas_agung",
                name: "Payas Agung (Bali)",
                provinsi: "Bali",
            },
        ],
        "Nusa Tenggara Barat": [
            {
                id: "pegon",
                name: "Pegon (Nusa Tenggara Barat)",
                provinsi: "Nusa Tenggara Barat",
            },
        ],
        "Nusa Tenggara Timur": [
            {
                id: "amarasi",
                name: "Amarasi (Nusa Tenggara Timur)",
                provinsi: "Nusa Tenggara Timur",
            },
        ],
        "Kalimantan Barat": [
            {
                id: "king_bibinge_baba",
                name: "King Bibinge dan King Baba (Kalimantan Barat)",
                provinsi: "Kalimantan Barat",
            },
        ],
        "Kalimantan Tengah": [
            {
                id: "upak_nyamu",
                name: "Upak Nyamu (Kalimantan Tengah)",
                provinsi: "Kalimantan Tengah",
            },
        ],
        "Kalimantan Utara": [
            {
                id: "taa_sapei_sapaq",
                name: "Ta’a dan Sapei Sapaq (Kalimantan Utara)",
                provinsi: "Kalimantan Utara",
            },
        ],
        "Kalimantan Selatan": [
            {
                id: "bagajah_gamuling",
                name: "Bagajah Gamuling (Kalimantan Selatan)",
                provinsi: "Kalimantan Selatan",
            },
        ],
        "Kalimantan Timur": [
            {
                id: "kustin",
                name: "Kustin (Kalimantan Timur)",
                provinsi: "Kalimantan Timur",
            },
        ],
        "Sulawesi Barat": [
            {
                id: "pattuqduq_towaine",
                name: "Pattuqduq Towaine (Sulawesi Barat)",
                provinsi: "Sulawesi Barat",
            },
        ],
        "Sulawesi Tengah": [
            {
                id: "nggembe",
                name: "Nggembe (Sulawesi Tengah)",
                provinsi: "Sulawesi Tengah",
            },
        ],
        "Sulawesi Utara": [
            {
                id: "laku_tepu",
                name: "Laku Tepu (Sulawesi Utara)",
                provinsi: "Sulawesi Utara",
            },
        ],
        "Sulawesi Tenggara": [
            {
                id: "babu_nggawi",
                name: "Babu Nggawi (Sulawesi Tenggara)",
                provinsi: "Sulawesi Tenggara",
            },
        ],
        "Sulawesi Selatan": [
            {
                id: "baju_bodo",
                name: "Baju Bodo (Sulawesi Selatan)",
                provinsi: "Sulawesi Selatan",
            },
        ],
        Gorontalo: [
            {
                id: "biliu_makuta",
                name: "Biliu dan Makuta (Gorontalo)",
                provinsi: "Gorontalo",
            },
        ],
        Maluku: [
            {
                id: "cele",
                name: "Cele (Maluku)",
                provinsi: "Maluku",
            },
        ],
        "Maluku Utara": [
            {
                id: "manteren_lamo",
                name: "Manteren Lamo (Maluku Utara)",
                provinsi: "Maluku Utara",
            },
        ],
        "Papua Barat": [
            {
                id: "ewer",
                name: "Ewer (Papua Barat)",
                provinsi: "Papua Barat",
            },
        ],
        Papua: [
            {
                id: "koteka_holim",
                name: "Koteka (Papua)",
                provinsi: "Papua",
            },
        ],
        "Papua Selatan": [
            {
                id: "pummi",
                name: "Pummi (Papua Selatan)",
                provinsi: "Papua Selatan",
            },
        ],
        "Papua Tengah": [
            {
                id: "yokal",
                name: "Yokal (Papua Tengah)",
                provinsi: "Papua Tengah",
            },
        ],
        "Papua Pegunungan": [
            {
                id: "holim_dani",
                name: "Holim (Papua Pegunungan)",
                provinsi: "Papua Pegunungan",
            },
        ],
        "Papua Barat Daya": [
            {
                id: "ewer_tehit",
                name: "Ewer Tehit (Papua Barat Daya)",
                provinsi: "Papua Barat Daya",
            },
        ],
    },
    all_ids: [
        "ulee_balang",
        "bundo_kanduang",
        "ulos",
        "aesan_gede",
        "teluk_belanga",
        "kebaya_laboh_kurung",
        "baju_betabur",
        "baju_kurung_jambi",
        "paksian",
        "tulang_bawang",
        "pangsi",
        "kebaya_encim",
        "kebaya_sunda",
        "kesatrian_ageng",
        "jawi_jangkep",
        "pesaan",
        "payas_agung",
        "pegon",
        "amarasi",
        "king_bibinge_baba",
        "upak_nyamu",
        "taa_sapei_sapaq",
        "bagajah_gamuling",
        "kustin",
        "pattuqduq_towaine",
        "nggembe",
        "laku_tepu",
        "babu_nggawi",
        "baju_bodo",
        "biliu_makuta",
        "cele",
        "manteren_lamo",
        "ewer",
        "koteka_holim",
        "pummi",
        "yokal",
        "holim_dani",
        "ewer_tehit",
    ],
};

const detailBadges = ["Wisata Alam", "Kulinari Khas", "Komunitas Lokal", "Warisan Budaya"];

const templateBlueprints = [
    "Baju adat wanita {province} dengan motif tradisional",
    "Baju adat pria {province} dengan aksen {bajuAdat} klasik",
    "Lookbook modern {province} + {bajuAdat} kontemporer",
    "Katalog warisan {province}: {bajuAdat} dan tekstil alami",
    "Streetwear layering {province} dengan sentuhan {bajuAdat}",
    "Siluet baju adat {province} untuk wanita muda",
    "Editorial warna-warni {province} dengan motif {bajuAdat}",
    "Desain couture {province}: {bajuAdat} & aksesoris lokal",
    "Baju adat unisex {province} untuk komunitas",
    "Koreografi visual: Baju adat {province} dengan pencahayaan soft",
];

type ProvinceMeta = {
    name: string;
    ibu_kota: string;
    pulau: string;
    luas?: number;
    penduduk?: number;
    bahasa?: string[];
    kuliner?: string[];
    wisata?: string[];
    budaya?: string[];
    baju_adat?: string[];
    deskripsi?: string;
};

const provinces = provinsiData as ProvinceMeta[];

const slugify = (value: string) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

const formatIdNumber = (value?: number) => (typeof value === "number" ? new Intl.NumberFormat("id-ID").format(value) : undefined);

const formatProvinceName = (slug?: string) => {
    if (!slug) return "Indonesia";
    return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const getPakaianId = (bajuName: string): string | undefined => {
    for (const province of Object.keys(pakaianAdatData.by_provinsi) as (keyof typeof pakaianAdatData.by_provinsi)[]) {
        const items = pakaianAdatData.by_provinsi[province];
        for (const item of items) {
            if (item.name.startsWith(bajuName + " (")) {
                return item.id;
            }
        }
    }
    return undefined;
};

export default function Page() {
    const params = useParams();
    const rawProvince = params?.provinsi;
    const provinceSlug = Array.isArray(rawProvince) ? rawProvince[0] : rawProvince;
    const provinceName = useMemo(() => formatProvinceName(provinceSlug), [provinceSlug]);

    const [viewMode, setViewMode] = useState<"upload" | "detail">("upload");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const [processedImageURL, setProcessedImageURL] = useState<string | null>(null);
    const uploadSectionRef = useRef<HTMLDivElement>(null);
    const detailSectionRef = useRef<HTMLDivElement>(null);
    const [previewReady, setPreviewReady] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [selectedBajuIndex, setSelectedBajuIndex] = useState(0);
    const [selectedAPI, setSelectedAPI] = useState<"qwen" | "modal">("qwen");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isBuilding, setIsBuilding] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        if (!selectedFile) {
            setPreviewURL(null);
            setProcessedImageURL(null);
            setPreviewReady(false);
            return;
        }
        // Clear processed image when new file is selected
        setProcessedImageURL(null);
        setPreviewReady(false);
    }, [selectedFile]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewURL(url);
        }
    };

    const normalizedProvinceSlug = useMemo(() => slugify(provinceSlug ?? ""), [provinceSlug]);
    const provinceData = useMemo(() => {
        if (!normalizedProvinceSlug) return undefined;
        return provinces.find((entry) => slugify(entry.name) === normalizedProvinceSlug);
    }, [normalizedProvinceSlug]);

    const generalDetails = useMemo(
        () => [
            { label: "Ibu Kota", value: provinceData?.ibu_kota ?? `${provinceName} City Center` },
            { label: "Pulau", value: provinceData?.pulau ?? "Kepulauan Nusantara" },
            {
                label: "Penduduk",
                value: provinceData?.penduduk ? `${formatIdNumber(provinceData.penduduk)} jiwa` : "Perkiraan belum tersedia",
            },
            {
                label: "Luas Wilayah",
                value: provinceData?.luas ? `${formatIdNumber(provinceData.luas)} km²` : "Belum ada data",
            },
        ],
        [provinceData, provinceName],
    );

    const budayaList = provinceData?.budaya ?? [];
    const wisataList = provinceData?.wisata ?? [];
    const bahasaList = provinceData?.bahasa ?? [];
    const kulinerList = provinceData?.kuliner ?? [];
    const bajuAdatList = provinceData?.baju_adat ?? [];

    const otherBajuAdat = useMemo(() => {
        const all = provinces.filter((p) => p.baju_adat && p.baju_adat.length > 0).map((p) => ({ province: p.name, baju: p.baju_adat![0], isCurrent: slugify(p.name) === normalizedProvinceSlug }));
        const current = all.find((p) => p.isCurrent);
        const others = all.filter((p) => !p.isCurrent);
        return current ? [current, ...others] : others;
    }, [normalizedProvinceSlug]);

    const displayedBaju = showAll ? otherBajuAdat : otherBajuAdat.slice(0, 9);

    const selectedBaju = otherBajuAdat[selectedBajuIndex]?.baju ?? "Baju adat pilihan";

    const resultDescription = useMemo(() => {
        const fileSentence = selectedFile ? "Gambar sudah siap diolah untuk menghidupkan cerita." : "Unggah gambar agar hasilnya bisa lebih personal.";

        return `Baju adat "${selectedBaju}" akan dijadikan acuan visual. ${fileSentence}`;
    }, [selectedFile, selectedBaju]);

    const resultHighlights = useMemo(
        () => [
            { label: "Baju Adat Pilihan", value: selectedBaju },
            { label: "Sumber", value: selectedFile ? "Foto Rekomendasi" : "Mockup Visual" },
        ],
        [selectedFile, selectedBaju],
    );

    const detailHighlights = useMemo(() => {
        const extras = [...budayaList.slice(0, 2), ...wisataList.slice(0, 2)];
        return [...detailBadges, ...extras];
    }, [budayaList, wisataList]);

    const detailDescription = provinceData?.deskripsi ?? "Deskripsi daerah belum tersedia.";

    const clearUpload = () => {
        setSelectedFile(null);
        setPreviewURL(null);
        setProcessedImageURL(null);
        setPreviewReady(false);
    };

    const handleProcessTryOn = async () => {
        if (!selectedFile) return;
        setIsProcessing(true);
        setUploadProgress(0);
        setIsBuilding(false);
        setErrorMessage(null);
        try {
            const formData = new FormData();
            formData.append("image", selectedFile);
            const prompt = `Apply the traditional clothing "${selectedBaju}" from ${provinceName} to this image.`;
            formData.append("prompt", prompt);
            if (selectedAPI === "modal") {
                const pakaianId = getPakaianId(selectedBaju);
                formData.append("pakaian_id", pakaianId || "ulee_balang");
            }

            const response = await axios.post(`/api/process-image-${selectedAPI}`, formData, {
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                    setUploadProgress(percent);
                    if (percent === 100) {
                        setIsBuilding(true);
                        setDownloadProgress(0);
                    }
                },
                onDownloadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                    setDownloadProgress(percent);
                },
            });

            setProcessedImageURL(response.data.image);
            setPreviewReady(true);
        } catch (error) {
            console.error("Error processing image:", error);
            setErrorMessage("Gagal mentransformasi gambar. Silakan coba lagi.");
        } finally {
            setIsProcessing(false);
            setUploadProgress(0);
            setIsBuilding(false);
            setDownloadProgress(0);
        }
    };

    useEffect(() => {
        if (!otherBajuAdat.length) {
            setSelectedBajuIndex(0);
            return;
        }

        setSelectedBajuIndex((prev) => (prev < otherBajuAdat.length ? prev : 0));
    }, [otherBajuAdat.length]);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleStartUpload = () => {
        setViewMode("upload");
        setTimeout(() => scrollToSection(uploadSectionRef!), 700);
    };

    const handleDetailView = () => {
        setViewMode("detail");
        setTimeout(() => scrollToSection(detailSectionRef!), 700);
    };

    return (
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-6 md:px-6">
            {/* <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-linear-to-br from-sky-600/80 via-sky-500/70 to-cyan-400/70 p-10 text-white shadow-2xl dark:border-white/20 dark:from-sky-900/80 dark:via-sky-800/60 dark:to-slate-900/90">
                <div className="relative z-10 max-w-3xl space-y-4">
                    <p className="text-xs font-semibold tracking-[0.4em] text-white/70 uppercase">Jelajahi {provinceName}</p>
                    <h1 className="text-3xl leading-tight font-bold md:text-5xl">Ciptakan dokumentasi visual bertema {provinceName}</h1>
                    <p className="max-w-2xl text-base text-white/90 md:text-lg">Unggah apa pun—manusia, kucing, atau lanskap—lalu lihat langsung bagaimana tampilan tersebut disusun ulang agar cocok dengan nuansa {provinceName} sebelum kamu bagikan atau tampilkan.</p>
                    <div className="flex flex-wrap gap-3">
                        <Button size="lg" variant="secondary" onClick={handleStartUpload}>
                            Mulai Unggah
                        </Button>
                        <Button variant="ghost" size="lg" className="border-white/30 text-white/90" onClick={handleDetailView}>
                            Jelajahi detail daerah
                        </Button>
                    </div>
                </div>
            </div> */}

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-sky-300 bg-sky-100/70 p-4 text-sm font-semibold text-sky-900 dark:border-sky-700 dark:bg-sky-900/40 dark:text-sky-100">
                <p className="flex-1">Mau langsung coba tampilan atau merasa perlu tahu detail daerah dulu?</p>
                <div className="flex gap-2">
                    <Button size="sm" variant={viewMode === "upload" ? "default" : "outline"} onClick={() => setViewMode("upload")}>
                        Coba Tampilan
                    </Button>
                    <Button size="sm" variant={viewMode === "detail" ? "default" : "outline"} onClick={() => setViewMode("detail")}>
                        Detail Daerah
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <AnimatePresence mode="wait">
                    {viewMode === "upload" ? (
                        <motion.div ref={uploadSectionRef} className="grid gap-6 lg:grid-cols-[1.25fr_0.85fr]" key="upload" id="upload" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.35 }}>
                            <motion.div className="space-y-4">
                                <Card className="space-y-3 bg-white/80 p-0 shadow-xl dark:bg-gray-900/80">
                                    <CardHeader className="px-6 pt-6">
                                        <CardTitle>Sesi 1 · Unggah & Siapkan</CardTitle>
                                        <CardDescription>Unggah foto apa pun—manusia, hewan, atau detail lokasi—lalu sesuaikan catatan singkat agar hasil try-on terasa personal.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-6 pb-4">
                                        <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-sky-200 bg-sky-50/60 p-4 dark:border-sky-600 dark:bg-sky-900/40">
                                            {previewURL ? (
                                                <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-white shadow-inner">
                                                    <img src={previewURL} alt="Preview Budaya" className="h-full w-full object-cover" />
                                                    <Button variant="secondary" size="sm" className="absolute top-2 right-2 h-8 w-8 rounded-full p-0" onClick={clearUpload}>
                                                        ✕
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center gap-2 text-center">
                                                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Upload gambar di sini</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Klik untuk memilih file atau drag & drop</p>
                                                    <input id="cultural-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                                                    <Button asChild variant="default" size="sm">
                                                        <label htmlFor="cultural-upload" className="cursor-pointer">
                                                            Pilih Gambar
                                                        </label>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter></CardFooter>
                                </Card>

                                <motion.div layoutId="template-panel" className="space-y-4">
                                    <Card className="space-y-3 bg-white/90 p-0 shadow-xl dark:bg-gray-900/80">
                                        <CardHeader className="px-6 pt-6">
                                            <CardTitle>Sesi 2 · Pilih Baju Adat Lain</CardTitle>
                                            <CardDescription>Pilih baju adat dari daerah lain untuk inspirasi visual yang berbeda.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-3 px-6 pb-4">
                                            {displayedBaju.length === 0 ? (
                                                <p className="text-sm text-gray-600 dark:text-gray-300">Baju adat dari daerah lain belum tersedia.</p>
                                            ) : (
                                                <>
                                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                                                        {displayedBaju.map((item, index) => (
                                                            <Card key={`${item.province}-${index}`} className={`relative cursor-pointer p-3 transition-all duration-200 hover:shadow-md ${selectedBajuIndex === index ? "ring-primary/25 ring-1" : ""}`} onClick={() => setSelectedBajuIndex(index)}>
                                                                {item.isCurrent && <div className="absolute inset-0 right-0 bottom-0 rounded-lg bg-linear-to-tl from-blue-500/30 from-1% to-transparent"></div>}
                                                                <CardHeader className="p-0 pb-1">
                                                                    <CardTitle className="text-xs font-semibold">{item.baju}</CardTitle>
                                                                    <CardDescription className="text-[0.6rem]">dari daerah {item.province}</CardDescription>
                                                                </CardHeader>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                    {otherBajuAdat.length > 9 && (
                                                        <div className="mt-4 flex justify-center">
                                                            <button onClick={() => setShowAll(!showAll)} className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                                                                {showAll ? (
                                                                    <>
                                                                        <span>Sembunyikan</span>
                                                                        <ChevronUp className="h-4 w-4" />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span>Lihat Selengkapnya</span>
                                                                        <ChevronDown className="h-4 w-4" />
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </CardContent>
                                        <CardCarousel />
                                        <CardFooter className="-mt-8 flex flex-wrap gap-1 px-6 pb-4">
                                            <div className="mr-4 flex items-center gap-2">
                                                <label className="text-sm dark:text-gray-200">API:</label>
                                                <select value={selectedAPI} onChange={(e) => setSelectedAPI(e.target.value as "modal" | "qwen")} className="rounded border px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                                                    <option value="qwen">Qwen</option>
                                                    <option value="modal">Modal</option>
                                                </select>
                                            </div>
                                            <Button size="default" variant="default" className="rounded-md" onClick={handleProcessTryOn} disabled={isProcessing}>
                                                {isProcessing ? (isBuilding ? (downloadProgress > 0 ? `Loading... ${downloadProgress}%` : "Sedang memproses gambar...") : `Uploading... ${uploadProgress}%`) : "Proses Gambar"}
                                            </Button>
                                            {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            </motion.div>

                            <motion.div layoutId="preview-column" className="space-y-6">
                                <Card className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-slate-500 shadow-xl dark:border-slate-700 dark:bg-gray-900/60 dark:text-slate-300">
                                    <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-800" aria-hidden>
                                        {previewReady ? (
                                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <img src={processedImageURL ?? ""} alt="Edited preview" className="max-h-[40vh] w-full cursor-pointer rounded-2xl object-contain" />
                                                </DialogTrigger>
                                                <DialogContent className="max-w-4xl dark:bg-gray-900">
                                                    <div className="flex flex-col items-center gap-4 dark:text-white">
                                                        <img src={processedImageURL ?? ""} alt="Full Edited preview" className="max-h-[70vh] max-w-full object-contain" />
                                                        <div className="flex gap-2">
                                                            <Button
                                                                onClick={() => {
                                                                    const link = document.createElement("a");
                                                                    link.href = processedImageURL ?? "";
                                                                    link.download = "edited-image.png";
                                                                    link.click();
                                                                }}
                                                            >
                                                                Download
                                                            </Button>
                                                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                                                Close
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        ) : (
                                            <div className="flex h-40 flex-col items-center justify-center text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">
                                                <span>Edited Image</span>
                                                <span className="mt-1 text-[0.55rem]">Menunggu proses</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">{isBuilding ? (downloadProgress > 0 ? `Loading... ${downloadProgress}%` : "Sedang memproses gambar...") : "Preview siap ketika proses selesai"}</p>
                                </Card>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div ref={detailSectionRef} key="detail" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.35 }}>
                            <Card className="space-y-6 bg-white/90 p-0 shadow-xl dark:bg-gray-900/90">
                                <CardHeader className="px-6 pt-6">
                                    <CardTitle>Detail Daerah {provinceName}</CardTitle>
                                    <CardDescription>Ringkasan fitur lokal, kultur, dan pengalaman wisata yang bisa kamu tampilkan bersamaan dengan upload.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 px-6 pb-6">
                                    <Tabs defaultValue="ringkasan" className="space-y-4">
                                        <TabsList className="w-full gap-2 rounded-2xl border border-sky-200 bg-sky-50/60 p-1 text-[0.65rem] tracking-[0.3em] text-slate-900 uppercase shadow-inner dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100">
                                            <TabsTrigger value="ringkasan" className="text-[0.65rem] font-semibold tracking-[0.3em] text-slate-900 transition-colors duration-150 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:text-slate-100 dark:data-[state=active]:bg-sky-700 dark:data-[state=active]:text-white dark:data-[state=active]:shadow-lg">
                                                Ringkasan
                                            </TabsTrigger>
                                            <TabsTrigger value="budaya" className="text-[0.65rem] font-semibold tracking-[0.3em] text-slate-900 transition-colors duration-150 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:text-slate-100 dark:data-[state=active]:bg-sky-700 dark:data-[state=active]:text-white dark:data-[state=active]:shadow-lg">
                                                Budaya
                                            </TabsTrigger>
                                            <TabsTrigger value="kuliner" className="text-[0.65rem] font-semibold tracking-[0.3em] text-slate-900 transition-colors duration-150 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:text-slate-100 dark:data-[state=active]:bg-sky-700 dark:data-[state=active]:text-white dark:data-[state=active]:shadow-lg">
                                                Kuliner
                                            </TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="ringkasan" className="space-y-4">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                {generalDetails.map((detail) => (
                                                    <div key={detail.label} className="rounded-2xl border border-gray-100 bg-white/80 p-4 text-sm text-gray-700 shadow-sm dark:border-white/5 dark:bg-gray-900/40 dark:text-gray-200">
                                                        <p className="text-[0.65rem] tracking-[0.3em] text-slate-500 uppercase dark:text-slate-400">{detail.label}</p>
                                                        <p className="mt-2 text-base font-semibold text-gray-900 dark:text-white">{detail.value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="budaya" className="space-y-5">
                                            <div>
                                                <p className="text-[0.65rem] tracking-[0.3em] text-slate-500 uppercase dark:text-slate-400">Budaya Unggulan</p>
                                                {budayaList.length > 0 ? (
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {budayaList.map((item) => (
                                                            <Badge key={item} variant="outline" className="dark:border-slate-500 dark:text-slate-100">
                                                                {item}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Budaya khas belum tersedia untuk wilayah ini.</p>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[0.65rem] tracking-[0.3em] text-slate-500 uppercase dark:text-slate-400">Wisata & Pengalaman</p>
                                                {wisataList.length > 0 ? (
                                                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                                                        {wisataList.map((item) => (
                                                            <div key={item} className="rounded-2xl border border-sky-100 bg-sky-50/80 p-3 text-xs font-semibold text-sky-900 dark:border-sky-600 dark:bg-sky-900/40 dark:text-sky-100">
                                                                {item}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Rekomendasi wisata belum tersedia.</p>
                                                )}
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="kuliner" className="space-y-5">
                                            <div>
                                                <p className="text-[0.65rem] tracking-[0.3em] text-slate-500 uppercase dark:text-slate-400">Bahasa Lokal</p>
                                                {bahasaList.length > 0 ? (
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {bahasaList.map((item) => (
                                                            <Badge key={item} variant="secondary" className="dark:border-slate-500 dark:text-slate-100">
                                                                {item}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Informasi bahasa belum tersedia.</p>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[0.65rem] tracking-[0.3em] text-slate-500 uppercase dark:text-slate-400">Kuliner Khas</p>
                                                {kulinerList.length > 0 ? (
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {kulinerList.map((item) => (
                                                            <Badge key={item} variant="outline" className="dark:border-slate-500 dark:text-slate-100">
                                                                {item}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Kuliner khas belum tersedia.</p>
                                                )}
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                    <div className="text-muted-foreground space-y-2 text-sm">
                                        <p>{detailDescription}</p>
                                        <p>Gunakan upload ini sebagai pengantar untuk menampilkan peta narasi budaya, membangun keterlibatan komunitas, dan memperkuat destinasi pendukung landing page.</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {detailHighlights.map((badge) => (
                                            <Badge key={badge} variant="outline" className="dark:border-slate-500 dark:text-slate-100">
                                                {badge}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
