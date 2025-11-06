"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import LocaleSwitcher from "./locale-switcher";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import logoLight from "@/assets/svg/logo-light.svg";
import logoDark from "@/assets/svg/logo-dark.svg";

const NavbarList = [
    { label: "Komunitas", href: "/komunitas" },
    { label: "Tentang", href: "/tentang" },
    { label: "Kontak", href: "/kontak" },
];

const DropdownList = [
    {
        title: "Produk",
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
    const [session, setSession] = useState<any>(null);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const timeoutRef = useRef<number | null>(null);

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

    const handleLogoutConfirm = async () => {
        await authClient.signOut();
        setSession(null);
        setShowLogoutDialog(false);
    };

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

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md dark:bg-neutral-900/80 transition-all duration-200 ${isScrolled ? 'border-b shadow-sm dark:border-neutral-700' : ''
                    }`}
            >
                <div className="mx-auto max-w-7xl px-6">
                    <div className="relative grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-4">
                        {/* Logo - Kiri */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center gap-2">
                                <Image src={logoLight} alt="Arunika Logo" className="block h-20 w-auto dark:hidden" priority />
                                <Image src={logoDark} alt="Arunika Logo" className="hidden h-20 w-auto dark:block" priority />
                            </Link>
                        </div>

                        {/* Menu - Tengah (Absolute Center) */}
                        <div className="hidden items-center space-x-8 md:flex">
                            <div
                                className="relative flex cursor-pointer items-center text-gray-700 transition hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <span className="select-none font-medium">Fitur</span>
                                <motion.div className="ml-1.5" animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <ChevronDown size={18} />
                                </motion.div>
                            </div>

                            {NavbarList.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="font-medium text-gray-700 transition hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Actions - Kanan */}
                        <div className="flex items-center justify-end space-x-2">
                            <LocaleSwitcher />
                            <ModeToggle />
                            {session ? (
                                <Button variant="ghost" onClick={() => setShowLogoutDialog(true)} className="hidden md:inline-flex">
                                    Logout
                                </Button>
                            ) : (
                                <Link href="/login" className="hidden md:inline-flex items-center rounded-full bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600">
                                    Masuk
                                </Link>
                            )}
                            <button
                                className="md:hidden p-2 text-gray-700 dark:text-gray-300"
                                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dropdown Menu */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-neutral-200 bg-white/95 backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/95"
                        >
                            <div className="mx-auto grid max-w-7xl grid-cols-3 gap-8 px-6 py-8">
                                {DropdownList.map((section) => (
                                    <div key={section.title}>
                                        <h4 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">{section.title}</h4>
                                        <ul className="space-y-3">
                                            {section.items.map((item) => (
                                                <li key={item.href}>
                                                    <Link
                                                        href={item.href}
                                                        className="block text-sm text-gray-600 transition hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400"
                                                    >
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

            {/* Logout Dialog */}
            <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Logout</DialogTitle>
                        <DialogDescription>Apakah kamu yakin ingin keluar?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleLogoutConfirm}>Keluar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}