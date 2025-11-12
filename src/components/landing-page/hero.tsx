import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useTranslations } from "next-intl";

import Link from "next/link";
import Image from "next/image";
import PinMapDesign from "@/components/pin-map-design";
import SquarePinMap from "@/components/square-pin-map";

import map from "@/assets/svg/map.svg";
import pinmap1 from "@/assets/images/pin-map2.jpg";
import pinmap2 from "@/assets/images/pin-map3.jpg";
import pinmap3 from "@/assets/images/pin-map4.jpg";
import pinmap4 from "@/assets/images/pin-map5.jpg";
import pinmap5 from "@/assets/images/pin-map6.jpg";
import pinmap6 from "@/assets/images/pin-map7.jpg";
import pinmapsquare from "@/assets/images/square-pin.jpg";
import { ArrowUpRight } from "lucide-react";

const HeroSection = () => {
  const ref = useRef(null);
  const t = useTranslations("HomePage");

  const title = t.raw("title");
  const parts = title.split(/<highlight>|<\/highlight>/g);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const mapY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const blurY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div className="overflow-x-hidden">
      <div
        ref={ref}
        className="relative flex h-screen flex-col items-center justify-center gap-52 overflow-hidden"
      >
        <motion.div
          style={{ y: mapY }}
          className="pointer-events-none absolute inset-0 bottom-40"
        >
          <div className="relative h-full w-full overflow-hidden md:h-screen">
            <Image
              src={map}
              alt="map"
              draggable={false}
              loading="eager"
              fill
              className="transform-gpu object-contain object-top select-none md:object-contain"
              priority
            />

            {/* Pin map */}
            <PinMapDesign src={pinmap1} className="bottom-[57%] left-[15.5%]" />
            <PinMapDesign src={pinmap2} className="bottom-[36%] left-[34.5%]" />
            <SquarePinMap
              src={pinmapsquare}
              className="bottom-[28.5%] left-[43%]"
            />
            <PinMapDesign src={pinmap3} className="right-[38%] bottom-[53%]" />
            <PinMapDesign src={pinmap6} className="right-[15%] bottom-[65%]" />
            <PinMapDesign src={pinmap5} className="right-[2%] bottom-[61%]" />
            <PinMapDesign src={pinmap4} className="right-[5%] bottom-[52%]" />
          </div>
        </motion.div>

        <motion.div
          style={{ y: blurY }}
          className="pointer-events-none absolute top-0 left-1/2 h-[72vh] w-[200vw] -translate-x-1/2 rounded-[50%] bg-[#fffefe] blur-3xl dark:bg-[#1a1a1a]"
        />

        <div className="absolute top-[14%] right-[7%]">
          <svg
            width="106"
            height="126"
            viewBox="0 0 106 126"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 93.7454C34.5652 143.627 69.9253 124.071 73.6696 93.7454C77.1796 65.3186 51.906 50.0689 36.4728 51.9765C21.7903 53.7913 21.2125 72.0027 34.5652 72.0027C50.8149 72.0027 58 51.9765 62.5 47.435"
              stroke="#FFA559"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="7 7"
            />
            <path
              d="M104 1.43501L59.1849 14.8259C58.2352 15.1097 58.2326 16.4538 59.1813 16.7411L69.4861 19.8622M104 1.43501L69.4861 19.8622M104 1.43501L98.5959 28.2241C98.3534 29.4263 97.0959 30.129 95.9449 29.7056L81.5524 24.4107M104 1.43501L78.5234 23.2963M69.4861 19.8622V35.935M78.5234 23.2963L69.4861 35.935M78.5234 23.2963L81.5524 24.4107M69.4861 35.935L81.5524 24.4107"
              stroke="#FFA559"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="relative mx-auto mb-40 flex max-w-7xl flex-col items-center justify-center gap-6 px-4">
          <h1 className="w-[1100px] text-center text-5xl leading-tight font-extrabold">
            {parts.map((part: string, i: any) =>
              i % 2 === 1 ? (
                <span key={i} className="text-green-lime-dark">
                  {part}
                </span>
              ) : (
                part
              ),
            )}
          </h1>
          <p className="max-w-[749px] text-center">{t("description")}</p>
            <Link
            href={"/jelajahi-nusantara"}
            className="bg-orange flex items-center justify-center gap-3 rounded-full py-1 pr-1 pl-4 font-normal text-white"
            >
            {t("button")}{""}
            <span className="text-orange flex h-9 w-9 items-center justify-center rounded-full bg-white">
              <ArrowUpRight size={28} />
            </span>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
