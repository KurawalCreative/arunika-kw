import { PixelImage } from "@/components/ui/shadcn-io/pixel-image";
import { useState, useEffect } from "react";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import budisusanto from "@/assets/images/budisusanto.png";
import siti from "@/assets/images/siti.png";
import agus from "@/assets/images/agus.png";

const images = [budisusanto.src, siti.src, agus.src];

const profiles = [
    {
        avatar: "https://i.pravatar.cc/150?img=1",
        name: "Budi Santoso",
        username: "@budisan",
        comment: "Baru coba AI Try-On pakaian adat Jawa! Keren banget hasilnya, kayak beneran pakai kebaya dan batik 🤩",
        time: "2j",
    },
    {
        avatar: "https://i.pravatar.cc/150?img=2",
        name: "Siti Nurhaliza",
        username: "@sitinur",
        comment: "Asli kaget! Pakai baju adat Padang langsung serasa di Minang. AI-nya detail banget!",
        time: "4j",
    },
    {
        avatar: "https://i.pravatar.cc/150?img=3",
        name: "Agus Wijaya",
        username: "@agusw",
        comment: "Try-On pakaian adat Bali mantap! Udeng sama kamennya pas banget, teknologi emang canggih ya 👍",
        time: "6j",
    },
    {
        avatar: "https://i.pravatar.cc/150?img=4",
        name: "Dewi Lestari",
        username: "@dewiles",
        comment: "Gak nyangka bisa nyoba baju adat Aceh tanpa harus ke sana! AI-nya bikin penasaran coba semua daerah 😍",
        time: "8j",
    },
];

const Step4 = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
            setLiked(false);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mx-auto max-w-xl bg-white">
            <div className="border-gray-200 p-4">
                <div className="flex space-x-3">
                    <img src={profiles[currentIndex].avatar} alt="Avatar" className="h-10 w-10 rounded-full" />
                    <div className="flex-1 text-base">
                        <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-900">{profiles[currentIndex].name}</span>
                            <span className="text-gray-500">{profiles[currentIndex].username}</span>
                            <span className="text-gray-500">·</span>
                            <span className="text-gray-500">{profiles[currentIndex].time}</span>
                        </div>
                        <p className="mt-2 text-gray-900">{profiles[currentIndex].comment}</p>

                        <div className="mt-3">
                            <PixelImage key={currentIndex} src={images[currentIndex]} grid="6x4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step4;
