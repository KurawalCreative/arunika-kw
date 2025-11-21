import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import Link from "next/link";

const FooterSection = () => {
    return (
        <footer className="w-full border-t border-gray-200 bg-gray-50 text-gray-900 dark:border-neutral-700 dark:bg-gray-900 dark:text-gray-100">
            {/* Container utama */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:py-12 md:grid-cols-3">
                {/* Brand / Logo */}
                <div>
                    <h2 className="text-xl font-bold tracking-wide text-gray-900 sm:text-2xl dark:text-gray-100">Arunika</h2>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Membawa cahaya di setiap langkah digitalmu — platform kreatif untuk desain dan pengalaman digital yang bermakna.</p>
                </div>

                {/* Navigasi cepat */}
                <div className="text-left md:text-end">
                    <h3 className="mb-3 text-base font-semibold text-gray-900 sm:text-lg dark:text-gray-100">Navigasi</h3>
                    <ul className="space-y-2 text-sm text-gray-600 sm:text-base dark:text-gray-400">
                        <li>
                            <Link href="/" className="hover:text-green-lime-dark transition dark:hover:text-green-400">
                                Beranda
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className="hover:text-green-lime-dark transition dark:hover:text-green-400">
                                Tentang
                            </Link>
                        </li>
                        <li>
                            <Link href="/projects" className="hover:text-green-lime-dark transition dark:hover:text-green-400">
                                Proyek
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:text-green-lime-dark transition dark:hover:text-green-400">
                                Kontak
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Sosial media */}
                <div className="text-left md:text-end">
                    <h3 className="mb-3 text-base font-semibold text-gray-900 sm:text-lg dark:text-gray-100">Terhubung</h3>
                    <div className="flex items-center justify-start gap-4 md:justify-end">
                        <Link href="mailto:hello@arunika.com" className="hover:text-green-lime-dark transition dark:hover:text-green-400">
                            <Mail size={18} className="sm:h-5 sm:w-5" />
                        </Link>
                        <Link href="#" className="hover:text-green-lime-dark transition dark:hover:text-green-400">
                            <Facebook size={18} className="sm:h-5 sm:w-5" />
                        </Link>
                        <Link href="#" className="hover:text-green-lime-dark transition dark:hover:text-green-400">
                            <Instagram size={18} className="sm:h-5 sm:w-5" />
                        </Link>
                        <Link href="#" className="hover:text-green-lime-dark transition dark:hover:text-green-400">
                            <Twitter size={18} className="sm:h-5 sm:w-5" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500 sm:text-sm dark:border-gray-700 dark:text-gray-500">© {new Date().getFullYear()} Arunika. All rights reserved.</div>
        </footer>
    );
};

export default FooterSection;
