"use client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "./animated-list";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

interface Item {
    name: string;
    description: string;
    icon: string;
    color: string;
    time: string;
    avatar: string;
}

let notifications = [
    {
        name: "Sarah Johnson",
        description: "Berhasil login dengan Google",
        time: "Baru saja",
        icon: "🔐",
        color: "#4285F4",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
        name: "Ahmad Rizki",
        description: "Berhasil login",
        time: "2m yang lalu",
        icon: "�",
        color: "#1877F2",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
    },
    {
        name: "Jessica Lee",
        description: "Berhasil login dengan Email",
        time: "5m yang lalu",
        icon: "✅",
        color: "#24292e",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    },
    {
        name: "Budi Santoso",
        description: "Berhasil login dengan Email",
        time: "8m yang lalu",
        icon: "�",
        color: "#34A853",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
    },
    {
        name: "Maria Garcia",
        description: "Berhasil login dengan Google",
        time: "12m yang lalu",
        icon: "�",
        color: "#4285F4",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    },
    {
        name: "Kevin Tan",
        description: "Berhasil login dengan Email",
        time: "15m yang lalu",
        icon: "�",
        color: "#1DA1F2",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin",
    },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({ name, description, icon, color, time, avatar }: Item) => {
    return (
        <figure
            className={cn(
                "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
                // animation styles
                "transition-all duration-200 ease-in-out hover:scale-[103%]",
                // light styles
                "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
                // dark styles
                "transform-gpu dark:bg-transparent dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)]",
            )}
        >
            <div className="flex flex-row items-center gap-3">
                <div className="relative">
                    <img src={avatar} alt={name} className="size-12 rounded-full ring-2 ring-white dark:ring-gray-800" />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <figcaption className="flex flex-row items-center text-lg font-medium whitespace-pre dark:text-white">
                        <span className="text-sm font-semibold sm:text-base">{name}</span>
                        <span className="mx-1">·</span>
                        <span className="text-xs text-gray-500">{time}</span>
                    </figcaption>
                    <p className="text-xs font-normal text-gray-600 sm:text-sm dark:text-white/60">{description}</p>
                </div>
            </div>
        </figure>
    );
};

export function Step1({ className }: { className?: string }) {
    return (
        <div className={cn("relative flex h-[500px] w-full flex-col overflow-hidden p-2", className)}>
            <AnimatedList>
                {notifications.map((item, idx) => (
                    <Notification {...item} key={idx} />
                ))}
            </AnimatedList>
            <ProgressiveBlur height="40%" position="bottom" />
            <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t"></div>
        </div>
    );
}
