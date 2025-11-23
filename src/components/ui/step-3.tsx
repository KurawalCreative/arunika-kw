import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import ulebalang from "@/assets/images/ulebalang.jpg";
import kebaya from "@/assets/images/kebaya.jpg";
import payas from "@/assets/images/payas.jpg";
import songket from "@/assets/images/songket.jpg";
export function Step3() {
    const testimonials = [
        {
            quote: "Melambangkan keagungan dan kemewahan kerajaan Islam Aceh. Penuh dengan sulaman benang emas yang mencerminkan kejayaan maritim Nusantara di masa lampau.",
            name: "Ulee Balang",
            designation: "Aceh, Sumatera",
            src: ulebalang.src,
        },
        {
            quote: "Simbol kesopanan dan kelembutan budaya Jawa. Motif batiknya mengandung filosofi kehidupan tentang keseimbangan antara dunia dan akhirat.",
            name: "Kebaya Jawa",
            designation: "Yogyakarta & Jawa Tengah",
            src: kebaya.src,
        },
        {
            quote: "Mencerminkan spiritualitas tinggi masyarakat Bali. Setiap detail kain dan warna memiliki makna religius dalam upacara keagamaan Hindu Dharma.",
            name: "Payas Agung",
            designation: "Bali",
            src: payas.src,
        },
        {
            quote: "Melambangkan keagungan dan kemewahan kerajaan Islam Aceh. Penuh dengan sulaman benang emas yang mencerminkan kejayaan maritim Nusantara di masa lampau.",
            name: "Songket Palembang",
            designation: "Palembang, Sumatera Selatan",
            src: songket.src,
        },
    ];
    return <AnimatedTestimonials autoplay={true} testimonials={testimonials} />;
}
