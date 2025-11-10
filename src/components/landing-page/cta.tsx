import Image from "next/image";
import Link from "next/link";

import ctaMap from "@/assets/svg/cta-map.svg";

const CtaSection = () => {
  return (
    <section className="py-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="text-text-primary text-center ">
          <h1 className="text-3xl font-semibold">
            Siap Menjelajah <span className="text-primary-blue">Budaya Nusantara?</span>
          </h1>
          <p className="mt-2 font-medium text-text-secondary leading-relaxed">
            Yuk mulai petualanganmu dan temukan kekayaan Indonesia dengan cara
            yang seru dan interaktif!
          </p>
          <Link
            href="/"
            className="bg-primary-blue hover:bg-primary-blue-hover mt-4 inline-flex items-center gap-3 rounded-full px-5 py-2 font-medium text-white transition-all"
          >
            Menjelajah Nusantara
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
