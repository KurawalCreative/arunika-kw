"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import LocaleSwitcher from "./locale-switcher";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import logoLight from "@/assets/svg/logo-light.svg";
import logoDark from "@/assets/svg/logo-dark.svg";
import { usePathname } from "@/i18n/navigation";
import { motion, AnimatePresence } from "motion/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSearchParams } from "next/navigation";

const NavbarList = [
    { label: "Komunitas", href: "/komunitas" },
    { label: "Tentang", href: "/tentang" },
    { label: "Kontak", href: "/kontak" },
];

const DropdownList = [
    {
        title: "Konten",
        items: [
            { label: "Arunika AI", href: "/ai" },
            { label: "Peta Budaya", href: "/jelajahi-nusantara" },
            { label: "Koleksi Interaktif", href: "/koleksi-interaktif" },
        ],
    },
    {
        title: "Perusahaan",
        items: [
            { label: "Tentang Kami", href: "/tentang-kami" },
            { label: "Karier", href: "/karier" },
            { label: "Kontak", href: "/kontak" },
        ],
    },
    {
        title: "Ikuti Kami",
        items: [
            { label: "Instagram", href: "/instagram" },
            { label: "LinkedIn", href: "/linkedin" },
            { label: "YouTube", href: "/youtube" },
        ],
    },
];

export default function NavbarArunika() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
    const [session, setSession] = useState<any>(null);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const timeoutRef = useRef<number | null>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isKomunitasPage = !!pathname.match(/\/komunitas/i);
    const isHomePage = pathname === "/";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
    }, [isMobileMenuOpen]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        };
    }, []);

    useEffect(() => {
        const checkSession = async () => {
            const sessionData = await authClient.getSession();
            setSession(sessionData.data);
        };
        checkSession();
    }, []);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsExpanded(true);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
            setIsExpanded(false);
            timeoutRef.current = null;
        }, 140);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setIsMobileDropdownOpen(false);
    };

    const getLoginUrl = () => {
        const currentPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
        return `/login?callbackUrl=${encodeURIComponent(currentPath)}`;
    };

    return (
        <>
            <nav className={`fixed top-0 right-0 left-0 z-50 bg-white/80 backdrop-blur-md transition-all duration-200 dark:bg-neutral-900/80 ${isScrolled && !isKomunitasPage ? "border-b shadow-sm dark:border-neutral-700" : ""} ${isKomunitasPage ? "border-b" : ""}`}>
                <motion.div layoutId="nav-width" className={`mx-auto w-full px-4 sm:px-6 ${!isKomunitasPage ? "max-w-7xl" : ""}`} transition={{ type: "spring", stiffness: 120, damping: 20 }}>
                    <div className="relative flex h-16 items-center justify-between sm:h-16">
                        {/* Logo - Kiri */}
                        <div className="flex shrink-0 items-center">
                            <Link href="/" className="flex items-center gap-2">
                                <Image src={logoLight} alt="Arunika Logo" className="block h-14 w-auto sm:h-20 dark:hidden" priority />
                                <Image src={logoLight} alt="Arunika Logo" className="hidden h-14 w-auto sm:h-20 dark:block" priority />
                            </Link>
                        </div>

                        {/* Menu - Tengah (Desktop) */}
                        <div className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center space-x-6 lg:flex xl:space-x-8">
                            <div className="text-font-primary relative flex cursor-pointer items-center transition hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                <span className="text-sm font-medium select-none xl:text-base">Fitur</span>
                                <motion.div className="ml-1.5" animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <ChevronDown size={18} />
                                </motion.div>
                            </div>

                            {NavbarList.map((link) => (
                                <Link key={link.href} href={link.href} className="text-font-primary hover:text-orange dark:hover:text-orange text-sm font-medium transition xl:text-base dark:text-gray-300">
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Actions - Kanan */}
                        <div className="flex items-center space-x-1 sm:space-x-2">
                            <LocaleSwitcher />
                            <ModeToggle />
                            {session ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                                                <AvatarFallback>{session.user?.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
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
                                        <DropdownMenuItem onClick={() => setShowLogoutDialog(true)}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link href={getLoginUrl()} className="hidden items-center rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600 lg:inline-flex xl:px-5 xl:py-2.5">
                                    Masuk
                                </Link>
                            )}
                            <button className="text-font-primary rounded-md p-2 transition hover:bg-gray-100 lg:hidden dark:text-gray-300 dark:hover:bg-neutral-800" onClick={() => setIsMobileMenuOpen((prev) => !prev)} aria-label="Toggle menu">
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Dropdown Menu - Desktop */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className={` ${isHomePage ? "absolute right-0 left-0 z-50" : "absolute right-0 left-0 z-50"} border-t border-neutral-200 bg-white shadow-sm backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/95`}
                        >
                            <div className={`${isKomunitasPage ? "w-full px-4 sm:px-6" : "mx-auto max-w-7xl px-4 sm:px-6"} grid grid-cols-3 gap-6 py-6 xl:gap-8 xl:py-8`}>
                                {DropdownList.map((section) => (
                                    <div key={section.title}>
                                        <h4 className="mb-3 text-xs font-semibold tracking-wide text-gray-900 xl:mb-4 xl:text-sm dark:text-gray-100">{section.title}</h4>
                                        <ul className="space-y-2 xl:space-y-3">
                                            {section.items.map((item) => (
                                                <li key={item.href}>
                                                    <Link href={item.href} className="block text-sm text-gray-600 transition duration-200 hover:translate-x-1 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400">
                                                        {item.label}
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
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-45 bg-black/50 backdrop-blur-sm lg:hidden" onClick={closeMobileMenu} />

                        {/* Menu Panel */}
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 bottom-0 z-50 w-full overflow-y-auto bg-white shadow-2xl sm:w-80 lg:hidden dark:bg-neutral-900">
                            <div className="p-6">
                                {/* Close Button */}
                                <div className="mb-8 flex items-center justify-between">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Menu</span>
                                    <button onClick={closeMobileMenu} className="text-font-primary rounded-md p-2 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800" aria-label="Close menu">
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Navigation Links */}
                                <div className="space-y-1">
                                    {/* Fitur Dropdown */}
                                    <div>
                                        <button onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)} className="text-font-primary flex w-full items-center justify-between rounded-lg px-4 py-3 font-medium transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800">
                                            <span>Fitur</span>
                                            <motion.div animate={{ rotate: isMobileDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                                <ChevronDown size={20} />
                                            </motion.div>
                                        </button>

                                        <AnimatePresence>
                                            {isMobileDropdownOpen && (
                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                                    <div className="space-y-4 px-4 py-2">
                                                        {DropdownList.map((section) => (
                                                            <div key={section.title}>
                                                                <h4 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">{section.title}</h4>
                                                                <ul className="space-y-1">
                                                                    {section.items.map((item) => (
                                                                        <li key={item.href}>
                                                                            <Link href={item.href} onClick={closeMobileMenu} className="block rounded px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-orange-500 dark:text-gray-400 dark:hover:bg-neutral-800/50 dark:hover:text-orange-400">
                                                                                {item.label}
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
                                    {NavbarList.map((link) => (
                                        <Link key={link.href} href={link.href} onClick={closeMobileMenu} className="text-font-primary block rounded-lg px-4 py-3 font-medium transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800">
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>

                                {/* Auth Button */}
                                <div className="mt-8 border-t border-gray-200 pt-6 dark:border-neutral-700">
                                    {session ? (
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowLogoutDialog(true);
                                                closeMobileMenu();
                                            }}
                                            className="w-full"
                                        >
                                            Logout
                                        </Button>
                                    ) : (
                                        <Link href={getLoginUrl()} onClick={closeMobileMenu} className="block w-full rounded-full bg-orange-500 px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-orange-600">
                                            Masuk
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Logout Confirmation Dialog */}
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
