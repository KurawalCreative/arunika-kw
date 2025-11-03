"use client";

import { ReactNode, useState } from "react";
import { Home, Users, Search, Hash, Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";

interface LayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
    const [active, setActive] = useState("Home");
    const [darkMode, setDarkMode] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className={`min-h-screen flex bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300`}>
            {/* Sidebar Kiri */}
            <aside className={`${menuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4 flex flex-col transition-transform duration-300 z-50`}>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">MyApp</h1>
                    <ModeToggle />
                </div>

                <nav className="flex flex-col space-y-2">
                    <Button variant={active === "Home" ? "default" : "ghost"} className="justify-start" onClick={() => setActive("Home")}>
                        <Home className="mr-2 h-5 w-5" /> Home
                    </Button>
                    <Button variant={active === "People" ? "default" : "ghost"} className="justify-start" onClick={() => setActive("People")}>
                        <Users className="mr-2 h-5 w-5" /> People
                    </Button>
                    <Button variant={active === "Cari" ? "default" : "ghost"} className="justify-start" onClick={() => setActive("Cari")}>
                        <Search className="mr-2 h-5 w-5" /> Cari Orang
                    </Button>
                </nav>

                <div className="mt-auto pt-4 border-t dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 MyApp</p>
                </div>
            </aside>

            {/* Tombol toggle sidebar untuk mobile */}
            <div className="lg:hidden fixed top-4 left-4 z-40">
                <Button size="icon" variant="ghost" onClick={() => setMenuOpen(!menuOpen)}>
                    <Menu className="h-6 w-6" />
                </Button>
            </div>

            {/* Konten Tengah */}
            <main className={`flex-1 p-6 lg:ml-64 lg:mr-72 overflow-y-auto h-screen transition-colors duration-300`} style={{ scrollBehavior: "smooth" }}>
                <div className={darkMode ? "dark" : ""}>{children}</div>
            </main>

            {/* Sidebar Kanan */}
            <aside className="hidden lg:block w-72 fixed right-0 top-0 bottom-0 bg-white dark:bg-gray-800 border-l dark:border-gray-700 p-4 overflow-y-auto">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Hash className="h-5 w-5 mr-2" /> Trending Tag
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-blue-600 dark:text-blue-400">
                            <li>#NextJS</li>
                            <li>#TypeScript</li>
                            <li>#Shadcn</li>
                            <li>#UIUX</li>
                            <li>#WebDev</li>
                        </ul>
                    </CardContent>
                </Card>
            </aside>
        </div>
    );
}
