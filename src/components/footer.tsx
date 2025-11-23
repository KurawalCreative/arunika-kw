"use client";

import { Facebook, Github, Instagram, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

import logoLight from "@/assets/svg/logo-light.svg";
import logoDark from "@/assets/svg/logo-dark.svg";

const FooterSection = () => {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        const darkEnabled = saved === "dark";

        document.documentElement.classList.toggle("dark", darkEnabled);
        setIsDark(darkEnabled);

        const updateTheme = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

        return () => observer.disconnect();
    }, []);

    return (
        <footer className="text-text-primary w-full border-t border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 md:grid-cols-2">
                {/* Kolom Kiri: Logo + Social */}
                <div className="flex flex-col gap-4">
                    <Link href="/" className="flex items-center">
                        <Image src={!mounted ? logoDark : isDark ? logoDark : logoLight} alt="adatry Logo" className="h-8 w-auto" priority />
                    </Link>

                    <p className="max-w-xl text-start text-sm leading-relaxed text-gray-600 dark:text-gray-400">Adatry tempat kamu bisa pakai ratusan pakaian adat Indonesia hanya dengan upload foto. Dari Sabang sampai Merauke, satu klik jadi kebanggaan Nusantara.</p>

                    <div className="text-text-primary flex items-center gap-4">
                        <Link href="mailto:hello@adatry.com" className="hover:text-[#1A73E8]">
                            <Mail size={20} />
                        </Link>
                        <Link href="https://github.com" className="hover:text-[#181717]">
                            <Github size={20} />
                        </Link>
                    </div>
                </div>

                {/* Kolom Navigasi */}
                <div className="text-left md:text-end">
                    <h3 className="mb-3 text-base font-semibold sm:text-lg">Navigasi</h3>
                    <ul className="space-y-2 text-sm text-gray-600 sm:text-base dark:text-gray-400">
                        <li>
                            <Link href="/jelajahi-nusantara" className="hover:text-green-lime-dark dark:hover:text-green-400">
                                Jelajahi Nusantara
                            </Link>
                        </li>
                        <li>
                            <Link href="/tentang" className="hover:text-green-lime-dark dark:hover:text-green-400">
                                Tentang
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-neutral-300 py-4 text-center text-xs text-gray-500 sm:text-sm dark:border-neutral-700 dark:text-gray-500">© {new Date().getFullYear()} Adatry. All rights reserved.</div>
        </footer>
    );
};

export default FooterSection;
