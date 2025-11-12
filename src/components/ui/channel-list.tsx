import { getChannels } from "@/app/[locale]/(page)/komunitas/actions";
import { ChevronDown, ChevronRight, Hash } from "lucide-react";
import { Channel } from "@/generated/prisma/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SidebarGroupLabel } from "./sidebar";

const ChannelList = ({
    searchQuery,
    currentChannel,
}: {
    searchQuery: string;
    currentChannel?: string;
}) => {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);
    const [openRegions, setOpenRegions] = useState<Record<string, boolean>>({});

    useEffect(() => {
        getChannels().then((data) => {
            setChannels(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                Memuat channel...
            </div>
        );
    }

    // Filter sesuai search query
    const filtered = channels.filter((c) =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filtered.length === 0) {
        return (
            <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                Tidak ada channel ditemukan
            </div>
        );
    }

    // Pisahkan channel berdasarkan ada/tidaknya region
    const channelsWithRegion = filtered.filter(
        (ch): ch is Channel & { region: string } => !!ch.region
    );
    const channelsWithoutRegion = filtered.filter((ch) => !ch.region);

    // Group yang punya region
    const grouped = channelsWithRegion.reduce<Record<string, Channel[]>>(
        (acc, ch) => {
            const region = ch.region;
            if (!acc[region]) acc[region] = [];
            acc[region].push(ch);
            return acc;
        },
        {}
    );

    const toggleRegion = (region: string) => {
        setOpenRegions((prev) => ({
            ...prev,
            [region]: !prev[region],
        }));
    };

    return (
        <div className="space-y-2">
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            {channelsWithoutRegion.map((channel) => {
                const isActive = currentChannel === channel.slug;
                return (
                    <Link key={channel.id} href={`/komunitas/${channel.slug}`}>
                        <div className={`flex items-center gap-3 rounded-md px-3 py-1.5 text-sm transition-all ${isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            }`}>
                            <Hash className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate w-40">{channel.name}</span>
                        </div>
                    </Link>
                );
            })}

            {/* Channels dengan region (grouped) */}
            <SidebarGroupLabel>Channels</SidebarGroupLabel>
            {Object.entries(grouped).map(([region, list]) => {
                const isOpen = openRegions[region] ?? false;
                return (
                    <div key={region} className="rounded-md">
                        <button
                            onClick={() => toggleRegion(region)}
                            className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold text-font-secondary hover:text-font-primary transition-colors"
                        >
                            <span className="uppercase tracking-wide text-xs font-medium">{region}</span>
                            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>

                        {isOpen && (
                            <div className="mt-1 space-y-1 pl-4 border-l border-border/40">
                                {list.map((channel) => {
                                    const isActive = currentChannel === channel.slug;
                                    return (
                                        <Link key={channel.id} href={`/komunitas/${channel.slug}`}>
                                            <div className={`flex items-center gap-3 rounded-md px-3 py-1.5 text-sm transition-all ${isActive
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                }`}>
                                                <Hash className="h-3.5 w-3.5 shrink-0" />
                                                <span className="truncate w-40">{channel.name}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ChannelList;
