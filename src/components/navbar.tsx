"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import LocaleSwitcher from "./locale-switcher";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

import logoWhite from "@/assets/svg/logo-white.svg";
import logoDark from "@/assets/svg/logo-dark.svg";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

export default function NavbarArunika() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [session, setSession] = useState<any>(null);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
    }, [isMobileMenuOpen]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Check session on mount
    useEffect(() => {
        const checkSession = async () => {
            const sessionData = await authClient.getSession();
            setSession(sessionData.data);
        };
        checkSession();
    }, []);

    const handleLogin = () => {
        authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
        });
    };

    const handleLogoutClick = () => {
        setShowLogoutDialog(true);
    };

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
        <motion.nav
            className="fixed top-4 left-1/2 z-50 w-full max-w-7xl -translate-x-1/2 overflow-hidden rounded-4xl border bg-white/70 pl-6 shadow-sm backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/70"
            initial={{
                height: "56px",
            }}
            animate={{
                height: isExpanded ? "320px" : "56px",
            }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        >
            {/* Navbar */}
            <div className="grid h-14 grid-cols-3 items-center gap-4">
                {/* Left */}
                <Link href="/" className="flex items-center gap-2">
                    {/* Logo untuk mode terang */}
                    <Image src={logoWhite} alt="Arunika Logo" className="block h-12 w-auto dark:hidden" priority />
                    {/* Logo untuk mode gelap */}
                    <Image src={logoDark} alt="Arunika Logo" className="hidden h-12 w-auto dark:block" priority />
                </Link>

                {/* Center */}
                <div className="hidden items-center justify-center space-x-8 md:flex">
                    <div className="relative flex cursor-pointer items-center text-gray-600 transition hover:text-orange-500 dark:text-gray-300" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <span className="select-none">Fitur</span>
                        <motion.div className="ml-2" animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown size={18} />
                        </motion.div>
                    </div>

                    <Link href="#" className="text-gray-600 transition hover:text-orange-500 dark:text-gray-300">
                        Tentang
                    </Link>
                    <Link href="#" className="text-gray-600 transition hover:text-orange-500 dark:text-gray-300">
                        Kontak
                    </Link>
                </div>

                {/* Right Section: Utilities */}
                <div className="flex items-center justify-end space-x-3">
                    <LocaleSwitcher />
                    <ModeToggle />
                    <Button className="hidden rounded-full bg-orange-500 px-5 text-white transition-all hover:opacity-90 md:flex" onClick={session ? handleLogoutClick : handleLogin}>
                        {session ? "Keluar" : "Masuk"}
                    </Button>

                    {/* Mobile Menu Button */}
                    <button className="hover:bg-muted rounded-lg p-2 md:hidden" onClick={() => setIsMobileMenuOpen((s) => !s)} aria-label="Toggle menu">
                        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Dropdown */}
            <div className={`hidden border-gray-100 pt-5 pb-5 transition-all md:block dark:border-gray-800`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} aria-hidden={!isExpanded}>
                <div className={`grid transform grid-cols-3 gap-6 px-4 transition-transform duration-200 ${isExpanded ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"}`}>
                    <div>
                        <h4 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">Produk</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <li>
                                <Link href="#" className="transition hover:text-orange-500">
                                    Arunika AI
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="transition hover:text-orange-500">
                                    Peta Budaya
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="transition hover:text-orange-500">
                                    Koleksi Interaktif
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">Perusahaan</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <li>
                                <Link href="#" className="transition hover:text-orange-500">
                                    Tentang Kami
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="transition hover:text-orange-500">
                                    Karier
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="transition hover:text-orange-500">
                                    Kontak
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">Ikuti Kami</h4>
                        <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Link href="#" className="transition hover:text-orange-500">
                                Instagram
                            </Link>
                            <Link href="#" className="transition hover:text-orange-500">
                                LinkedIn
                            </Link>
                            <Link href="#" className="transition hover:text-orange-500">
                                YouTube
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="space-y-3 border-t border-gray-200 px-4 py-4 md:hidden dark:border-gray-800">
                        <details className="group">
                            <summary className="flex cursor-pointer items-center gap-1 py-2 text-gray-800 dark:text-gray-100">
                                Fitur
                                <ChevronDown size={18} className="transition-transform group-open:rotate-180" />
                            </summary>
                            <div className="mt-2 ml-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                <Link href="#" className="block transition hover:text-orange-500">
                                    Arunika AI
                                </Link>
                                <Link href="#" className="block transition hover:text-orange-500">
                                    Peta Budaya
                                </Link>
                                <Link href="#" className="block transition hover:text-orange-500">
                                    Koleksi Interaktif
                                </Link>
                            </div>
                        </details>

                        <Link href="#" className="block py-2 text-gray-800 transition hover:text-orange-500 dark:text-gray-100">
                            Tentang
                        </Link>
                        <Link href="#" className="block py-2 text-gray-800 transition hover:text-orange-500 dark:text-gray-100">
                            Kontak
                        </Link>
                        <Button className="w-full rounded-full bg-orange-500 text-white hover:opacity-90" onClick={session ? handleLogoutClick : handleLogin}>
                            {session ? "Keluar" : "Masuk"}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Logout Confirmation Dialog */}
            <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Keluar</DialogTitle>
                        <DialogDescription>Apakah Anda yakin ingin keluar dari akun Anda?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleLogoutConfirm}>
                            Keluar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.nav>
    );
}
