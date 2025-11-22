import Image, { StaticImageData } from "next/image";

type SquarePinMapProps = {
    src: string | StaticImageData;
    className?: string;
};

const SquarePinMap = ({ src, className }: SquarePinMapProps) => {
    return (
        <div className={`flex flex-col items-center ${className}`}>
            <svg viewBox="0 0 140 180" className="h-16 w-12 drop-shadow-lg sm:h-20 sm:w-16 md:h-30 md:w-24 lg:h-36 lg:w-30 xl:h-44 xl:w-36" xmlns="http://www.w3.org/2000/svg">
                <path
                    d={`M20 10
               L120 10
               Q130 10, 130 20
               L130 120
               Q130 130, 120 130
               L78 130
               Q70 150, 62 130
               L20 130
               Q10 130, 10 120
               L10 20
               Q10 10, 20 10Z`.trim()}
                    fill="white"
                    stroke="white"
                    strokeWidth="1.2"
                />

                <foreignObject x="15" y="15" width="110" height="105">
                    <div className="flex h-full w-full overflow-hidden rounded-md">
                        <Image src={src} alt="pin map" className="h-full w-full flex-1 object-fill" sizes="250px" />
                    </div>
                </foreignObject>
            </svg>

            {/* Bayangan lembut di bawah pin */}
            <div className="absolute bottom-0 left-1/2 h-3 w-10 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-md" />
        </div>
    );
};

export default SquarePinMap;
