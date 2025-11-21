"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

function VerifyRequestForm() {
    const searchParams = useSearchParams();
    const [email, setEmail] = useState<string>("");

    useEffect(() => {
        // Get email from URL params if available
        const emailParam = searchParams.get("email");
        if (emailParam) {
            setEmail(decodeURIComponent(emailParam));
        }
    }, [searchParams]);

    return (
        <main className="bg-bg-base flex h-screen max-w-screen">
            <section className="max-w-8xl mx-auto flex min-h-screen w-full flex-row">
                {/* Left Panel */}
                <div className="flex flex-1 p-5">
                    <div className="flex flex-1 flex-col rounded-xl bg-white">
                        <div className="flex flex-1 items-center justify-center">
                            <div className="flex w-full max-w-sm flex-1 flex-col gap-6 text-center">
                                {/* Icon */}
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                    <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                </div>

                                {/* Title */}
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-TextPrimary text-2xl font-semibold">Cek Email Anda!</h1>
                                    <p className="text-TextSecondary text-sm">Kami telah mengirim link login ke email Anda</p>
                                </div>

                                {/* Email Display */}
                                {email && (
                                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Link dikirim ke:</p>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">{email}</p>
                                    </div>
                                )}

                                {/* Instructions */}
                                <div className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <p>Klik link di email untuk melanjutkan login. Link akan kadaluarsa dalam 24 jam.</p>
                                    <p>Tidak menerima email? Cek folder spam atau kirim ulang.</p>
                                </div>

                                {/* Back to Login */}
                                <Link href="/login" className="flex items-center justify-center gap-2 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300">
                                    <ArrowLeft className="h-4 w-4" />
                                    Kembali ke Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - You can add AuthCarousel here if needed */}
                <div className="hidden flex-1 lg:flex">
                    <div className="flex flex-1 items-center justify-center bg-linear-to-br from-orange-400 to-pink-500">
                        <div className="text-center text-white">
                            <h2 className="text-3xl font-bold">Arunika</h2>
                            <p className="mt-2 text-lg">Platform Budaya Nusantara</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default function VerifyRequestPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyRequestForm />
        </Suspense>
    );
}
