"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import LocaleSwitcher from "./locale-switcher";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";

import logoWhite from "@/assets/svg/logo-white.svg";
import logoDark from "@/assets/svg/logo-dark.svg";
import Image from "next/image";

export default function NavbarArunika() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
            className="fixed top-4 left-1/2 z-50 w-full max-w-7xl -translate-x-1/2 border bg-white/70 pl-6 shadow-sm backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/70 rounded-4xl overflow-hidden"
            animate={{
                height: isExpanded ? "320px" : "56px",
            }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        >
            {/* Navbar */}
            <div className="grid grid-cols-3 items-center h-14 gap-4">
                {/* Left */}
                <Link href="/" className="flex items-center gap-2">
                    {/* Logo untuk mode terang */}
                    <Image
                        src={logoWhite}
                        alt="Arunika Logo"
                        className="block dark:hidden h-12 w-auto"
                        priority
                    />
                    {/* Logo untuk mode gelap */}
                    <Image
                        src={logoDark}
                        alt="Arunika Logo"
                        className="hidden dark:block h-12 w-auto"
                        priority
                    />
                </Link>

                {/* Center */}
                <div className="hidden md:flex items-center justify-center space-x-8">
                    <div
                        className="relative flex items-center text-gray-600 dark:text-gray-300 hover:text-orange-500 transition cursor-pointer"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <span className="select-none">Fitur</span>
                        <motion.div
                            className="ml-2"
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown size={18} />
                        </motion.div>
                    </div>

                    <Link
                        href="#"
                        className="text-gray-600 dark:text-gray-300 hover:text-orange-500 transition"
                    >
                        Tentang
                    </Link>
                    <Link
                        href="#"
                        className="text-gray-600 dark:text-gray-300 hover:text-orange-500 transition"
                    >
                        Kontak
                    </Link>
                </div>

                {/* Right Section: Utilities */}
                <div className="flex items-center justify-end space-x-3">
                    <LocaleSwitcher />
                    <ModeToggle />
                    <Button className="hidden md:flex rounded-full bg-orange-500 px-5 text-white hover:opacity-90 transition-all">
                        Masuk
                    </Button>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-muted"
                        onClick={() => setIsMobileMenuOpen((s) => !s)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Dropdown */}
            <div
                className={`hidden md:block border-gray-100 dark:border-gray-800 pt-5 pb-5 transition-all`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                aria-hidden={!isExpanded}
            >
                <div
                    className={`grid grid-cols-3 gap-6 px-4 transform transition-transform duration-200
                        ${isExpanded ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none"}`}
                >
                    <div>
                        <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">
                            Produk
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <li>
                                <Link href="#" className="hover:text-orange-500 transition">
                                    Arunika AI
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-orange-500 transition">
                                    Peta Budaya
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-orange-500 transition">
                                    Koleksi Interaktif
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">
                            Perusahaan
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <li>
                                <Link href="#" className="hover:text-orange-500 transition">
                                    Tentang Kami
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-orange-500 transition">
                                    Karier
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-orange-500 transition">
                                    Kontak
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">
                            Ikuti Kami
                        </h4>
                        <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Link href="#" className="hover:text-orange-500 transition">
                                Instagram
                            </Link>
                            <Link href="#" className="hover:text-orange-500 transition">
                                LinkedIn
                            </Link>
                            <Link href="#" className="hover:text-orange-500 transition">
                                YouTube
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4 px-4 space-y-3"
                    >
                        <details className="group">
                            <summary className="flex items-center gap-1 cursor-pointer py-2 text-gray-800 dark:text-gray-100">
                                Fitur
                                <ChevronDown
                                    size={18}
                                    className="transition-transform group-open:rotate-180"
                                />
                            </summary>
                            <div className="ml-4 mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                <Link href="#" className="block hover:text-orange-500 transition">
                                    Arunika AI
                                </Link>
                                <Link href="#" className="block hover:text-orange-500 transition">
                                    Peta Budaya
                                </Link>
                                <Link href="#" className="block hover:text-orange-500 transition">
                                    Koleksi Interaktif
                                </Link>
                            </div>
                        </details>

                        <Link
                            href="#"
                            className="block py-2 text-gray-800 dark:text-gray-100 hover:text-orange-500 transition"
                        >
                            Tentang
                        </Link>
                        <Link
                            href="#"
                            className="block py-2 text-gray-800 dark:text-gray-100 hover:text-orange-500 transition"
                        >
                            Kontak
                        </Link>
                        <Button className="w-full rounded-full bg-orange-500 text-white hover:opacity-90">
                            Masuk
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
