import Image from "next/image";
import Link from "next/link";

import ctaMap from "@/assets/svg/cta-map.svg";

const CtaSection = () => {
    return (
        <section className="py-20">
            <div className="mx-auto w-full max-w-7xl">
                <div className="text-text-primary text-center dark:text-white">
                    <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
                        Siap Menjelajah <span className="text-primary-blue dark:text-blue-400">Budaya Nusantara?</span>
                    </h1>
                    <p className="text-text-secondary mt-2 leading-relaxed font-medium dark:text-gray-300">Yuk mulai petualanganmu dan temukan kekayaan Indonesia dengan cara yang seru dan interaktif!</p>
                    <Link href="/" className="bg-primary-blue hover:bg-primary-blue-hover mt-4 inline-flex items-center gap-3 rounded-full px-5 py-2 font-medium text-white transition-all dark:bg-blue-600 dark:hover:bg-blue-700">
                        Menjelajah Nusantara
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CtaSection;
