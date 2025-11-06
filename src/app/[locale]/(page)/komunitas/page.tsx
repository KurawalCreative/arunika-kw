"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, Loader2, Hash, ArrowRight, MessageSquare, Users, Zap } from "lucide-react";
import { getChannels } from "./actions";
import { Channel } from "@/generated/prisma/client";
import { Link } from "@/i18n/navigation";

export default function page() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getChannels().then((data) => {
            setChannels(data);
            setLoading(false);
        });
    }, []);

    if (status === "loading" || loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-950">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="text-gray-600 dark:text-slate-400">Memuat...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-white transition-colors dark:bg-slate-950">
                {/* Header */}
                <div className="sticky top-0 z-50 border-b border-gray-200 bg-white/50 backdrop-blur-sm transition-colors dark:border-slate-800 dark:bg-slate-950/50">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                <Hash className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Arunika</span>
                        </div>
                        <Button onClick={() => router.push("/api/auth/signin")} className="bg-blue-600 text-white hover:bg-blue-700">
                            <LogIn className="mr-2 h-4 w-4" />
                            Masuk
                        </Button>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="mx-auto max-w-6xl px-6 py-24">
                    <div className="mb-20">
                        <div className="mb-6">
                            <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Bergabunglah dengan komunitas</span>
                        </div>
                        <h1 className="mb-6 text-5xl leading-tight font-bold text-gray-900 lg:text-6xl dark:text-white">Terhubung, Berbagi, dan Berkembang</h1>
                        <p className="mb-10 max-w-2xl text-xl text-gray-600 dark:text-gray-400">Komunitas Arunika adalah tempat terbaik untuk berbagi pengetahuan, pengalaman, dan terhubung dengan ribuan profesional lainnya.</p>
                        <Button size="lg" onClick={() => router.push("/api/auth/signin")} className="h-12 bg-blue-600 px-8 text-base text-white hover:bg-blue-700">
                            Mulai Sekarang
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>

                    {/* Features Grid */}
                    <div className="mb-20 grid gap-6 md:grid-cols-3">
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 transition-all hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-blue-700 dark:hover:shadow-none">
                            <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3 dark:bg-blue-900/50">
                                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Komunitas Aktif</h3>
                            <p className="text-gray-600 dark:text-gray-400">Bergabunglah dengan ribuan anggota yang saling mendukung dan berbagi pengetahuan</p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 transition-all hover:border-purple-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-purple-700 dark:hover:shadow-none">
                            <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-3 dark:bg-purple-900/50">
                                <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Diskusi Interaktif</h3>
                            <p className="text-gray-600 dark:text-gray-400">Bagikan ide, ajukan pertanyaan, dan dapatkan feedback dari komunitas</p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 transition-all hover:border-green-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-green-700 dark:hover:shadow-none">
                            <div className="mb-4 inline-flex rounded-lg bg-green-100 p-3 dark:bg-green-900/50">
                                <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Berkembang Bersama</h3>
                            <p className="text-gray-600 dark:text-gray-400">Pelajari hal baru dan tingkatkan skill Anda bersama anggota lainnya</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid gap-6 border-t border-gray-200 py-12 md:grid-cols-4 dark:border-slate-800">
                        <div className="text-center">
                            <div className="mb-3 text-4xl font-bold text-blue-600 dark:text-blue-400">{channels.length}+</div>
                            <p className="text-gray-600 dark:text-gray-400">Channel Topik</p>
                        </div>
                        <div className="text-center">
                            <div className="mb-3 text-4xl font-bold text-purple-600 dark:text-purple-400">1000+</div>
                            <p className="text-gray-600 dark:text-gray-400">Anggota Aktif</p>
                        </div>
                        <div className="text-center">
                            <div className="mb-3 text-4xl font-bold text-green-600 dark:text-green-400">5000+</div>
                            <p className="text-gray-600 dark:text-gray-400">Diskusi</p>
                        </div>
                        <div className="text-center">
                            <div className="mb-3 text-4xl font-bold text-orange-600 dark:text-orange-400">24/7</div>
                            <p className="text-gray-600 dark:text-gray-400">Tersedia</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white transition-colors dark:bg-slate-950">
            {/* Header */}

            {/* Main Content */}
            <div className="mx-auto max-w-6xl px-6 py-20">
                {/* Section Header */}
                <div className="mb-12">
                    <h1 className="mb-3 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">Jelajahi Channel Komunitas</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">Pilih topik yang Anda minati dan mulai berdiskusi dengan komunitas</p>
                </div>

                {/* Channels Grid */}
                {channels.length === 0 ? (
                    <div className="py-16 text-center">
                        <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-slate-600" />
                        <p className="text-lg text-gray-600 dark:text-gray-400">Belum ada channel tersedia</p>
                    </div>
                ) : (
                    <div className="mb-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {channels.map((channel) => (
                            <Link key={channel.id} href={`/komunitas/${channel.slug}`}>
                                <div className="group h-full cursor-pointer rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-blue-700 dark:hover:shadow-none">
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-200 dark:bg-blue-900/50 dark:group-hover:bg-blue-900">
                                            <Hash className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <ArrowRight className="h-5 w-5 transform text-gray-400 transition-colors group-hover:translate-x-1 group-hover:text-blue-600 dark:text-slate-600 dark:group-hover:text-blue-400" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">{channel.name}</h3>
                                    <p className="mb-4 line-clamp-2 text-gray-600 dark:text-gray-400">{channel.description || "Channel diskusi komunitas"}</p>
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-slate-800">
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Buka Channel</span>
                                        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Aktif</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Stats Section */}
                {channels.length > 0 && (
                    <div className="border-t border-gray-200 py-12 dark:border-slate-800">
                        <div className="grid gap-6 md:grid-cols-4">
                            <div className="text-center">
                                <div className="mb-3 text-4xl font-bold text-blue-600 dark:text-blue-400">{channels.length}</div>
                                <p className="text-gray-600 dark:text-gray-400">Channel Aktif</p>
                            </div>
                            <div className="text-center">
                                <div className="mb-3 text-4xl font-bold text-purple-600 dark:text-purple-400">1K+</div>
                                <p className="text-gray-600 dark:text-gray-400">Member</p>
                            </div>
                            <div className="text-center">
                                <div className="mb-3 text-4xl font-bold text-green-600 dark:text-green-400">5K+</div>
                                <p className="text-gray-600 dark:text-gray-400">Diskusi</p>
                            </div>
                            <div className="text-center">
                                <div className="mb-3 text-4xl font-bold text-orange-600 dark:text-orange-400">∞</div>
                                <p className="text-gray-600 dark:text-gray-400">Pembelajaran</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
