"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

import Link from "next/link";
import AuthCarousel from "@/components/auth-carousel";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Get callback URL from query parameters
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const message = searchParams.get("message");

    const handleLogin = async () => {
        if (!email.trim()) {
            toast.error("Email tidak boleh kosong");
            return;
        }

        setIsLoading(true);
        try {
            const result = await signIn("email", {
                email: email,
                callbackUrl: callbackUrl,
                redirect: false,
            });

            if (result?.error) {
                toast.error("Terjadi kesalahan saat mengirim email");
            } else {
                toast.success("Cek email Anda untuk link login!");
                router.push("/verify-request");
            }
        } catch (error) {
            console.error("Email login error:", error);
            toast.error("Terjadi kesalahan saat mengirim email");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await signIn("google", {
                callbackUrl: callbackUrl,
            });
        } catch (error) {
            console.error("Google login error:", error);
            toast.error("Terjadi kesalahan saat login dengan Google");
            setIsLoading(false);
        }
    };

    return (
        <main className="bg-bg-base flex h-screen max-w-screen">
            <section className="max-w-8xl mx-auto flex min-h-screen w-full flex-row">
                {/* Left Panel */}
                <div className="flex flex-1 p-5">
                    <div className="flex flex-1 flex-col rounded-xl bg-white">
                        <div className="flex flex-1 items-center justify-center">
                            <div className="flex w-full max-w-sm flex-1 flex-col gap-4">
                                <div className="flex flex-col gap-2 text-center">
                                    <div className="text-TextPrimary text-2xl font-semibold">Selamat datang kembali!</div>
                                    <div className="text-TextSecondary text-sm">Temukan kembali cerita, tradisi, dan keindahan dari setiap penjuru negeri.</div>

                                    {/* Message for email verification */}
                                    {message === "check-email" && (
                                        <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
                                            <div className="font-medium">Cek email Anda!</div>
                                            <div>Kami telah mengirim link login ke email Anda. Klik link tersebut untuk masuk.</div>
                                        </div>
                                    )}
                                </div>

                                {/* Tombol Login Sosial */}
                                <div className="flex w-sm flex-col gap-4 lg:flex-row">
                                    <button onClick={handleGoogleLogin} disabled={isLoading} className="bg-bg-base flex h-10.5 w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-[#E0E1E2] disabled:cursor-not-allowed disabled:opacity-50">
                                        <svg className="h-5 w-5" viewBox="0 0 48 48">
                                            <path fill="#fbc02d" d="M43.6 20.5H42V20H24v8h11.3C33.3 32.3 29.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.3 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-3.5z" />
                                            <path fill="#e53935" d="M6.3 14.6l6.6 4.8C14.4 16.2 18.9 14 24 14c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.3 29.6 4 24 4c-7.3 0-13.6 3.9-17.1 9.6z" />
                                            <path fill="#4caf50" d="M24 44c5.1 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.6 35.7 26.9 37 24 37c-5 0-9.2-3.3-10.7-7.9l-6.6 5.1C10.3 39.6 16.7 44 24 44z" />
                                            <path fill="#1565c0" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.7-6.1 7.2l6.2 5.2c-0.4 0.3 6.6-4.8 6.6-13.9 0-1.3-.1-2.7-.4-3.5z" />
                                        </svg>
                                        <p className="text-TextPrimary font-medium">{isLoading ? "Menyambungkan..." : "Login dengan Google"}</p>
                                    </button>
                                </div>

                                {/* Divider */}
                                <div className="flex items-center gap-6">
                                    <div className="h-0.5 w-full rounded-lg bg-gray-200" />
                                    <div className="text-TextSecondary text-sm">atau</div>
                                    <div className="h-0.5 w-full rounded-lg bg-gray-200" />
                                </div>

                                {/* Form Login */}
                                <div className="mt-1 flex w-full flex-col gap-1">
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Masukan email kamu" className="text-TextPrimary h-10.5 rounded-xl border-2 border-gray-300 bg-white px-3 text-sm placeholder:text-gray-400 disabled:opacity-50" disabled={isLoading} onKeyPress={(e) => e.key === "Enter" && handleLogin()} />
                                </div>

                                {/* Tombol Login */}
                                <div className="mt-2 w-sm">
                                    <button onClick={handleLogin} disabled={isLoading || !email.trim()} className="bg-orange h-10.5 w-full cursor-pointer rounded-full font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50">
                                        {isLoading ? "Mengirim Email..." : "Kirim Link Login"}
                                    </button>
                                </div>

                                {/* Info Text */}
                                <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">Kami akan mengirim link login ke email Anda</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <AuthCarousel />
            </section>
        </main>
    );
}
