import Image from "next/image";
import Link from "next/link";

import ctaMap from "@/assets/svg/cta-map.svg";
import logo from "@/assets/svg/logo.svg";

const CtaSection = () => {
    return (
        <section className="rounded-md px-4 py-14">
            <div className="relative mx-auto w-full max-w-7xl overflow-hidden">
                <div className="absolute -top-24 -left-24 z-10 -rotate-45 transform rounded-tl-md">
                    <Image alt="logo" src={logo} draggable="false" className="h-80 w-80" />
                </div>
                <div className="text-text-primary relative rounded-md border-2 border-dashed border-[#345063] bg-white p-16 text-center dark:border-gray-600 dark:bg-gray-900 dark:text-white">
                    <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white">
                        Siap Menjelajah <span className="text-primary-blue dark:text-blue-400">Budaya Nusantara?</span>
                    </h1>
                    <p className="text-text-secondary mx-auto mt-2 max-w-2xl text-base leading-relaxed font-medium sm:text-lg dark:text-gray-300">Yuk mulai petualanganmu dan temukan kekayaan Indonesia dengan cara yang seru dan interaktif!</p>
                    <Link href="/" className="bg-primary-blue hover:bg-primary-blue-hover mt-6 inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm font-medium text-white transition-all sm:mt-4 sm:px-5 sm:text-base dark:bg-blue-600 dark:hover:bg-blue-700">
                        Menjelajah Nusantara
                    </Link>
                </div>
                <div className="absolute -right-24 -bottom-24 z-10 rotate-135 transform">
                    <Image alt="logo" src={logo} draggable="false" className="h-80 w-80" />
                </div>
            </div>
        </section>
    );
};

export default CtaSection;
