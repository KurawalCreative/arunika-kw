"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuLink, NavigationMenuContent } from "@/components/ui/navigation-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import LocaleSwitcher from "./locale-switcher";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Menu, X, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { usePathname, useSearchParams } from "next/navigation";
import logo from "@/assets/svg/logo.svg";

const NavbarList = [
    { label: "Komunitas", href: "/komunitas" },
    { label: "Tentang", href: "/tentang" },
    { label: "Kontak", href: "/kontak" },
];

const DropdownList = [
    {
        title: "Konten",
        items: [
            { label: "Arunika AI", href: "/ai", description: "Asisten AI untuk budaya Nusantara" },
            { label: "Peta Budaya", href: "/jelajahi-nusantara", description: "Jelajahi kebudayaan Indonesia" },
            { label: "Koleksi Interaktif", href: "/koleksi-interaktif", description: "Koleksi digital interaktif" },
        ],
    },
    {
        title: "Perusahaan",
        items: [
            { label: "Tentang Kami", href: "/tentang-kami", description: "Kenali lebih dekat tim kami" },
            { label: "Karier", href: "/karier", description: "Bergabung dengan tim kami" },
            { label: "Kontak", href: "/kontak", description: "Hubungi kami untuk informasi" },
        ],
    },
];

export default function NavbarArunika() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
    const [session, setSession] = useState<any>(null);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isKomunitasPage = !!pathname.match(/\/komunitas/i);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const checkSession = async () => {
            const sessionData = await authClient.getSession();
            setSession(sessionData.data);
        };
        checkSession();
    }, []);

    const getLoginUrl = () => {
        const currentPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
        return `/login?callbackUrl=${encodeURIComponent(currentPath)}`;
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setIsMobileDropdownOpen(false);
    };

    return (
        <>
            {/* Navbar Utama */}
            <nav className={`dark:bg-foreground/90 fixed top-0 right-0 left-0 z-50 bg-white/80 backdrop-blur-md transition-all duration-300 ${isScrolled ? "border-b border-gray-200 shadow-sm dark:border-neutral-700" : ""}`}>
                <motion.div layoutId="nav-width" className="mx-auto w-full max-w-7xl px-4 sm:px-6" transition={{ type: "spring", stiffness: 120, damping: 20 }}>
                    <div className="relative flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <Image src={logo} alt="Arunika Logo" className="h-7 w-auto" priority />
                        </Link>

                        {/* Menu Tengah (Desktop & Tablet >= md) */}
                        <div className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:flex">
                            <NavigationMenu>
                                <NavigationMenuList className="space-x-2">
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="hover:text-primary-blue bg-transparent text-sm font-medium transition-colors hover:bg-blue-50 data-[state=open]:bg-blue-50 dark:hover:bg-blue-950/50 dark:data-[state=open]:bg-blue-950/50">Fitur</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <div className="grid w-[700px] gap-3 p-6 md:grid-cols-2">
                                                {DropdownList.map((section) => (
                                                    <div key={section.title}>
                                                        <h4 className="text-primary-blue mb-2 text-sm font-semibold dark:text-blue-400">{section.title}</h4>
                                                        <ul className="space-y-2">
                                                            {section.items.map((item) => (
                                                                <li key={item.href}>
                                                                    <NavigationMenuLink asChild>
                                                                        <Link href={item.href} className="hover:text-primary-blue block rounded-md p-3 hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:hover:text-blue-400">
                                                                            <div className="text-sm font-medium">{item.label}</div>
                                                                            <p className="text-muted-foreground text-xs">{item.description}</p>
                                                                        </Link>
                                                                    </NavigationMenuLink>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>

                                    {NavbarList.map((link) => (
                                        <NavigationMenuItem key={link.href}>
                                            <Link href={link.href} className="hover:text-primary-blue rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:hover:text-blue-400">
                                                {link.label}
                                            </Link>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        {/* Actions (Desktop & Tablet >= md) */}
                        <div className="hidden items-center space-x-2 md:flex">
                            <LocaleSwitcher />
                            <AnimatedThemeToggler />
                            {session ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={session.user?.image || ""} />
                                                <AvatarFallback className="text-primary-blue bg-blue-100 dark:bg-blue-950 dark:text-blue-400">{session.user?.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <div className="p-2">
                                            <p className="font-medium">{session.user?.name}</p>
                                            <p className="text-muted-foreground truncate text-sm">{session.user?.email}</p>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => setShowLogoutDialog(true)} className="text-red-600 dark:text-red-400">
                                            <LogOut className="mr-2 h-4 w-4" /> Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link href={getLoginUrl()} className="bg-primary-blue hover:bg-primary-blue-hover rounded-full px-4 py-2 text-sm font-medium text-white dark:bg-blue-600 dark:hover:bg-blue-700">
                                    Masuk
                                </Link>
                            )}
                        </div>

                        {/* Tombol Hamburger (Mobile < md) */}
                        <button className="rounded-md p-2 transition hover:bg-gray-100 md:hidden dark:hover:bg-neutral-800" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </motion.div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" onClick={closeMobileMenu} />
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm overflow-y-auto bg-white shadow-2xl md:hidden dark:bg-neutral-900">
                            <div className="p-6">
                                <div className="mb-6 flex items-center justify-between">
                                    <span className="text-lg font-semibold dark:text-gray-100">Menu</span>
                                    <button onClick={closeMobileMenu} className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-neutral-800">
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Dropdown Fitur */}
                                <div>
                                    <button onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)} className="flex w-full items-center justify-between rounded-lg px-4 py-3 font-medium hover:bg-blue-50 dark:hover:bg-blue-950/50">
                                        <span>Fitur</span>
                                        <motion.svg width="20" height="20" viewBox="0 0 20 20" fill="none" animate={{ rotate: isMobileDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </motion.svg>
                                    </button>
                                    <AnimatePresence>
                                        {isMobileDropdownOpen && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                                <div className="space-y-4 px-4 py-3">
                                                    {DropdownList.map((section) => (
                                                        <div key={section.title}>
                                                            <h4 className="text-primary-blue mb-2 text-xs font-semibold uppercase dark:text-blue-400">{section.title}</h4>
                                                            <ul className="space-y-1">
                                                                {section.items.map((item) => (
                                                                    <li key={item.href}>
                                                                        <Link href={item.href} onClick={closeMobileMenu} className="hover:text-primary-blue block rounded-lg px-3 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:hover:text-blue-400">
                                                                            <div className="font-medium">{item.label}</div>
                                                                            <p className="text-muted-foreground text-xs">{item.description}</p>
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Other Links */}
                                <div className="mt-3 space-y-1">
                                    {NavbarList.map((link) => (
                                        <Link key={link.href} href={link.href} onClick={closeMobileMenu} className="hover:text-primary-blue block rounded-lg px-4 py-3 font-medium hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:hover:text-blue-400">
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div className="my-6 border-t border-gray-200 dark:border-neutral-700" />

                                {/* Extra Controls (Theme + Language + Profile) */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium dark:text-gray-300">Tema</span>
                                        <AnimatedThemeToggler />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium dark:text-gray-300">Bahasa</span>
                                        <LocaleSwitcher />
                                    </div>
                                    {session ? (
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowLogoutDialog(true);
                                                closeMobileMenu();
                                            }}
                                            className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/50"
                                        >
                                            Logout
                                        </Button>
                                    ) : (
                                        <Link href={getLoginUrl()} onClick={closeMobileMenu} className="block w-full rounded-full bg-blue-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-700">
                                            Masuk
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Logout Dialog */}
            <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Logout</DialogTitle>
                        <DialogDescription>Apakah Anda yakin ingin keluar dari akun Anda?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                try {
                                    await authClient.signOut();
                                    setSession(null);
                                    setShowLogoutDialog(false);
                                } catch (err) {
                                    console.error("Logout error:", err);
                                }
                            }}
                        >
                            Logout
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
