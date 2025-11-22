"use client";

import Image, { StaticImageData } from "next/image";

type PinMapDesignProps = {
    src: string | StaticImageData;
    className?: string;
};

const PinMapDesign = ({ src, className }: PinMapDesignProps) => {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className="flex h-8 w-6 sm:h-12 sm:w-9 md:h-16 md:w-11 lg:h-20 lg:w-14">
                <svg viewBox="0 0 100 140" className="h-full w-full drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 10 C30 10, 15 30, 15 50 C15 75, 35 100, 48 122 Q50 128, 52 122 C65 100, 85 75, 85 50 C85 30, 70 10, 50 10Z" fill="white" stroke="white" strokeWidth="2" />

                    <foreignObject x="25" y="25" width="50" height="50">
                        <div className="flex h-full w-full rounded-full">
                            <Image src={src} alt="pinmap" className="aspect-square flex-1 rounded-full object-fill" sizes="250px" />
                        </div>
                    </foreignObject>
                </svg>

                {/* <div className="bg-green-lime-dark/20 absolute bottom-1 left-1/2 h-3 w-10 -translate-x-1/2 rounded-full blur-md" /> */}
            </div>
        </div>
    );
};

export default PinMapDesign;
