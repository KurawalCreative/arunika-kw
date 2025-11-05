"use client";

import { ReactNode, useState, useEffect } from "react";
import { getChannels } from "./actions";
import { Channel } from "@/generated/prisma/client";
import { Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, Loader2, Bell, Hash, TrendingUp } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function KomunitasLayout({ children }: { children: ReactNode }) {
    const [channels, setChannels] = useState<Channel[]>([]);
    const params = useParams<{ channel: string }>();
    const { data: session, status } = useSession();

    useEffect(() => {
        getChannels().then(setChannels);
    }, []);

    return (
        <div className="flex h-screen flex-col bg-gray-50">
            {/* Navbar */}
            <div className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-white px-6 shadow-sm">
                <div className="flex items-center gap-2">
                    <Hash className="h-6 w-6 text-blue-600" />
                    <span className="text-xl font-bold text-gray-900">Arunika</span>
                </div>

                <div className="flex items-center gap-3">
                    {status === "loading" ? (
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    ) : session ? (
                        <>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                            </Button>
                            <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={session.user?.image || ""} />
                                    <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{session.user?.name}</span>
                            </div>
                            <Button onClick={() => signOut()} size="sm" variant="ghost">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => signIn("google")} size="sm">
                            <LogIn className="mr-2 h-4 w-4" />
                            Login
                        </Button>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-1 pt-16">
                {/* Sidebar Kiri - Channels */}
                <div className="fixed top-16 left-0 flex h-[calc(100vh-4rem)] w-64 flex-col border-r bg-white">
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <h2 className="text-sm font-semibold text-gray-700">Komunitas</h2>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <TrendingUp className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex-1 space-y-1 overflow-auto p-2">
                        {channels.map((v) => {
                            const isActive = params.channel === v.slug;
                            return (
                                <Link key={v.id} href={`/komunitas/${v.slug}`}>
                                    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? "bg-blue-50 font-semibold text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}>
                                        <Hash className="h-4 w-4" />
                                        {v.name}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <div className="mr-64 ml-64 flex-1 overflow-auto">
                    <div className="mx-auto flex min-h-full max-w-4xl justify-center">{children}</div>
                </div>

                {/* Sidebar Kanan - Info */}
                <div className="fixed top-16 right-0 flex h-[calc(100vh-4rem)] w-64 flex-col border-l bg-white">
                    <div className="border-b px-4 py-3">
                        <h2 className="text-sm font-semibold text-gray-700">Trending Topics</h2>
                    </div>
                    <div className="flex-1 space-y-2 overflow-auto p-4">
                        <div className="rounded-lg bg-gray-50 p-3">
                            <p className="text-xs font-medium text-gray-500">Coming soon...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
