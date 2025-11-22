"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import provinsiData from "@/assets/provinsi.json";

const actionOptions = [
    {
        id: "story",
        title: "Sorot Cerita Rakyat",
        description: "Susun narasi visual dengan detail folklore, tarian, dan tokoh lokal agar momen budaya makin memikat.",
        palette: "Oranye Tua & Emas",
        outcome: "Story Highlight",
    },
    {
        id: "guide",
        title: "Rancang Itinerary Edukatif",
        description: "Satukan foto ke dalam rute edukasi, lengkap dengan landmark dan rekomendasi kegiatan khas daerah.",
        palette: "Cyan & Hijau Tropis",
        outcome: "Guide Map",
    },
    {
        id: "archive",
        title: "Katalog Arsip Digital",
        description: "Kemas gambar ke dalam katalog digital yang siap dibagikan ke komunitas dan museum lokal.",
        palette: "Ungu Laut & Biru",
        outcome: "Entry Arsip",
    },
];

const detailBadges = ["Wisata Alam", "Kulinari Khas", "Komunitas Lokal", "Warisan Budaya"];

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

export default function Page() {
    const params = useParams();
    const rawProvince = params?.provinsi;
    const provinceSlug = Array.isArray(rawProvince) ? rawProvince[0] : rawProvince;
    const provinceName = useMemo(() => formatProvinceName(provinceSlug), [provinceSlug]);

    const [viewMode, setViewMode] = useState<"upload" | "detail">("upload");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const [note, setNote] = useState("");
    const [selectedAction, setSelectedAction] = useState(actionOptions[0].id);
    const uploadSectionRef = useRef<HTMLDivElement>(null);
    const detailSectionRef = useRef<HTMLDivElement>(null);
    const [previewReady, setPreviewReady] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!selectedFile) {
            setPreviewURL(null);
            return;
        }

        const url = URL.createObjectURL(selectedFile);
        setPreviewURL(url);

        return () => URL.revokeObjectURL(url);
    }, [selectedFile]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedFile(file);
        }
    };

    const selectedOption = useMemo(() => actionOptions.find((action) => action.id === selectedAction) ?? actionOptions[0], [selectedAction]);

    const resultDescription = useMemo(() => {
        const baseDescription = selectedOption.description;
        const noteSentence = note ? ` Catatan kamu: "${note}".` : "";
        const fileSentence = selectedFile ? "Gambar sudah siap diolah untuk menghidupkan cerita." : "Unggah gambar agar hasilnya bisa lebih personal.";

        return `${baseDescription} ${fileSentence}${noteSentence}`;
    }, [note, selectedFile, selectedOption]);

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

    const detailHighlights = useMemo(() => {
        const extras = [...budayaList.slice(0, 2), ...wisataList.slice(0, 2)];
        return [...detailBadges, ...extras];
    }, [budayaList, wisataList]);

    const detailDescription = provinceData?.deskripsi ? provinceData.deskripsi : `${provinceName} punya banyak aspek yang bisa dieksplorasi: dari warisan tarian, kuliner laut, hingga kampung adat yang menjaga tradisi turun-temurun.`;

    const resultHighlights = useMemo(
        () => [
            { label: "Tema Warna", value: selectedOption.palette },
            { label: "Format Utama", value: selectedOption.outcome },
            { label: "Sumber", value: selectedFile ? "Foto Rekomendasi" : "Mockup Visual" },
        ],
        [selectedFile, selectedOption],
    );

    const clearUpload = () => {
        setSelectedFile(null);
        setPreviewReady(false);
    };

    const handleProcessTryOn = () => {
        if (!selectedFile) return;
        setIsProcessing(true);
        setTimeout(() => {
            setPreviewReady(true);
            setIsProcessing(false);
        }, 400);
    };

    useEffect(() => {
        if (!selectedFile) {
            setPreviewReady(false);
        }
    }, [selectedFile]);

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
            <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-linear-to-br from-sky-600/80 via-sky-500/70 to-cyan-400/70 p-10 text-white shadow-2xl dark:border-white/20 dark:from-sky-900/80 dark:via-sky-800/60 dark:to-slate-900/90">
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
            </div>

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
                        <motion.div ref={uploadSectionRef} className="space-y-3" key="upload" id="upload" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.35 }}>
                            <Card className="space-y-5 bg-white/80 p-0 shadow-xl dark:bg-gray-900/80">
                                <CardHeader className="px-6 pt-6">
                                    <CardTitle>Sesi 1 · Coba Tampilan</CardTitle>
                                    <CardDescription>Unggah foto apa pun—manusia, hewan, atau detail lokasi—dan kami akan langsung merakit ulang nuansa {provinceName} agar kamu bisa lihat hasil try-on sebelum lanjut ke pilihan aksi.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-6 px-6 pb-6 md:grid-cols-[1.2fr_0.8fr]">
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="cultural-upload" className="text-sm font-semibold">
                                                Pilih file gambar
                                            </Label>
                                            <input id="cultural-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                                            <div className="flex flex-wrap gap-3">
                                                <Button asChild variant="default" size="sm">
                                                    <label htmlFor="cultural-upload" className="cursor-pointer">
                                                        Unggah Gambar
                                                    </label>
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={clearUpload} disabled={!selectedFile}>
                                                    Reset
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold">Catatan singkat</Label>
                                            <Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ceritakan suasana, warna, atau kenangan khusus dari foto ini" rows={3} />
                                        </div>
                                        <div className="flex flex-wrap gap-2 text-[0.6rem] font-semibold tracking-[0.3em] text-slate-600 uppercase dark:text-slate-300">
                                            <Badge variant="outline" className="rounded-full bg-white/70 px-3 py-1 text-[0.55rem] font-semibold text-slate-800 shadow-sm shadow-slate-200 dark:bg-slate-900/70 dark:text-slate-100 dark:shadow-black/20">
                                                Format: Foto JPG/PNG
                                            </Badge>
                                            <Badge variant="outline" className="rounded-full bg-white/70 px-3 py-1 text-[0.55rem] font-semibold text-slate-800 shadow-sm shadow-slate-200 dark:bg-slate-900/70 dark:text-slate-100 dark:shadow-black/20">
                                                Resolusi tinggi direkomendasikan
                                            </Badge>
                                            <Badge variant="outline" className="rounded-full bg-white/70 px-3 py-1 text-[0.55rem] font-semibold text-slate-800 shadow-sm shadow-slate-200 dark:bg-slate-900/70 dark:text-slate-100 dark:shadow-black/20">
                                                Privasi tetap dijaga
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex h-full flex-col rounded-3xl border border-dashed border-sky-200 bg-sky-50/60 p-4 dark:border-sky-600 dark:bg-sky-900/40">
                                        {previewURL ? (
                                            <div className="relative mb-4 h-56 overflow-hidden rounded-2xl bg-white shadow-inner">
                                                <img src={previewURL} alt="Preview Budaya" className="h-full w-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                                                <p className="text-base font-semibold">Preview akan muncul di sini</p>
                                                <p className="text-center text-xs text-gray-600 dark:text-gray-400">Unggah foto untuk melihat komposisi warna dan suasana secara instan.</p>
                                            </div>
                                        )}
                                        <div className="flex flex-wrap gap-2 text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-200">
                                            <span className="rounded-full bg-white/70 px-3 py-1 shadow-sm dark:bg-white/10">Preview</span>
                                            <span className="rounded-full bg-white/70 px-3 py-1 shadow-sm dark:bg-white/10">{selectedFile ? selectedFile.name : "Belum ada file"}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="space-y-4 bg-white/90 p-0 shadow-xl dark:bg-gray-900/80">
                                <CardHeader className="px-6 pt-6">
                                    <CardTitle>Sesi 2 · Tentukan Aksi</CardTitle>
                                    <CardDescription>Pilih pendekatan visual yang ingin kamu tampilkan dari foto budaya tersebut, mulai dari cerita rakyat hingga arsip digital.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 px-6 pb-6">
                                    <div className="grid gap-3 md:grid-cols-3">
                                        {actionOptions.map((option) => (
                                            <Button key={option.id} variant={selectedAction === option.id ? "default" : "outline"} size="sm" onClick={() => setSelectedAction(option.id)} className="h-full min-h-[110px] flex-col items-start justify-between whitespace-normal">
                                                <span className="text-base font-semibold">{option.title}</span>
                                                <span className="text-muted-foreground text-xs">{option.outcome}</span>
                                            </Button>
                                        ))}
                                    </div>
                                    <div className="rounded-2xl border border-sky-300 bg-sky-100/80 p-4 text-sm text-sky-900 dark:border-sky-700 dark:bg-sky-900/30 dark:text-sky-100">{selectedOption.description}</div>
                                </CardContent>
                                <CardFooter className="flex flex-wrap items-center gap-3 px-6 pb-6">
                                    <Badge variant="default">Dipilih: {selectedOption.title}</Badge>
                                    <Badge variant="outline" className="dark:border-slate-500 dark:text-slate-100">
                                        {selectedOption.palette}
                                    </Badge>
                                    <Button size="sm" variant="ghost" onClick={handleProcessTryOn} disabled={!selectedFile || isProcessing}>
                                        {isProcessing ? "Mendesain ulang..." : "Proses Try-On"}
                                    </Button>
                                    <Button size="sm" variant="secondary">
                                        Simpan Draft
                                    </Button>
                                </CardFooter>
                            </Card>

                            {previewReady ? (
                                <Card className="space-y-4 bg-white/90 p-0 shadow-xl dark:bg-gray-900/80">
                                    <CardHeader className="px-6 pt-6">
                                        <CardTitle>Preview Sementara</CardTitle>
                                        <CardDescription>Lihat bagaimana tampilan hasil coba langsung sebelum dibagikan ke komunitas atau ditampilkan di landing page.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 px-6 pb-6">
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="default">Aksi: {selectedOption.title}</Badge>
                                            <Badge variant="destructive">{selectedAction === "archive" ? "Arsip Prioritas" : "Publik"}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{resultDescription}</p>
                                        <div className="grid gap-3 md:grid-cols-3">
                                            {resultHighlights.map((item) => (
                                                <div key={item.label} className="border-border rounded-2xl border bg-linear-to-br from-white to-sky-50 p-3 text-xs font-semibold text-sky-700 dark:border-gray-700 dark:bg-gray-900/70 dark:text-sky-300">
                                                    <p className="text-[0.65rem] tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">{item.label}</p>
                                                    <p className="mt-1 text-sm font-semibold">{item.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {previewURL && (
                                            <div className="overflow-hidden rounded-2xl border border-sky-200">
                                                <img src={previewURL} alt="Hasil preview" className="h-48 w-full object-cover" />
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="flex flex-wrap gap-3 px-6 pb-6">
                                        <Button variant="secondary" size="sm">
                                            Bagikan ke Komunitas
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            Unduh Mockup
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ) : (
                                <Card className="space-y-4 bg-white/70 p-0 shadow-xl dark:bg-gray-900/60">
                                    <CardHeader className="px-6 pt-6">
                                        <CardTitle>Preview Sementara</CardTitle>
                                        <CardDescription>Tekan tombol “Proses Try-On” supaya hasilnya muncul di kartu ini.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 px-6 pb-6">
                                        <div className="flex flex-col items-center gap-4 text-center">
                                            <div className="h-48 w-full rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-200 via-slate-300 to-white dark:border-slate-600 dark:bg-gradient-to-br dark:from-slate-800 dark:via-slate-900 dark:to-black">
                                                <p className="mt-16 text-sm font-semibold text-slate-500 dark:text-slate-400">Dummy preview akan tampil di sini setelah proses selesai.</p>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-300">Kamu bisa menyesuaikan cadangan data ini sesuai kebutuhan desain ketika tombol “Proses Try-On” ditekan.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
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
