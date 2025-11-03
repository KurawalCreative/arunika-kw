'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import LocaleSwitcher from './locale-switcher'
import { ModeToggle } from './mode-toggle'
import NavDropdown from './ui/nav-dropdown'

export default function NavbarArunika() {
    return (
        <nav className="fixed top-4 left-1/2 z-50 w-[90%] -translate-x-1/2 flex items-center justify-between rounded-2xl border bg-white/70 px-6 py-3 shadow-md backdrop-blur-md dark:bg-neutral-900/70 dark:border-neutral-700 transition-all">
            {/* Left */}
            <Link href="/" className="flex items-center space-x-3 font-semibold text-lg">
                Arunika
            </Link>

            {/* Center */}
            <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center space-x-8 text-[0.95rem] font-medium text-gray-700 dark:text-gray-200">
                <NavDropdown />
                <Link
                    href="/tentang"
                    className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                    Tentang Kami
                </Link>
            </div>

            {/* Right */}
            <div className="flex items-center space-x-3">
                <LocaleSwitcher />
                <ModeToggle />

                <Button className="rounded-full bg-orange-500 px-5 text-white font-sm shadow-sm hover:opacity-90 transition-all">
                    Masuk
                </Button>
            </div>
        </nav>
    )
}
