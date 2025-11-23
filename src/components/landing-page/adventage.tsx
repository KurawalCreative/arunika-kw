"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const AnimatedNumber = ({ targetValue, suffix = "+" }: { targetValue: number; suffix?: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            const duration = 2000; // 2 seconds
            const steps = 60; // 60 FPS
            const increment = targetValue / steps;
            const stepDuration = duration / steps;

            let currentCount = 0;
            const timer = setInterval(() => {
                currentCount += increment;
                if (currentCount >= targetValue) {
                    setCount(targetValue);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(currentCount));
                }
            }, stepDuration);

            return () => clearInterval(timer);
        }
    }, [isInView, targetValue]);

    // Format number with dots for thousands
    const formatNumber = (num: number) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <span ref={ref}>
            {formatNumber(count)}
            {suffix}
        </span>
    );
};

const adventage = [
    {
        id: 1,
        value: 38,
        color: "#5DD39E",
        describe: "Provinsi dari Sabang sampai Merauke",
    },
    {
        id: 2,
        value: 700,
        color: "#3ABEFF",
        describe: "Pakaian Adat yang Bisa Dicoba",
    },
    {
        id: 3,
        value: 1340,
        color: "#FF8C42",
        describe: "Suku dengan Busana Khasnya",
    },
    {
        id: 4,
        value: 500,
        color: "#FF6B6B",
        describe: "Kisah & Makna di Setiap Jahitan",
    },
];

const AdventagesSection = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
        },
    };

    return (
        <section className="mx-auto flex w-full max-w-7xl justify-center px-4 py-20">
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex w-full flex-col justify-between gap-8 sm:flex-row sm:gap-4">
                {adventage.map((v, i) => (
                    <motion.div key={i} variants={itemVariants} transition={{ duration: 0.5, ease: "easeOut" }} className="flex flex-1 flex-col items-center text-center">
                        <h1 className="text-2xl font-semibold text-neutral-800 sm:text-3xl dark:text-neutral-100">
                            <AnimatedNumber targetValue={v.value} />
                        </h1>
                        <hr className="my-2 h-0.5 w-16 rounded-full border-none sm:w-20" style={{ backgroundColor: v.color }} />
                        <p className="text-sm text-neutral-700 sm:text-base dark:text-neutral-100">{v.describe}</p>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default AdventagesSection;
