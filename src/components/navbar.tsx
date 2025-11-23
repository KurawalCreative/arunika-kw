"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Menu, X, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import logoLight from "@/assets/svg/logo-light.svg";
import logoDark from "@/assets/svg/logo-dark.svg";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSearchParams } from "next/navigation";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { useTheme } from "next-themes";

const NavbarList = [
    { label: "Komunitas", href: "/komunitas" },
    { label: "Tentang", href: "/tentang" },
];

const DropdownList = [
    {
        title: "Konten",
        items: [
            { label: "Arunika AI", href: "/ai", description: "Asisten AI untuk budaya Nusantara" },
            { label: "Koleksi Interaktif", href: "/koleksi-interaktif", description: "Koleksi digital interaktif" },
            { label: "Photo Booth", href: "/photo-booth" },
        ],
    },
    {
        title: "Perusahaan",
        items: [
            { label: "Tentang Kami", href: "/tentang-kami", description: "Kenali lebih dekat tim kami" },
            { label: "Karier", href: "/karier", description: "Bergabung dengan tim kami" },
        ],
    },
    {
        title: "Ikuti Kami",
        items: [
            { label: "Instagram", href: "/instagram", description: "Ikuti update terbaru kami" },
            { label: "LinkedIn", href: "/linkedin", description: "Connect secara profesional" },
            { label: "YouTube", href: "/youtube", description: "Tonton konten video kami" },
        ],
    },
];

export default function NavbarArunika() {
    return (
        <Suspense fallback={<div />}>
            <Navbar />
        </Suspense>
    );
}

function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
    const [session, setSession] = useState<any>(null);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const isKomunitasPage = !!pathname.match(/\/komunitas/i);
    const isActive = (href: string) => {
        if (!pathname) return false;
        if (href === "/") return pathname === href;
        return pathname === href || pathname.startsWith(href + "/") || pathname.startsWith(href);
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // 1. Apply saved theme from localStorage
        const saved = localStorage.getItem("theme");
        const darkEnabled = saved === "dark";

        document.documentElement.classList.toggle("dark", darkEnabled);
        setIsDark(darkEnabled);

        // 2. Listen for changes (sync with your AnimatedThemeToggler)
        const updateTheme = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

        setMounted(true);

        return () => observer.disconnect();
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

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setIsMobileDropdownOpen(false);
    };

    const getLoginUrl = () => {
        return `/login?callbackUrl=${encodeURIComponent(pathname)}`;
    };

    return (
        <>
            <nav className={`fixed top-0 right-0 left-0 z-50 bg-white backdrop-blur-md transition-all duration-200 dark:bg-neutral-900 ${isScrolled && !isKomunitasPage ? "border-b border-gray-100 shadow-sm dark:border-gray-700" : ""} ${isKomunitasPage ? "border-b dark:border-gray-700" : ""}`}>
                <motion.div layoutId="nav-width" className={`mx-auto w-full px-4 sm:px-6 ${!isKomunitasPage ? "max-w-7xl" : ""}`} transition={{ type: "spring", stiffness: 120, damping: 20 }}>
                    <div className="relative flex h-14 items-center justify-between sm:h-16">
                        {/* Logo */}
                        <div className="flex shrink-0 items-center">
                            <Link href="/" className="flex items-center gap-2">
                                <Image src={!mounted ? logoDark : isDark ? logoDark : logoLight} alt="Arunika Logo" className="block h-7 md:h-8 w-auto" priority />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 xl:flex">
                            <NavigationMenu>
                                <NavigationMenuList className="space-x-2">
                                    {/* <NavigationMenuItem>
                                        <NavigationMenuTrigger className="hover:text-primary-blue bg-transparent text-sm font-medium text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-blue-950/50 dark:hover:text-blue-400">
                                            <>Fitur</>
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <div className="grid w-[800px] gap-3 p-6 md:grid-cols-3">
                                                {DropdownList.map((section) => (
                                                    <div key={section.title} className="space-y-3">
                                                        <h4 className="text-primary-blue text-sm font-semibold dark:text-blue-400">{section.title}</h4>
                                                        <ul className="space-y-2">
                                                            {section.items.map((item) => (
                                                                <li key={item.href}>
                                                                    <NavigationMenuLink asChild>
                                                                        <Link href={item.href} className="hover:text-primary-blue block space-y-1 rounded-md p-3 text-gray-700 transition hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-blue-950/50 dark:hover:text-blue-400">
                                                                            <div className="text-sm font-medium">{item.label}</div>
                                                                            <p className="text-muted-foreground text-xs dark:text-gray-400">{item.description}</p>
                                                                        </Link>
                                                                    </NavigationMenuLink>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem> */}

                                    <NavigationMenuItem>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                href={"/jelajahi-nusantara"}
                                                aria-current={isActive("/jelajahi-nusantara") ? "page" : undefined}
                                                className={`inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all ${isActive("/jelajahi-nusantara") ? "bg-sky-600 text-white shadow-md" : "text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-blue-950/50 dark:hover:text-blue-400"}`}
                                            >
                                                <span className="inline-flex items-center gap-2">
                                                    <span className="sr-only">Jelajahi Nusantara</span>
                                                    {/* <span className="mr-1 h-2 w-2 rounded-full bg-sky-600/30" aria-hidden /> */}
                                                    <span className="truncate">Jelajahi Nusantara</span>
                                                </span>
                                            </Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>

                                    {NavbarList.filter((link) => link.label !== "Komunitas").map((link, i) => (
                                        <NavigationMenuItem key={i}>
                                            <NavigationMenuLink asChild>
                                                <Link href={link.href} aria-current={isActive(link.href) ? "page" : undefined} className={`inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all ${isActive(link.href) ? "font-semibold text-sky-700" : "text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-blue-950/50 dark:hover:text-blue-400"}`}>
                                                    {link.label}
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                            {/* Show only above md */}
                            <div className="hidden items-center space-x-2 md:flex">
                                <AnimatedThemeToggler />
                                {/* {session ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                                                    <AvatarFallback className="text-primary-blue bg-blue-100 dark:bg-blue-950 dark:text-blue-400">{session.user?.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56" align="end" forceMount>
                                            <div className="flex items-center justify-start gap-2 p-2">
                                                <div className="flex flex-col space-y-1 leading-none">
                                                    {session.user?.name && <p className="font-medium">{session.user.name}</p>}
                                                    {session.user?.email && <p className="text-muted-foreground w-[200px] truncate text-sm">{session.user.email}</p>}
                                                </div>
                                            </div>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => setShowLogoutDialog(true)} className="text-red-600 focus:text-red-600 dark:text-red-400">
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Log out</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Link href={getLoginUrl()} className="bg-primary-blue hover:bg-primary-blue-hover hidden items-center rounded-full px-4 py-2 text-sm font-medium text-white shadow-sm transition lg:inline-flex dark:bg-blue-600 dark:hover:bg-blue-700">
                                        Masuk
                                    </Link>
                                )} */}
                            </div>

                            {/* Hamburger */}
                            <button className="rounded-md p-2 text-gray-700 transition hover:bg-gray-100 xl:hidden dark:text-gray-300 dark:hover:bg-neutral-800" onClick={() => setIsMobileMenuOpen((prev) => !prev)} aria-label="Toggle menu">
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={closeMobileMenu} />
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 bottom-0 z-50 w-full overflow-y-auto bg-white shadow-2xl sm:w-80 dark:bg-gray-900">
                            <div className="p-6">
                                <div className="mb-8 flex items-center justify-between">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Menu</span>
                                    <button onClick={closeMobileMenu} className="rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800" aria-label="Close menu">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-1">
                                    {/* Jelajahi Nusantara */}
                                    <Link href="/jelajahi-nusantara" onClick={closeMobileMenu} aria-current={isActive("/jelajahi-nusantara") ? "page" : undefined} className={`block rounded-lg px-4 py-3 font-medium transition ${isActive("/jelajahi-nusantara") ? "bg-sky-100 text-sky-700" : "text-gray-900 hover:bg-blue-50 dark:text-gray-100 dark:hover:bg-blue-950/50 dark:hover:text-blue-400"}`}>
                                        <span className="inline-flex items-center gap-2">
                                            <span className="mr-1 h-2 w-2 rounded-full bg-sky-600" aria-hidden />
                                            <span>Jelajahi Nusantara</span>
                                        </span>
                                    </Link>

                                    {/* Fitur Dropdown - Commented out to hide */}
                                    {/* <div>
                                        <button onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)} className="flex w-full items-center justify-between rounded-lg px-4 py-3 font-medium text-gray-900 hover:bg-blue-50 dark:text-gray-100 dark:hover:bg-blue-950/50 dark:hover:text-blue-400">
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
                                                                <h4 className="text-primary-blue mb-2 text-xs font-semibold tracking-wide uppercase dark:text-blue-400">{section.title}</h4>
                                                                <ul className="space-y-1">
                                                                    {section.items.map((item) => (
                                                                        <li key={item.href}>
                                                                            <Link href={item.href} onClick={closeMobileMenu} className="block space-y-1 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 hover:bg-blue-50 dark:text-gray-100 dark:hover:bg-blue-950/50 dark:hover:text-blue-400">
                                                                                <div>{item.label}</div>
                                                                                <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
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
                                    </div> */}

                                    {/* Komunitas - Commented out to hide */}
                                    {/* {NavbarList.filter(link => link.label !== "Komunitas").map((link) => (
                                        <Link key={link.href} href={link.href} onClick={closeMobileMenu} aria-current={isActive(link.href) ? "page" : undefined} className={`block rounded-lg px-4 py-3 font-medium transition ${isActive(link.href) ? "bg-sky-100 text-sky-700" : "text-gray-900 hover:bg-blue-50 dark:text-gray-100 dark:hover:bg-blue-950/50 dark:hover:text-blue-400"}`}>
                                            {link.label}
                                        </Link>
                                    ))} */}

                                    {/* Tetap tampilkan Tentang */}
                                    <Link href="/tentang" onClick={closeMobileMenu} aria-current={isActive("/tentang") ? "page" : undefined} className={`block rounded-lg px-4 py-3 font-medium transition ${isActive("/tentang") ? "bg-sky-100 text-sky-700" : "text-gray-900 hover:bg-blue-50 dark:text-gray-100 dark:hover:bg-blue-950/50 dark:hover:text-blue-400"}`}>
                                        Tentang
                                    </Link>
                                </div>

                                {/* Locale, Theme, Profile di Mobile */}
                                <div className="mt-8 space-y-3 border-t border-gray-200 pt-6 dark:border-neutral-700">
                                    <div className="flex w-full flex-col items-end justify-end gap-3">
                                        <div className="flex w-full items-center justify-between gap-2">
                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Tema</span>
                                            <AnimatedThemeToggler />
                                        </div>
                                    </div>

                                    {/* {session ? (
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowLogoutDialog(true);
                                                closeMobileMenu();
                                            }}
                                            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/50"
                                        >
                                            Logout
                                        </Button>
                                    ) : (
                                        <Link href={getLoginUrl()} onClick={closeMobileMenu} className="block w-full rounded-full bg-blue-600 px-5 py-3 text-center text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
                                            Masuk
                                        </Link>
                                    )} */}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Logout Dialog */}
            <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:text-gray-100">
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Logout</DialogTitle>
                        <DialogDescription className="dark:text-gray-400">Apakah Anda yakin ingin keluar dari akun Anda?</DialogDescription>
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
                                } catch (error) {
                                    console.error("Error during logout:", error);
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
