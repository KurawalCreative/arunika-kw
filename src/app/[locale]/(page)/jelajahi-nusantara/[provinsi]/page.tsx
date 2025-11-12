"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import test from '@/assets/svg/map.svg'
import logotari from '@/assets/images/logotari.png'
import logomusik from '@/assets/images/logomusik.png'
import logokerajinan from '@/assets/images/logokerajinan.png'
import provinsi from '@/assets/images/pin-map3.jpg'
import hi from '@/assets/images/rani.png'
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef, useState } from "react";
import QuizSection from "@/components/quiz/QuizSection";

export default function page() {
    const params = useParams<{ provinsi: string }>();
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedLanguage, setSelectedLanguage] = useState(0);
    const [selectedKuliner, setSelectedKuliner] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const { scrollY } = useScroll({
        target: containerRef,
        offset: ["start start", "end center"]
    });

    const imageY = useTransform(scrollY, [0, 500], [0, -150]);
    const textY = useTransform(scrollY, [0, 500], [0, -100]);

    const provinceData = {
        name: "Papua Barat Daya",
        description:
            "Papua Barat Daya adalah provinsi termuda di Indonesia bagian timur, resmi dibentuk pada 2022 dengan Sorong sebagai ibu kotanya. Terletak di ujung barat Pulau Papua, provinsi ini menghadap ke Selat Dampier dan Laut Maluku, menjadikannya gerbang maritim penting. Masyarakatnya terdiri atas suku Biak, Arfak, dan Maibrat yang mempertahankan tradisi tari perang, musik tifa, dan arsitektur rumah panggung. Keindahan alamnya mencakup Pegunungan Arfak, Danau Anggi yang mistis, serta pulau-pulau tropis yang masih alami.",
    };

    return (
        <div ref={containerRef} className="relative">
            {/* Hero Section with Parallax Background */}
            <div className="w-full h-128 sticky top-0 overflow-hidden">
                <motion.div
                    className="w-full h-full relative"
                    style={{ y: imageY }}
                >
                    <Image
                        src={test}
                        alt="Cultural Heritage"
                        fill
                        sizes="100vw"
                        className="object-cover blur-[2px]"
                        priority
                    />
                </motion.div>
                {/* <div className="absolute inset-0 bg-black/40"></div> */}

                {/* Content over Parallax Background */}
                <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center px-6"
                    style={{ y: textY }}
                >
                    <div className="flex justify-center items-center gap-4">
                        <motion.div
                            className="grid grid-cols-2 items-center gap-4"
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="grid grid-cols-1 gap-4">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    whileHover={{ scale: 1.05, rotate: 2 }}
                                >
                                    <Image
                                        src={provinsi}
                                        alt="biji"
                                        height={200}
                                        width={200}
                                        className="object-contain rounded-lg"
                                    />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    whileHover={{ scale: 1.05, rotate: -2 }}
                                >
                                    <Image
                                        src={provinsi}
                                        alt="biji"
                                        height={150}
                                        width={150}
                                        className="object-contain rounded-lg"
                                    />
                                </motion.div>
                            </div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                whileHover={{ scale: 1.05, rotate: 3 }}
                            >
                                <Image
                                    src={provinsi}
                                    alt="biji"
                                    height={150}
                                    width={150}
                                    className="object-contain rounded-lg"
                                />
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="bg-white h-40 w-fit shadow-2xs py-10 px-10 rounded-lg mx-auto relative"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="mr-40">
                                <motion.h1
                                    className="text-xl font-bold"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.5 }}
                                >
                                    Yuk kenalan dengan daerah {params.provinsi?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || ''}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.7 }}
                                    className="mt-4"
                                >
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum, aliquam.
                                </motion.p>
                            </div>

                            <Image
                                src={hi}
                                alt="biji"
                                height={200}
                                width={200}
                                className="object-contain absolute bottom-0 right-0"
                            />
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-2 items-center gap-4"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                whileHover={{ scale: 1.05, rotate: -3 }}
                            >
                                <Image
                                    src={provinsi}
                                    alt="biji"
                                    height={150}
                                    width={150}
                                    className="object-contain rounded-lg"
                                />
                            </motion.div>
                            <div className="grid grid-cols-1 gap-4 ">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    whileHover={{ scale: 1.05, rotate: -2 }}
                                >
                                    <Image
                                        src={provinsi}
                                        alt="biji"
                                        height={200}
                                        width={200}
                                        className="object-contain rounded-lg"
                                    />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    whileHover={{ scale: 1.05, rotate: 2 }}
                                >
                                    <Image
                                        src={provinsi}
                                        alt="biji"
                                        height={150}
                                        width={150}
                                        className="object-contain rounded-lg "
                                    />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Stats Section with Parallax Scroll */}

            <div className="relative bg-white">
                <motion.div
                    className="flex gap-6 justify-center px-6 flex-wrap"
                    style={{ y: useTransform(scrollY, [500, 1000], [-50, 0]) }}
                >
                    {[
                        { image: logotari, title: 'Seni Pertunjukan', desc: 'Wayang, Tari Tradisional, Teater' },
                        { image: logomusik, title: 'Musik Tradisional', desc: 'Gamelan, Angklung, Orkes Dangdut' },
                        { image: logokerajinan, title: 'Kerajinan & Seni', desc: 'Batik, Ukiran, Keramik Tradisional' }
                    ].map((item, index) => (
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
                            <h2 className="text-2xl font-bold text-orange-600 mb-2">{item.title}</h2>
                            <p className="text-sm text-gray-700">{item.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Tabs Section */}
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

                        {/* Tabs Content */}
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className=""
                        >
                            {activeTab === 0 ? (
                                <div className="py-16 px-6">
                                    <motion.div
                                        className="max-w-6xl mx-auto"
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8 }}
                                    >

                                        <div className="relative">
                                            {/* Main Language Card */}
                                            <motion.div
                                                className="bg-white rounded-3xl p-8 mb-8 text-gray-800 border border-gray-200  relative overflow-hidden"
                                                whileHover={{ scale: 1.02 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="relative z-10">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div>
                                                            <h3 className="text-3xl font-bold mb-2 text-orange-600">Bahasa Jawa</h3>
                                                            <p className="text-gray-600">Bahasa utama yang digunakan</p>
                                                        </div>
                                                        <div className="text-6xl opacity-20">🗣️</div>
                                                    </div>
                                                    <div className="flex gap-6">
                                                        <div id="listBahasa" className="flex-1 grid grid-cols-1 gap-6">
                                                            {[
                                                                {
                                                                    title: "Ragam Ngoko",
                                                                    description: "Digunakan dalam percakapan sehari-hari",
                                                                    detail: "Ragam bahasa Jawa yang digunakan dalam situasi informal, biasanya antara teman sebaya atau orang yang sudah akrab. Contoh: 'Kowe arep menyang endi?' (Kamu mau pergi kemana?)"
                                                                },
                                                                {
                                                                    title: "Ragam Krama",
                                                                    description: "Digunakan untuk menghormati lawan bicara",
                                                                    detail: "Ragam bahasa Jawa yang digunakan untuk berbicara dengan orang yang lebih tua atau dihormati. Menunjukkan kesopanan dan tata krama. Contoh: 'Panjenengan badhe tindak pundi?' (Anda mau pergi kemana?)"
                                                                },
                                                                {
                                                                    title: "Ragam Krama Inggil",
                                                                    description: "Tingkat paling halus dan formal",
                                                                    detail: "Ragam bahasa Jawa paling halus dan formal, digunakan dalam situasi yang sangat resmi atau ketika berbicara dengan bangsawan. Mencerminkan tingkat penghormatan yang sangat tinggi."
                                                                }
                                                            ].map((item, index) => (
                                                                <motion.div
                                                                    key={index}
                                                                    className={`bg-gray-50 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:bg-gray-100 border ${selectedLanguage === index ? 'ring-2 ring-orange-400 bg-orange-50' : ''}`}
                                                                    onClick={() => setSelectedLanguage(index)}
                                                                    whileHover={{ scale: 1.02 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                >
                                                                    <h4 className="font-semibold mb-2 text-orange-600">{item.title}</h4>
                                                                    <p className="text-sm text-gray-600">{item.description}</p>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                        <div id="penjelasan" className="flex-1 bg-gray-50 text-gray-700 rounded-xl p-4 border">
                                                            <motion.div
                                                                key={selectedLanguage}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                <h4 className="font-semibold mb-3 text-lg text-orange-600">
                                                                    {[
                                                                        { title: "Ragam Ngoko", description: "Digunakan dalam percakapan sehari-hari", detail: "Ragam bahasa Jawa yang digunakan dalam situasi informal, biasanya antara teman sebaya atau orang yang sudah akrab. Contoh: 'Kowe arep menyang endi?' (Kamu mau pergi kemana?)" },
                                                                        { title: "Ragam Krama", description: "Digunakan untuk menghormati lawan bicara", detail: "Ragam bahasa Jawa yang digunakan untuk berbicara dengan orang yang lebih tua atau dihormati. Menunjukkan kesopanan dan tata krama. Contoh: 'Panjenengan badhe tindak pundi?' (Anda mau pergi kemana?)" },
                                                                        { title: "Ragam Krama Inggil", description: "Tingkat paling halus dan formal", detail: "Ragam bahasa Jawa paling halus dan formal, digunakan dalam situasi yang sangat resmi atau ketika berbicara dengan bangsawan. Mencerminkan tingkat penghormatan yang sangat tinggi." }
                                                                    ][selectedLanguage].title
                                                                    }
                                                                </h4>
                                                                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                                                    {[
                                                                        { title: "Ragam Ngoko", description: "Digunakan dalam percakapan sehari-hari", detail: "Ragam bahasa Jawa yang digunakan dalam situasi informal, biasanya antara teman sebaya atau orang yang sudah akrab. Contoh: 'Kowe arep menyang endi?' (Kamu mau pergi kemana?)" },
                                                                        { title: "Ragam Krama", description: "Digunakan untuk menghormati lawan bicara", detail: "Ragam bahasa Jawa yang digunakan untuk berbicara dengan orang yang lebih tua atau dihormati. Menunjukkan kesopanan dan tata krama. Contoh: 'Panjenengan badhe tindak pundi?' (Anda mau pergi kemana?)" },
                                                                        { title: "Ragam Krama Inggil", description: "Tingkat paling halus dan formal", detail: "Ragam bahasa Jawa paling halus dan formal, digunakan dalam situasi yang sangat resmi atau ketika berbicara dengan bangsawan. Mencerminkan tingkat penghormatan yang sangat tinggi." }
                                                                    ][selectedLanguage].detail
                                                                    }
                                                                </p>

                                                                {/* Audio Player */}
                                                                <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                                                                    <div className="flex items-center gap-3">
                                                                        <button className="flex items-center justify-center w-10 h-10 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
                                                                            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                                                <path d="M8 5v14l11-7z" />
                                                                            </svg>
                                                                        </button>
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                                                                <span>Contoh Pengucapan</span>
                                                                                <span>•</span>
                                                                                <span>0:03</span>
                                                                            </div>
                                                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                                                <div className="bg-orange-500 h-1.5 rounded-full w-0" style={{ width: '0%' }}></div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-xs text-gray-400">
                                                                            🔊
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="absolute top-0 right-0 w-64 h-64 bg-gray-100/50 rounded-full -translate-y-32 translate-x-32"></div>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </div>
                            ) : (
                                <div className="py-16 px-6">
                                    <motion.div
                                        className="max-w-6xl mx-auto"
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8 }}
                                    >

                                        <div className="relative">
                                            {/* Main Culinary Card */}
                                            <motion.div
                                                className="bg-white rounded-3xl p-8 mb-8 text-gray-800 border border-gray-200 shadow-lg relative overflow-hidden"
                                                whileHover={{ scale: 1.02 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="relative z-10">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div>
                                                            <h3 className="text-3xl font-bold mb-2 text-orange-600">Makanan Khas</h3>
                                                            <p className="text-gray-600">Hidangan tradisional yang terkenal</p>
                                                        </div>
                                                        <div className="text-6xl opacity-20">🍜</div>
                                                    </div>
                                                    <div className="flex gap-6">
                                                        <div id="listKuliner" className="flex-1 grid grid-cols-1 gap-6">
                                                            {[
                                                                {
                                                                    title: "Gudeg",
                                                                    description: "Makanan manis dari nangka muda",
                                                                    detail: "Gudeg adalah makanan khas Yogyakarta yang terbuat dari nangka muda yang dimasak dengan santan dan gula merah. Disajikan dengan nasi, ayam kampung, telur, krecek, dan sambal krecek. Memiliki rasa manis gurih yang khas dan proses memasaknya membutuhkan waktu berjam-jam."
                                                                },
                                                                {
                                                                    title: "Soto",
                                                                    description: "Sup tradisional dengan kuah bening",
                                                                    detail: "Soto adalah sup tradisional Indonesia dengan berbagai variasi. Di Jawa Tengah, terdapat Soto Kudus dan Soto Semarang yang terkenal. Berisi daging ayam atau sapi, dengan kuah kaldu yang kaya rempah, dilengkapi dengan tauge, bihun, dan perasan jeruk nipis."
                                                                },
                                                                {
                                                                    title: "Nasi Liwet",
                                                                    description: "Nasi gurih dengan lauk tradisional",
                                                                    detail: "Nasi liwet adalah nasi yang dimasak dengan santan dan rempah-rempah, menghasilkan cita rasa gurih yang khas. Biasanya disajikan dengan ayam suwir, telur pindang, areh (santan kental), dan sambal. Hidangan ini sering disajikan dalam acara-acara tradisional."
                                                                }
                                                            ].map((item, index) => (
                                                                <motion.div
                                                                    key={index}
                                                                    className={`bg-gray-50 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:bg-gray-100 border ${selectedKuliner === index ? 'ring-2 ring-orange-400 bg-orange-50' : ''}`}
                                                                    onClick={() => setSelectedKuliner(index)}
                                                                    whileHover={{ scale: 1.02 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                >
                                                                    <h4 className="font-semibold mb-2 text-orange-600">{item.title}</h4>
                                                                    <p className="text-sm text-gray-600">{item.description}</p>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                        <div id="penjelasanKuliner" className="flex-1 bg-gray-50 text-gray-700 rounded-xl p-4 border">
                                                            <motion.div
                                                                key={selectedKuliner}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                <h4 className="font-semibold mb-3 text-lg text-orange-600">
                                                                    {[
                                                                        { title: "Gudeg", description: "Makanan manis dari nangka muda", detail: "Gudeg adalah makanan khas Yogyakarta yang terbuat dari nangka muda yang dimasak dengan santan dan gula merah. Disajikan dengan nasi, ayam kampung, telur, krecek, dan sambal krecek. Memiliki rasa manis gurih yang khas dan proses memasaknya membutuhkan waktu berjam-jam." },
                                                                        { title: "Soto", description: "Sup tradisional dengan kuah bening", detail: "Soto adalah sup tradisional Indonesia dengan berbagai variasi. Di Jawa Tengah, terdapat Soto Kudus dan Soto Semarang yang terkenal. Berisi daging ayam atau sapi, dengan kuah kaldu yang kaya rempah, dilengkapi dengan tauge, bihun, dan perasan jeruk nipis." },
                                                                        { title: "Nasi Liwet", description: "Nasi gurih dengan lauk tradisional", detail: "Nasi liwet adalah nasi yang dimasak dengan santan dan rempah-rempah, menghasilkan cita rasa gurih yang khas. Biasanya disajikan dengan ayam suwir, telur pindang, areh (santan kental), dan sambal. Hidangan ini sering disajikan dalam acara-acara tradisional." }
                                                                    ][selectedKuliner].title
                                                                    }
                                                                </h4>
                                                                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                                                    {[
                                                                        { title: "Gudeg", description: "Makanan manis dari nangka muda", detail: "Gudeg adalah makanan khas Yogyakarta yang terbuat dari nangka muda yang dimasak dengan santan dan gula merah. Disajikan dengan nasi, ayam kampung, telur, krecek, dan sambal krecek. Memiliki rasa manis gurih yang khas dan proses memasaknya membutuhkan waktu berjam-jam." },
                                                                        { title: "Soto", description: "Sup tradisional dengan kuah bening", detail: "Soto adalah sup tradisional Indonesia dengan berbagai variasi. Di Jawa Tengah, terdapat Soto Kudus dan Soto Semarang yang terkenal. Berisi daging ayam atau sapi, dengan kuah kaldu yang kaya rempah, dilengkapi dengan tauge, bihun, dan perasan jeruk nipis." },
                                                                        { title: "Nasi Liwet", description: "Nasi gurih dengan lauk tradisional", detail: "Nasi liwet adalah nasi yang dimasak dengan santan dan rempah-rempah, menghasilkan cita rasa gurih yang khas. Biasanya disajikan dengan ayam suwir, telur pindang, areh (santan kental), dan sambal. Hidangan ini sering disajikan dalam acara-acara tradisional." }
                                                                    ][selectedKuliner].detail
                                                                    }
                                                                </p>

                                                                {/* Recipe Info */}
                                                                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                                                    <div className="space-y-3">
                                                                        <div className="flex items-start gap-3">
                                                                            <span className="text-2xl">👨‍🍳</span>
                                                                            <div>
                                                                                <p className="font-medium text-gray-700 text-sm">Bahan Utama</p>
                                                                                <p className="text-xs text-gray-500 mt-1">Nangka muda, santan, gula merah, rempah-rempah</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-start gap-3">
                                                                            <span className="text-2xl">⏱️</span>
                                                                            <div>
                                                                                <p className="font-medium text-gray-700 text-sm">Waktu Memasak</p>
                                                                                <p className="text-xs text-gray-500 mt-1">6-8 jam untuk hasil terbaik</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-start gap-3">
                                                                            <span className="text-2xl">🌶️</span>
                                                                            <div>
                                                                                <p className="font-medium text-gray-700 text-sm">Tingkat Kepedasan</p>
                                                                                <p className="text-xs text-gray-500 mt-1">Sedang (dapat disesuaikan)</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/50 rounded-full -translate-y-32 translate-x-32"></div>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </motion.div>

                    </motion.div>
                </div>
                {/* Kuliner Section */}

                {/* Video Section */}
                <div className="py-20 px-6 bg-linear-to-b from-orange-50 to-white">
                    <motion.div
                        className="max-w-5xl mx-auto"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="text-center mb-16">
                            <motion.h2
                                className="text-4xl font-bold text-gray-800 mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                📖 Cerita Rakyat & Budaya
                            </motion.h2>
                            <motion.p
                                className="text-lg text-gray-600 max-w-3xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                Saksikan dokumentasi menarik tentang kekayaan cerita rakyat dan warisan budaya daerah yang dipenuhi dengan nilai-nilai tradisional dan kebijaksanaan leluhur
                            </motion.p>
                        </div>

                        <motion.div
                            className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-orange-100"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                        >
                            {/* Video Container */}
                            <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full"
                                    src="https://www.youtube.com/embed/SQ1DCsHBnU8?si=Ffz_dfZHYu0wjsdP"
                                    title="Cerita Rakyat dan Budaya"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            </div>

                            {/* Card Info */}
                            <div className="p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                            Petualangan Timun Mas: Legenda Perlindungan dan Keberanian
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            Dokumentasi cerita rakyat klasik yang mengajarkan tentang keberanian, kecerdikan, dan bagaimana menghadapi tantangan dengan bijak. Sebuah narasi yang telah diturunkan turun-temurun dari generasi ke generasi.
                                        </p>
                                    </div>
                                    <motion.div
                                        className="ml-4 text-5xl"
                                        animate={{ rotate: [0, 5, -5, 0] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        🎬
                                    </motion.div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
                                    <motion.div
                                        className="text-center"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <p className="text-2xl font-bold text-orange-500">12:45</p>
                                        <p className="text-sm text-gray-600">Durasi Video</p>
                                    </motion.div>
                                    <motion.div
                                        className="text-center"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <p className="text-2xl font-bold text-orange-500">⭐ 4.8</p>
                                        <p className="text-sm text-gray-600">Rating</p>
                                    </motion.div>
                                    <motion.div
                                        className="text-center"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <p className="text-2xl font-bold text-orange-500">125K+</p>
                                        <p className="text-sm text-gray-600">Views</p>
                                    </motion.div>
                                    <motion.div
                                        className="text-center"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <p className="text-2xl font-bold text-orange-500">2024</p>
                                        <p className="text-sm text-gray-600">Tahun Produksi</p>
                                    </motion.div>
                                </div>

                                {/* Tags */}
                                <div className="mb-6">
                                    <p className="text-sm font-semibold text-gray-700 mb-3">Kategori & Genre:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Cerita Rakyat', 'Dokumenter', 'Budaya Indonesia', 'Pendidikan', 'Keluarga'].map((tag, index) => (
                                            <motion.span
                                                key={index}
                                                className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-200 cursor-pointer"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                #{tag}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <motion.button
                                        className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                        </svg>
                                        Tandai Favorit
                                    </motion.button>
                                    <motion.button
                                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                                        </svg>
                                        Bagikan
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Related Info */}
                        <motion.div
                            className="mt-12 grid md:grid-cols-2 gap-6"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            {/* AI Story Companion */}
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <span>🤖</span> AI Story Companion
                                </h4>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                    "Halo! Saya adalah pendamping cerita Anda. Mari kita jelajahi kisah Timun Mas bersama-sama. Apakah Anda ingin tahu lebih banyak tentang karakter utama, latar belakang budaya, atau pesan moral dari cerita ini?"
                                </p>
                                <motion.button
                                    className="w-full bg-purple-500 text-white py-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Tanya AI
                                </motion.button>
                            </div>

                            {/* Ringkasan & Badge */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <span>📋</span> Ringkasan & Achievement
                                </h4>
                                <p className="text-gray-600 text-xs leading-relaxed mb-4">
                                    Cerita Timun Mas mengajarkan keberanian, kecerdikan, dan cara menghadapi tantangan. Raih badge dengan menyelesaikan kuis!
                                </p>
                                <div className="flex gap-2">
                                    <motion.div
                                        className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl shadow-md"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        🏆
                                    </motion.div>
                                    <motion.div
                                        className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl opacity-50"
                                        title="Kunci: Selesaikan kuis"
                                    >
                                        🔒
                                    </motion.div>
                                    <motion.div
                                        className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl opacity-50"
                                        title="Kunci: Cari semua cerita"
                                    >
                                        🔒
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
                {/* QUiz Section */}
                <QuizSection
                    province={provinceData.name}
                    description={provinceData.description}
                />
                <div className="mb-20"></div>

            </div>
        </div>
    );
}

