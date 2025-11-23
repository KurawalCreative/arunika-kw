"use client";

import Link from "next/link";

export default function TentangPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-24">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tentang Adatry</h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Cerita singkat tentang tujuan proyek.</p>
            </header>

            <section className="space-y-6 rounded-2xl bg-white/80 p-6 dark:bg-gray-900/80">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Misi</h2>
                <p className="text-sm text-slate-700 dark:text-slate-300">Adatry berfokus pada dokumentasi dan penayangan kebudayaan Nusantara dengan cara yang mudah diakses, interaktif, dan ramah komunitas. Fitur "Try-On" membantu pengguna melihat bagaimana visual dapat disesuaikan dengan estetika daerah tertentu.</p>
            </section>
        </div>
    );
}
