"use client";

import "swiper/css";
import "swiper/css/effect-fade";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { motion } from "motion/react";
import { useCarouselStore } from "@/store/carouselStore";

import login1 from "@/assets/images/culture-bali.jpg";
import login2 from "@/assets/images/culture-dance.jpg";
import login3 from "@/assets/images/culture-dress.jpg";

const carouselImage = [login1, login2, login3];

export default function AuthCarousel() {
    const { activeIndex, setActiveIndex } = useCarouselStore();

    return (
        <motion.div className="hidden w-full max-w-md items-center justify-center py-5 pr-5 lg:flex" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}>
            <Swiper
                modules={[Autoplay, EffectFade]}
                effect="fade"
                loop={true}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                initialSlide={activeIndex}
                className="h-full w-full rounded-xl"
            >
                {carouselImage.map((img, idx) => (
                    <SwiperSlide key={idx}>
                        <div className="relative h-full w-full">
                            <img src={img.src} className="h-full w-full scale-105 object-cover transition-transform duration-4000 ease-in-out" style={{ filter: "brightness(0.85)" }} />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </motion.div>
    );
}
