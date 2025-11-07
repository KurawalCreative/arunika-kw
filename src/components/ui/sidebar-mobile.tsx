"use client";

import { Menu } from "lucide-react";
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

import ChannelList from "@/components/ui/channel-list";

export default function SidebarMobile({ searchQuery, setSearchQuery, currentChannel }: any) {
    return (
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
                        <ChannelList searchQuery={searchQuery} currentChannel={currentChannel} />
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>
    );
}
