'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

import raniBahagia from '@/assets/rani/rani-bahagia.svg'
import raniBercanda from '@/assets/rani/rani-bercanda.svg'
import raniBingung from '@/assets/rani/rani-bingung.svg'
import raniTerkejut from '@/assets/rani/rani-terkejut.svg'
import raniMarah from '@/assets/rani/rani-marah.svg'
import raniSedih from '@/assets/rani/rani-sedih.svg'

const expressions = [
    { mood: 'happy', src: raniBahagia },
    { mood: 'joke', src: raniBercanda },
    { mood: 'confused', src: raniBingung },
    { mood: 'surprised', src: raniTerkejut },
    { mood: 'angry', src: raniMarah },
    { mood: 'sad', src: raniSedih },
]

const randomChats = [
    'Hai! Lagi ngapain nih? 😊',
    'Hmm... aku mikir sesuatu deh 🤔',
    'Kamu kelihatan capek, istirahat ya~ 💭',
    'Hehehe kamu lucu deh 😆',
    'Wah! Seriusan?! 😲',
    'Aku jadi bingung nih... 😅',
    'Jangan lupa minum air putih ya! 💧',
    'Semangat! Kamu pasti bisa! 💪',
    'Cuaca hari ini cerah banget! ☀️',
    'Udah makan belum? 🍜',
    'Istirahat dulu yuk~ 🌙',
    'Hari ini produktif ga? 📝',
]

const RaniChatCompanion = () => {
    const [currentMood, setCurrentMood] = useState(expressions[0])
    const [currentChat, setCurrentChat] = useState('')
    const [showChat, setShowChat] = useState(false)
    const [isClickable, setIsClickable] = useState(true)

    const usedChatIndices = useRef<number[]>([])
    const chatTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const scheduleTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const getNextChatIndex = () => {
        if (usedChatIndices.current.length >= randomChats.length) {
            usedChatIndices.current = []
        }
        const available = randomChats.map((_, i) => i).filter(i => !usedChatIndices.current.includes(i))
        const randomIndex = available[Math.floor(Math.random() * available.length)]
        usedChatIndices.current.push(randomIndex)
        return randomIndex
    }

    const showNewChat = () => {
        const chatIndex = getNextChatIndex()
        const newChat = randomChats[chatIndex]
        const randomExpression = expressions[Math.floor(Math.random() * expressions.length)]

        setCurrentMood(randomExpression)
        setCurrentChat(newChat)
        setShowChat(true)

        if (chatTimeoutRef.current) clearTimeout(chatTimeoutRef.current)
        chatTimeoutRef.current = setTimeout(() => {
            setShowChat(false)
            setCurrentChat('')
            setCurrentMood(expressions[0])
        }, 30000)
    }

    const scheduleNextChat = () => {
        if (scheduleTimeoutRef.current) clearTimeout(scheduleTimeoutRef.current)
        const randomInterval = 180000 + Math.random() * 120000 // 3–5 menit
        scheduleTimeoutRef.current = setTimeout(() => {
            showNewChat()
            scheduleNextChat()
        }, randomInterval)
    }

    const handleClick = () => {
        if (!isClickable) return
        setIsClickable(false)
        setCurrentMood(expressions.find(e => e.mood === 'joke')!)
        setCurrentChat('Ada apa sih? 😜')
        setShowChat(true)

        setTimeout(() => {
            setShowChat(false)
            setCurrentChat('')
            setCurrentMood(expressions[0])
            setIsClickable(true)
        }, 4000)
    }

    useEffect(() => {
        scheduleNextChat()
        return () => {
            if (chatTimeoutRef.current) clearTimeout(chatTimeoutRef.current)
            if (scheduleTimeoutRef.current) clearTimeout(scheduleTimeoutRef.current)
        }
    }, [])

    return (
        <div className="fixed bottom-8 right-8 z-50 select-none">
            <div className="flex items-end gap-3">
                {/* Bubble Chat */}
                <AnimatePresence mode="wait">
                    {showChat && (
                        <motion.div
                            key={currentChat}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3 }}
                            className="relative"
                        >
                            <div className="relative bottom-16 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl rounded-br-none px-4 py-3 shadow-md max-w-60 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
                                <p className="text-sm leading-relaxed font-medium">{currentChat}</p>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Wajah Rani */}
                <motion.div
                    key={currentMood.mood}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative shrink-0 cursor-pointer"
                    onClick={handleClick}
                >
                    {/* Glow animasi */}
                    <motion.div
                        className="absolute inset-0 rounded-full blur-2xl"
                        style={{
                            background: 'radial-gradient(circle, rgba(255,180,200,0.6), transparent 70%)',
                            zIndex: -1,
                        }}
                        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    <Image
                        src={currentMood.src}
                        alt={currentMood.mood}
                        width={80}
                        height={80}
                        className="object-contain transition-transform duration-200 hover:scale-105"
                    />
                </motion.div>
            </div>
        </div>
    )
}

export default RaniChatCompanion
