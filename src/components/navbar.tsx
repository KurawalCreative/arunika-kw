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
import logoWhite from "@/assets/svg/logo-white.svg";
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
    const timeoutRef = useRef<number | null>(null);

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
        <motion.nav
            className="fixed top-4 left-1/2 z-50 w-full max-w-7xl -translate-x-1/2 overflow-hidden rounded-3xl border bg-white/70 pl-6 shadow-sm backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/70"
            initial={{ height: "56px" }}
            animate={{ height: isExpanded ? "320px" : "56px" }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        >
            <div className="grid h-14 grid-cols-3 items-center gap-4">
                <Link href="/" className="flex items-center gap-2">
                    <Image src={logoWhite} alt="Arunika Logo" className="block h-12 w-auto dark:hidden" priority />
                    <Image src={logoDark} alt="Arunika Logo" className="hidden h-12 w-auto dark:block" priority />
                </Link>

                <div className="hidden items-center justify-center space-x-8 md:flex">
                    <div
                        className="relative flex cursor-pointer items-center text-gray-600 transition hover:text-orange-500 dark:text-gray-300"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <span className="select-none">Fitur</span>
                        <motion.div className="ml-2" animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown size={16} />
                        </motion.div>
                    </div>

                    {NavbarList.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-gray-600 transition hover:text-orange-500 dark:text-gray-300"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center justify-end space-x-2">
                    <LocaleSwitcher />
                    <ModeToggle />
                    {session ? (
                        <Button variant="ghost" onClick={() => setShowLogoutDialog(true)}>
                            Logout
                        </Button>
                    ) : (
                        <Link href="/login" className="hidden md:inline-block bg-orange px-4 py-2 text-white transition rounded-4xl hover:bg-orange-600">
                            Masuk
                        </Link>
                    )}
                    <button className="md:hidden" onClick={() => setIsMobileMenuOpen((prev) => !prev)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-3 gap-8 border-t border-neutral-200 px-8 py-6 dark:border-neutral-700"
                    >
                        {DropdownList.map((section) => (
                            <div key={section.title}>
                                <h4 className="mb-3 font-medium text-gray-800 dark:text-gray-200">{section.title}</h4>
                                <ul className="space-y-2">
                                    {section.items.map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className="block text-sm text-gray-600 transition hover:text-orange-500 dark:text-gray-300"
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

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
        </motion.nav>
    );
}
