import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import Link from "next/link";

const FooterSection = () => {
    return (
        <footer className="bg-text-primary w-full text-white">
            {/* Container utama */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-3">
                {/* Brand / Logo */}
                <div>
                    <h2 className="text-2xl font-bold tracking-wide">Arunika</h2>
                    <p className="mt-3 text-sm leading-relaxed text-gray-300">Membawa cahaya di setiap langkah digitalmu — platform kreatif untuk desain dan pengalaman digital yang bermakna.</p>
                </div>

                {/* Navigasi cepat */}
                <div className="text-end">
                    <h3 className="mb-3 text-lg font-semibold">Navigasi</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li>
                            <Link href="/" className="hover:text-green-lime-dark transition">
                                Beranda
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className="hover:text-green-lime-dark transition">
                                Tentang
                            </Link>
                        </li>
                        <li>
                            <Link href="/projects" className="hover:text-green-lime-dark transition">
                                Proyek
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:text-green-lime-dark transition">
                                Kontak
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Sosial media */}
                <div className="text-end">
                    <h3 className="mb-3 text-lg font-semibold">Terhubung</h3>
                    <div className="flex items-center justify-end gap-4">
                        <Link href="mailto:hello@arunika.com" className="hover:text-green-lime-dark transition">
                            <Mail size={20} />
                        </Link>
                        <Link href="#" className="hover:text-green-lime-dark transition">
                            <Facebook size={20} />
                        </Link>
                        <Link href="#" className="hover:text-green-lime-dark transition">
                            <Instagram size={20} />
                        </Link>
                        <Link href="#" className="hover:text-green-lime-dark transition">
                            <Twitter size={20} />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/20 py-4 text-center text-sm text-gray-400">© {new Date().getFullYear()} Arunika. All rights reserved.</div>
        </footer>
    );
};

export default FooterSection;
