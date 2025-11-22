"use client";

import FooterSection from "@/components/footer";
import AdventagesSection from "@/components/landing-page/adventage";
import CtaSection from "@/components/landing-page/cta";
import FeaturesSection from "@/components/landing-page/features";
import HeroSection from "@/components/landing-page/hero";
import HowItWorksSection from "@/components/landing-page/how-it-works";
import KnowUsSection from "@/components/landing-page/know-us";
import WhatCanLearnSection from "@/components/landing-page/what-can-learn";
import NavbarArunika from "@/components/navbar";

export default function Home() {
    return (
        <>
            <NavbarArunika />
            <HeroSection />
            <AdventagesSection />
            <KnowUsSection />
            <WhatCanLearnSection />
            <HowItWorksSection />
            <FeaturesSection />
            <CtaSection />
            <FooterSection />
        </>
    );
}
