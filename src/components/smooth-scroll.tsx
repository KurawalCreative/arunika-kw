"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
    useEffect(() => {
        let lenis: any = null;

        const initSmoothScroll = async () => {
            lenis = new Lenis({
                autoRaf: true,
            });
        };

        initSmoothScroll();

        return () => {
            if (lenis) {
                lenis.destroy();
            }
        };
    }, []);

    return null;
}
