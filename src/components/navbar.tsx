"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import LocaleSwitcher from "./locale-switcher";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import logoLight from "@/assets/svg/logo-light.svg";
import logoDark from "@/assets/svg/logo-dark.svg";
import { usePathname } from "@/i18n/navigation";
import { motion, AnimatePresence } from 'motion/react';

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

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setIsMobileDropdownOpen(false);
    };

    return (
        <>
            <nav
                className={`
                fixed top-0 left-0 right-0 z-50
                bg-white/80 backdrop-blur-md dark:bg-neutral-900/80 transition-all duration-200 border-b
                ${isScrolled ? "border-b shadow-sm dark:border-neutral-700" : ""}
            `}
            >
                <motion.div
                    layoutId="nav-width"
                    className={`mx-auto px-4 sm:px-6 w-full ${!isKomunitasPage ? "max-w-7xl" : ""}`}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                >
                    <div className="relative flex h-16 sm:h-16 items-center justify-between">
                        {/* Logo - Kiri */}
                        <div className="flex items-center shrink-0">
                            <Link href="/" className="flex items-center gap-2">
                                <Image
                                    src={logoLight}
                                    alt="Arunika Logo"
                                    className="block h-14 sm:h-20 w-auto dark:hidden"
                                    priority
                                />
                                <Image
                                    src={logoDark}
                                    alt="Arunika Logo"
                                    className="hidden h-14 sm:h-20 w-auto dark:block"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* Menu - Tengah (Desktop) */}
                        <div className="hidden lg:flex items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-x-6 xl:space-x-8">
                            <div
                                className="relative flex cursor-pointer items-center text-font-primary transition hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <span className="select-none font-medium text-sm xl:text-base">Fitur</span>
                                <motion.div
                                    className="ml-1.5"
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown size={18} />
                                </motion.div>
                            </div>

                            {NavbarList.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="font-medium text-sm xl:text-base text-font-primary transition hover:text-orange dark:text-gray-300 dark:hover:text-orange"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Actions - Kanan */}
                        <div className="flex items-center space-x-1 sm:space-x-2">
                            <LocaleSwitcher />
                            <ModeToggle />
                            {session ? (
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowLogoutDialog(true)}
                                    className="hidden lg:inline-flex text-sm"
                                >
                                    Logout
                                </Button>
                            ) : (
                                <Link
                                    href="/login"
                                    className="hidden lg:inline-flex items-center rounded-full bg-orange-500 px-4 xl:px-5 py-2 xl:py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
                                >
                                    Masuk
                                </Link>
                            )}
                            <button
                                className="lg:hidden p-2 text-font-primary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition"
                                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                                aria-label="Toggle menu"
                            >
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
                            className={`
          ${isHomePage ? "absolute left-0 right-0 z-50" : "absolute left-0 right-0 z-50"}
          border-t border-neutral-200 bg-white backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/95 shadow-sm
        `}
                        >
                            <div
                                className={`${isKomunitasPage ? "w-full px-4 sm:px-6" : "mx-auto max-w-7xl px-4 sm:px-6"} 
          grid grid-cols-3 gap-6 xl:gap-8 py-6 xl:py-8`}
                            >
                                {DropdownList.map((section) => (
                                    <div key={section.title}>
                                        <h4 className="mb-3 xl:mb-4 text-xs xl:text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-wide">
                                            {section.title}
                                        </h4>
                                        <ul className="space-y-2 xl:space-y-3">
                                            {section.items.map((item) => (
                                                <li key={item.href}>
                                                    <Link
                                                        href={item.href}
                                                        className="block text-sm text-gray-600 transition hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400 hover:translate-x-1 duration-200"
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

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-45 lg:hidden"
                            onClick={closeMobileMenu}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-full sm:w-80 bg-white dark:bg-neutral-900 z-50 lg:hidden overflow-y-auto shadow-2xl"
                        >
                            <div className="p-6">
                                {/* Close Button */}
                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Menu
                                    </span>
                                    <button
                                        onClick={closeMobileMenu}
                                        className="p-2 text-font-primary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition"
                                        aria-label="Close menu"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Navigation Links */}
                                <div className="space-y-1">
                                    {/* Fitur Dropdown */}
                                    <div>
                                        <button
                                            onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                                            className="w-full flex items-center justify-between py-3 px-4 text-font-primary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition font-medium"
                                        >
                                            <span>Fitur</span>
                                            <motion.div
                                                animate={{ rotate: isMobileDropdownOpen ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ChevronDown size={20} />
                                            </motion.div>
                                        </button>

                                        <AnimatePresence>
                                            {isMobileDropdownOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="py-2 px-4 space-y-4">
                                                        {DropdownList.map((section) => (
                                                            <div key={section.title}>
                                                                <h4 className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                                    {section.title}
                                                                </h4>
                                                                <ul className="space-y-1">
                                                                    {section.items.map((item) => (
                                                                        <li key={item.href}>
                                                                            <Link
                                                                                href={item.href}
                                                                                onClick={closeMobileMenu}
                                                                                className="block py-2 px-3 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-neutral-800/50 rounded transition"
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
                                    </div>

                                    {/* Other Links */}
                                    {NavbarList.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={closeMobileMenu}
                                            className="block py-3 px-4 text-font-primary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition font-medium"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>

                                {/* Auth Button */}
                                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-neutral-700">
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
                                        <Link
                                            href="/login"
                                            onClick={closeMobileMenu}
                                            className="block w-full text-center rounded-full bg-orange-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-orange-600"
                                        >
                                            Masuk
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}