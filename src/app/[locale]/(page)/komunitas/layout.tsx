"use client";

import { ReactNode, useEffect, useState } from "react";
import { getChannels } from "./actions";
import { Channel } from "@/generated/prisma/client";
import { Link } from "@/i18n/navigation";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Loader2, Hash, Search } from "lucide-react";
import AppSidebar from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function KomunitasLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-white transition-colors dark:bg-slate-950">
            <div className="flex flex-col lg:flex-row pt-16">
                <AppSidebar />
                <main className="flex-1">
                    <div className="w-full px-4 sm:px-6 lg:px-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
