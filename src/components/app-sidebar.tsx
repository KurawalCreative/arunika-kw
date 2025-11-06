"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Menu, Hash } from "lucide-react";

import { getChannels } from "@/app/[locale]/(page)/komunitas/actions";
import { Channel } from "@/generated/prisma/client";

import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const ChannelList = ({
    searchQuery,
    currentChannel,
}: {
    searchQuery: string;
    currentChannel?: string;
}) => {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);

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

    // Filter sesuai pencarian
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

    // Kelompokkan berdasarkan region
    const grouped = filtered.reduce<Record<string, Channel[]>>((acc, ch) => {
        if (!acc[ch.region || "Lainnya"]) acc[ch.region || "Lainnya"] = [];
        acc[ch.region || "Lainnya"].push(ch);
        return acc;
    }, {});

    return (
        <div className="space-y-4">
            {Object.entries(grouped).map(([region, list]) => (
                <div key={region}>
                    <h3 className="text-xs font-semibold uppercase text-muted-foreground px-3 mb-2 tracking-wide">
                        {region}
                    </h3>
                    <div className="space-y-1">
                        {list.map((channel) => {
                            const isActive = currentChannel === channel.slug;
                            return (
                                <Link key={channel.id} href={`/komunitas/${channel.slug}`}>
                                    <div
                                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all ${isActive
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                            }`}
                                    >
                                        <Hash className="h-3.5 w-3.5 shrink-0" />
                                        <span className="truncate">{channel.name}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default function AppSidebar() {
    const [searchQuery, setSearchQuery] = useState("");
    const params = useParams<{ channel: string }>();

    return (
        <>
            {/* 📱 Mobile sidebar */}
            <div className="lg:hidden fixed top-20 left-4 z-40">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="shadow-md">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                        <SheetHeader className="px-4 pt-6 pb-4">
                            <SheetTitle className="text-lg font-semibold">Channels</SheetTitle>
                        </SheetHeader>
                        <div className="px-4 pb-4">
                            <Input
                                placeholder="Cari channel..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-9"
                            />
                        </div>
                        <Separator />
                        <ScrollArea className="h-[calc(100vh-130px)] px-3 py-4">
                            <ChannelList
                                searchQuery={searchQuery}
                                currentChannel={params.channel}
                            />
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </div>

            {/* 💻 Desktop sidebar */}
            <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 border-r border-border bg-background">
                <div className="flex h-full w-full flex-col">
                    <div className="p-4 border-b border-border">
                        <Input
                            placeholder="Cari channel..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9"
                        />
                    </div>
                    <ScrollArea className="flex-1 px-3 py-4 h-full">
                        <ChannelList
                            searchQuery={searchQuery}
                            currentChannel={params.channel}
                        />
                    </ScrollArea>
                </div>
            </aside>

            {/* Spacer agar konten utama tidak tertutup sidebar */}
            <div className="hidden lg:block w-64 shrink-0" />
        </>
    );
}
