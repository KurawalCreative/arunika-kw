"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, MessageCircle, Zap, LogIn, ChevronRight, Hash } from "lucide-react";
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
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="text-slate-300">Memuat...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {/* Header */}
                <div className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                                <Hash className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">Arunika</span>
                        </div>
                        <Button onClick={() => router.push("/api/auth/signin")} className="bg-blue-600 hover:bg-blue-700">
                            <LogIn className="mr-2 h-4 w-4" />
                            Masuk
                        </Button>
                    </div>
                </div>

                {/* Hero */}
                <div className="mx-auto max-w-7xl px-6 py-20">
                    <div className="mb-16 text-center">
                        <div className="mb-4 inline-block">
                            <Badge className="border-blue-500/30 bg-blue-500/20 px-4 py-1.5 text-blue-300">Bergabunglah dengan komunitas</Badge>
                        </div>
                        <h1 className="mb-6 text-5xl leading-tight font-bold text-white">
                            Terhubung, Berbagi,
                            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">dan Berkembang Bersama</span>
                        </h1>
                        <p className="mx-auto mb-8 max-w-2xl text-xl text-slate-300">Bergabunglah dengan ribuan anggota komunitas yang saling berbagi pengetahuan dan pengalaman</p>
                        <Button size="lg" onClick={() => router.push("/api/auth/signin")} className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 px-8 hover:from-blue-700 hover:to-purple-700">
                            Mulai Sekarang
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    {/* Features */}
                    <div className="mb-20 grid gap-6 md:grid-cols-3">
                        <Card className="border-slate-700 bg-slate-800/50 transition-colors hover:border-blue-500/50">
                            <CardHeader>
                                <Users className="mb-2 h-8 w-8 text-blue-400" />
                                <CardTitle className="text-white">Komunitas Aktif</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-300">Terhubung dengan ribuan pengguna yang berpikiran sama</p>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-700 bg-slate-800/50 transition-colors hover:border-purple-500/50">
                            <CardHeader>
                                <MessageCircle className="mb-2 h-8 w-8 text-purple-400" />
                                <CardTitle className="text-white">Diskusi Interaktif</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-300">Bagikan ide dan dapatkan feedback dari komunitas</p>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-700 bg-slate-800/50 transition-colors hover:border-pink-500/50">
                            <CardHeader>
                                <Zap className="mb-2 h-8 w-8 text-pink-400" />
                                <CardTitle className="text-white">Berkembang Bersama</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-300">Pelajari hal baru dari anggota komunitas lainnya</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <div className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                            <Hash className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">Arunika</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={session.user?.image || ""} />
                            <AvatarFallback className="bg-slate-700">{session.user?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-slate-300">{session.user?.name}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-7xl px-6 py-16">
                {/* Section Header */}
                <div className="mb-12">
                    <h1 className="mb-2 text-4xl font-bold text-white">Jelajahi Komunitas</h1>
                    <p className="text-slate-400">Pilih topik yang ingin Anda ikuti dan mulai berbagi</p>
                </div>

                {/* Channels Grid */}
                {channels.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-slate-400">Belum ada channel tersedia</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {channels.map((channel) => (
                            <Link key={channel.id} href={`/komunitas/${channel.slug}`}>
                                <Card className="group h-full cursor-pointer border-slate-700 bg-slate-800/50 transition-all duration-300 hover:border-blue-500/50 hover:bg-slate-800/80">
                                    <CardHeader>
                                        <div className="mb-3 flex items-start justify-between">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 transition-colors group-hover:from-blue-500/30 group-hover:to-purple-600/30">
                                                <Hash className="h-6 w-6 text-blue-400" />
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-slate-600 transition-colors group-hover:text-blue-400" />
                                        </div>
                                        <CardTitle className="text-xl text-white transition-colors group-hover:text-blue-400">{channel.name}</CardTitle>
                                        <CardDescription className="mt-2 text-slate-400">{channel.description || "Channel diskusi komunitas"}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Badge className="border-blue-500/30 bg-blue-500/20 text-blue-300">Bergabunglah</Badge>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Stats */}
                <div className="mt-20 grid gap-6 border-t border-slate-700 pt-12 md:grid-cols-4">
                    <div className="text-center">
                        <div className="mb-2 text-4xl font-bold text-blue-400">{channels.length}</div>
                        <p className="text-slate-400">Channel Aktif</p>
                    </div>
                    <div className="text-center">
                        <div className="mb-2 text-4xl font-bold text-purple-400">1000+</div>
                        <p className="text-slate-400">Anggota</p>
                    </div>
                    <div className="text-center">
                        <div className="mb-2 text-4xl font-bold text-pink-400">5000+</div>
                        <p className="text-slate-400">Postingan</p>
                    </div>
                    <div className="text-center">
                        <div className="mb-2 text-4xl font-bold text-green-400">24/7</div>
                        <p className="text-slate-400">Dukungan</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
