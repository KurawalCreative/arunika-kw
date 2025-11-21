"use client";

import { getChannels } from "@/app/(page)/komunitas/actions";
import { ChevronDown, ChevronRight, Hash, Home, Trophy, Loader2 } from "lucide-react";
import { Channel } from "@/generated/prisma/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SidebarGroupLabel } from "./sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const ChannelList = ({ searchQuery, currentChannel }: { searchQuery: string; currentChannel?: string }) => {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);
    const [openRegions, setOpenRegions] = useState<Record<string, boolean>>({});
    const pathname = usePathname();

    useEffect(() => {
        getChannels().then((data) => {
            setChannels(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-6 text-sm text-gray-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memuat channel...
            </div>
        );
    }

    // Filter pencarian
    const filtered = channels.filter((c) => c.name?.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filtered.length === 0) {
        return <div className="flex items-center justify-center py-6 text-sm text-gray-500">Tidak ada channel ditemukan</div>;
    }

    // Group berdasarkan region
    const channelsWithRegion = filtered.filter((ch): ch is Channel & { region: string } => !!ch.region);
    const channelsWithoutRegion = filtered.filter((ch) => !ch.region);
    const grouped = channelsWithRegion.reduce<Record<string, Channel[]>>((acc, ch) => {
        const region = ch.region;
        if (!acc[region]) acc[region] = [];
        acc[region].push(ch);
        return acc;
    }, {});

    const toggleRegion = (region: string) =>
        setOpenRegions((prev) => ({
            ...prev,
            [region]: !prev[region],
        }));

    return (
        <div className="space-y-3">
            <SidebarGroupLabel>MENU</SidebarGroupLabel>

            {/* Menu utama */}
            <div className="space-y-0.5">
                <Link href="/komunitas">
                    <div className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-all duration-200 ${pathname === "/komunitas" ? "text-primary-blue bg-[#E8F7FF] font-medium" : "text-gray-500 hover:bg-[#F5FAFF] hover:text-[#009EE0]"}`}>
                        <Home className="h-4 w-4 shrink-0 opacity-80" />
                        <span className="truncate">Home</span>
                    </div>
                </Link>

                <Link href="/komunitas/leaderboard">
                    <div className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-all duration-200 ${pathname.includes("/komunitas/leaderboard") ? "text-primary-blue bg-[#E8F7FF] font-medium" : "text-gray-500 hover:bg-[#F5FAFF] hover:text-[#009EE0]"}`}>
                        <Trophy className="h-4 w-4 shrink-0 opacity-80" />
                        <span className="truncate">Leaderboard</span>
                    </div>
                </Link>
            </div>

            <SidebarGroupLabel>CHANNELS</SidebarGroupLabel>

            {/* Channel tanpa region */}
            <div className="space-y-0.5">
                {channelsWithoutRegion.map((channel) => {
                    const isActive = currentChannel === channel.slug;
                    return (
                        <Link key={channel.id} href={`/komunitas/${channel.slug}/`}>
                            <div className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-all duration-200 ${isActive ? "text-primary-blue bg-[#E8F7FF] font-medium" : "text-gray-500 hover:bg-[#F5FAFF] hover:text-[#009EE0]"}`}>
                                <Hash className="h-3.5 w-3.5 shrink-0 opacity-80" />
                                <span className="truncate">{channel.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Channel dengan region */}
            <div className="mt-3 space-y-1">
                {Object.entries(grouped).map(([region, list]) => {
                    const isOpen = openRegions[region] ?? false;
                    return (
                        <div key={region} className="rounded-md">
                            {/* Header Region */}
                            <button onClick={() => toggleRegion(region)} className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-[#F5FAFF] hover:text-[#009EE0]">
                                <span>{region}</span>
                                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </button>

                            {/* Channel List (animated) */}
                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeInOut" }} className="mt-1 space-y-0.5 border-l border-gray-200/50 pl-4">
                                        {list.map((channel) => {
                                            const isActive = currentChannel === channel.slug;
                                            return (
                                                <Link key={channel.id} href={`/komunitas/${channel.slug}`}>
                                                    <div className={`flex items-start gap-2 rounded-md px-3 py-1.5 text-sm transition-all duration-200 ${isActive ? "text-primary-blue bg-[#E8F7FF] font-medium" : "text-gray-500 hover:bg-[#F5FAFF] hover:text-[#009EE0]"}`}>
                                                        <Hash className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-80" />
                                                        <span className="leading-snug wrap-break-word">{channel.name}</span>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ChannelList;
