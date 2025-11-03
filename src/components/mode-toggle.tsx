'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { motion } from 'framer-motion'

export function ModeToggle() {
    const { setTheme, theme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    className="relative rounded-full bg-transparent text-gray-700 dark:text-gray-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all shadow-none"
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] text-orange-500 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] text-orange-400 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-36 rounded-xl p-2 shadow-md bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md transition-all"
            >
                {['light', 'dark', 'system'].map((mode) => (
                    <motion.div
                        key={mode}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.1 }}
                    >
                        <DropdownMenuItem
                            onClick={() => setTheme(mode)}
                            className={`capitalize cursor-pointer rounded-md px-3 py-2 text-sm transition-all ${theme === mode
                                ? 'bg-neutral-200 dark:bg-neutral-800 text-orange-500'
                                : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                }`}
                        >
                            {mode}
                        </DropdownMenuItem>
                    </motion.div>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
