"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import LocaleSwitcher from "./locale-switcher";
import { ModeToggle } from "./mode-toggle";
import NavDropdown from "./ui/nav-dropdown";

export default function NavbarArunika() {
  return (
    <nav className="fixed top-4 left-1/2 z-50 flex w-[90%] -translate-x-1/2 items-center justify-between rounded-full border bg-white/70 px-6 py-3 shadow-xs backdrop-blur-md transition-all dark:border-neutral-700 dark:bg-neutral-900/70">
      {/* Left */}
      <NavDropdown />

      <div className="absolute left-1/2 hidden -translate-x-1/2 items-center space-x-8 text-[0.95rem] font-medium text-gray-700 md:flex dark:text-gray-200">
        <Link
          href="/"
          className="flex items-center space-x-3 text-lg font-semibold"
        >
          Arunika
        </Link>
      </div>
      {/* Right */}
      <div className="flex items-center space-x-3">
        <LocaleSwitcher />
        <ModeToggle />

        <Button className="font-sm rounded-full bg-orange-500 px-5 text-white shadow-sm transition-all hover:opacity-90">
          Masuk
        </Button>
      </div>
    </nav>
  );
}
