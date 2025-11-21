"use client";

export default function NotFound() {
    return (
        <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 text-center">
            <div className="space-y-6">
                <h1 className="text-foreground text-6xl font-bold">404</h1>
                <h2 className="text-foreground text-2xl font-semibold">Halaman Tidak Ditemukan</h2>
                <p className="text-muted-foreground">Maaf, halaman yang Anda cari tidak dapat ditemukan.</p>
            </div>
        </div>
    );
}
