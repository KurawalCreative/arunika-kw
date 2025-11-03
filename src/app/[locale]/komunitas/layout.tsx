"use client";

import { ReactNode, useState, useEffect } from "react";
import { Home, Users, Search, Hash, Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import axios from "axios";
import { useRouter } from "next/navigation";

interface LayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
    const [active, setActive] = useState("Home");
    const [darkMode, setDarkMode] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [popularTags, setPopularTags] = useState<{ name: string; count: number }[]>([]);
    const router = useRouter();

    const handleTagClick = (tagName: string) => {
        // Navigate to komunitas page with search parameter
        router.push(`/id/komunitas?search=${encodeURIComponent(tagName)}`);
    };

    useEffect(() => {
        const fetchPopularTags = async () => {
            try {
                const res = await axios.get("/api/tags/popular");
                setPopularTags(res.data.tags);
            } catch (err) {
                console.error("Failed to fetch popular tags:", err);
            }
        };
        fetchPopularTags();
    }, []);

    return (
        <div className={`flex min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100`}>
            {/* Sidebar Kiri */}
            <aside className={`${menuOpen ? "translate-x-0" : "-translate-x-full"} fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r bg-white p-4 transition-transform duration-300 lg:translate-x-0 dark:border-gray-700 dark:bg-gray-800`}>
                <div className="mb-6 flex items-center justify-between">
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

                <div className="mt-auto border-t pt-4 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 MyApp</p>
                </div>
            </aside>

            {/* Tombol toggle sidebar untuk mobile */}
            <div className="fixed top-4 left-4 z-40 lg:hidden">
                <Button size="icon" variant="ghost" onClick={() => setMenuOpen(!menuOpen)}>
                    <Menu className="h-6 w-6" />
                </Button>
            </div>

            {/* Konten Tengah */}
            <main className={`h-screen flex-1 overflow-y-auto p-6 transition-colors duration-300 lg:mr-72 lg:ml-64`} style={{ scrollBehavior: "smooth" }}>
                <div className={darkMode ? "dark" : ""}>{children}</div>
            </main>

            {/* Sidebar Kanan */}
            <aside className="fixed top-0 right-0 bottom-0 hidden w-72 overflow-y-auto border-l bg-white p-4 lg:block dark:border-gray-700 dark:bg-gray-800">
                <Card className="dark:border-gray-700 dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Hash className="mr-2 h-5 w-5" /> Tag Populer
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-blue-600 dark:text-blue-400">
                            {popularTags.length > 0 ? (
                                popularTags.slice(0, 10).map((tag) => (
                                    <li key={tag.name} className="cursor-pointer hover:text-blue-800 dark:hover:text-blue-300" onClick={() => handleTagClick(tag.name)}>
                                        #{tag.name} ({tag.count})
                                    </li>
                                ))
                            ) : (
                                <li className="text-gray-500 dark:text-gray-400">Memuat tag...</li>
                            )}
                        </ul>
                    </CardContent>
                </Card>
            </aside>
        </div>
    );
}
