"use client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChannelList from "@/components/ui/channel-list";

export default function SidebarDesktop({ searchQuery, setSearchQuery, currentChannel }: any) {
    return (
        <div>
            <aside className="border-border bg-background text-foreground fixed top-16 bottom-0 left-0 z-20 hidden w-64 border-r transition-colors duration-150 lg:flex dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                <div className="flex h-full w-full flex-col">
                    <div className="border-border bg-background border-b p-4 dark:border-slate-700 dark:bg-slate-900">
                        <Input placeholder="Cari channel..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-9" />
                    </div>
                    <ScrollArea className="h-full flex-1 px-3 py-4">
                        <ChannelList searchQuery={searchQuery} currentChannel={currentChannel} />
                    </ScrollArea>
                </div>
            </aside>

            <div className="hidden w-64 shrink-0 lg:block" />
        </div>
    );
}
