'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Map, History, BookOpen, Gift, User } from 'lucide-react'
import NavMenuItem from '@/components/ui/nav-menu'

const NavDropdown = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [hovering, setHovering] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setIsOpen(true)
        setHovering(true)
    }

    const handleLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setHovering(false)
            setIsOpen(false)
        }, 150)
    }

    return (
        <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            <button className="flex items-center space-x-1 hover:text-green-700 dark:hover:text-green-400 transition-colors">
                <span>Eksplorasi</span>
                <ChevronDown className="w-4 h-4" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="absolute left-1/2 -translate-x-1/2 mt-5 w-[540px] bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 z-40"
                        onMouseEnter={handleEnter}
                        onMouseLeave={handleLeave}
                    >
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <NavMenuItem
                                    icon={<Map />}
                                    title="Peta Interaktif"
                                    desc="Jelajahi budaya lewat peta digital."
                                    href="/jelajahi-nusantara"
                                />
                                <NavMenuItem
                                    icon={<History />}
                                    title="Riwayat Kuis"
                                    desc="Lihat progres dan skor perjalananmu."
                                    href="/riwayat"
                                />
                                <NavMenuItem
                                    icon={<BookOpen />}
                                    title="Cerita Budaya"
                                    desc="Temukan kisah dan sejarah menarik."
                                    href="/cerita"
                                />
                            </div>
                            <div className="space-y-4">
                                <NavMenuItem
                                    icon={<Gift />}
                                    title="Hadiah & Reward"
                                    desc="Kumpulkan poin dari eksplorasimu."
                                    href="/hadiah"
                                />
                                <NavMenuItem
                                    icon={<User />}
                                    title="Profil Budayawan"
                                    desc="Bangun identitas dan pencapaianmu."
                                    href="/profil"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default NavDropdown
