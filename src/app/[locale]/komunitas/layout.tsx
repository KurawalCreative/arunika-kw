"use client";

import { ReactNode, useEffect, useState } from "react";
import { getChannels } from "./actions";
import { Channel } from "@/generated/prisma/client";
import { Link } from "@/i18n/navigation";
import { useParams, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, LogIn, Loader2, Bell, Hash, Search, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";

export default function KomunitasLayout({ children }: { children: ReactNode }) {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const params = useParams<{ channel: string }>();
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        getChannels().then(setChannels);
    }, []);

    const filteredChannels = channels.filter((c) => c.name?.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="min-h-screen bg-white transition-colors dark:bg-slate-950">
            {/* Top Navbar */}
            <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/50 backdrop-blur-sm transition-colors dark:border-slate-700 dark:bg-slate-900/50">
                <div className="flex items-center justify-between px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-lg p-2 transition-colors hover:bg-gray-100 lg:hidden dark:hover:bg-slate-800">
                            {sidebarOpen ? <X className="h-5 w-5 text-gray-700 dark:text-slate-300" /> : <Menu className="h-5 w-5 text-gray-700 dark:text-slate-300" />}
                        </button>
                        <Link href="/komunitas" className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                                <Hash className="h-5 w-5 text-white" />
                            </div>
                            <span className="hidden text-lg font-bold text-gray-900 sm:inline dark:text-white">Arunika</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <ModeToggle />
                        <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800">
                            <Bell className="h-5 w-5" />
                        </Button>
                        {status === "loading" ? (
                            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                        ) : session ? (
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={session.user?.image || ""} />
                                    <AvatarFallback className="bg-gray-200 text-gray-900 dark:bg-slate-700 dark:text-white">{session.user?.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <Button onClick={() => signOut()} variant="ghost" size="sm" className="hidden text-gray-700 hover:bg-gray-100 sm:flex dark:text-slate-300 dark:hover:bg-slate-800">
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={() => router.push("/api/auth/signin")} size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <LogIn className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Login</span>
                            </Button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row">
                {/* Left Sidebar */}
                <aside className={`fixed inset-y-0 top-14 left-0 z-40 w-64 border-r border-gray-200 bg-white backdrop-blur-sm transition-transform duration-300 lg:sticky lg:top-16 lg:translate-x-0 dark:border-slate-700 dark:bg-slate-900/50 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <div className="flex h-full flex-col">
                        {/* Search */}
                        <div className="border-b border-gray-200 p-4 dark:border-slate-700">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                                <Input placeholder="Cari channel..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500" />
                            </div>
                        </div>

                        {/* Channels List */}
                        <div className="flex-1 space-y-1 overflow-auto p-3">
                            {filteredChannels.length === 0 ? (
                                <p className="p-3 text-sm text-gray-500 dark:text-slate-500">Tidak ada channel</p>
                            ) : (
                                filteredChannels.map((channel) => {
                                    const isActive = params.channel === channel.slug;
                                    return (
                                        <Link key={channel.id} href={`/komunitas/${channel.slug}`} onClick={() => setSidebarOpen(false)}>
                                            <div className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? "border border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"}`}>
                                                <Hash className="h-4 w-4 shrink-0" />
                                                <span className="truncate text-sm font-medium">{channel.name}</span>
                                            </div>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </aside>

                {/* Overlay */}
                {sidebarOpen && <div className="fixed inset-0 top-16 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

                {/* Content Area */}
                <main className="flex-1">
                    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
                </main>

                {/* Right Sidebar - Info (Hidden on smaller screens) */}
                <aside className="hidden w-80 border-l border-gray-200 bg-white p-6 backdrop-blur-sm xl:block dark:border-slate-700 dark:bg-slate-900/50">
                    <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Trending</h3>
                    <div className="space-y-3">
                        <div className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors hover:border-gray-300 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600">
                            <p className="text-sm text-gray-600 dark:text-slate-300">Segera hadir...</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
