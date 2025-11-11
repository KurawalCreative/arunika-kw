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

    return (
        <div className="flex w-full flex-1 flex-col p-6 lg:pr-82">
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
        </div>
    );
}
