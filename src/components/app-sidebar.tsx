"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import SidebarMobile from "@/components/ui/sidebar-mobile";
import SidebarDesktop from "@/components/ui/sidebar-desktop";

export default function AppSidebar() {
    const [searchQuery, setSearchQuery] = useState("");
    const params = useParams<{ channel: string }>();

    return (
        <>
            <SidebarMobile
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                currentChannel={params.channel}
            />
            <SidebarDesktop
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                currentChannel={params.channel}
            />
        </>
    );
}
