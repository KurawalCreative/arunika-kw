"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function LocaleSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (newLocale: string) => {
        if (newLocale !== locale) {
            router.replace(pathname, { locale: newLocale });
        }
    };

    const languages = [
        { code: "id", label: "Indonesia" },
        { code: "jv", label: "Jawa" },
        { code: "su", label: "Sunda" },
        { code: "bt", label: "Batak" },
        { code: "ba", label: "Bali" },
        { code: "bug", label: "Bugis" },
        { code: "min", label: "Minangkabau" },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" className="text-text-primary relative flex items-center justify-center rounded-lg bg-transparent shadow-none transition-all hover:bg-neutral-100 dark:text-gray-200 dark:hover:bg-neutral-800">
                    <Globe className="text-text-primary h-4 w-4 dark:text-white" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44 rounded-xl bg-white/90 p-2 shadow-md backdrop-blur-md transition-all dark:bg-neutral-900/90">
                {languages.map((lang) => (
                    <motion.div key={lang.code} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
                        <DropdownMenuItem onClick={() => switchLocale(lang.code)} className={`cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-all ${locale === lang.code ? "text-primary-blue bg-neutral-200 dark:bg-neutral-800" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>
                            {lang.label}
                        </DropdownMenuItem>
                    </motion.div>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
