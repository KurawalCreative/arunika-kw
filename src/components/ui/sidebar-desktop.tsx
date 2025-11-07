"use client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChannelList from "@/components/ui/channel-list";

export default function SidebarDesktop({ searchQuery, setSearchQuery, currentChannel }: any) {
    return (
        <div>
            <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 border-r border-border bg-background z-20">
                <div className="flex h-full w-full flex-col">
                    <div className="p-4 border-b border-border bg-background">
                        <Input
                            placeholder="Cari channel..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9"
                        />
                    </div>
                    <ScrollArea className="flex-1 px-3 py-4 h-full">
                        <ChannelList searchQuery={searchQuery} currentChannel={currentChannel} />
                    </ScrollArea>
                </div>
            </aside>

            <div className="hidden lg:block w-64 shrink-0" />
        </div>
    );
}
