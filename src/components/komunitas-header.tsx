import { Hash } from "lucide-react";

const KomunitasHeader = () => {
    return (
        <>
            <div className="mb-6 flex items-center gap-5">
                <Hash size={60} />
                <div>
                    <h1 className="text-font-primary text-4xl font-bold tracking-wide dark:text-white">Komunitas Arunika</h1>
                    <p className="text-font-secondary mt-1 text-sm dark:text-slate-400">Ngobrol dan diskusi bareng yuk!</p>
                </div>
            </div>

            <div className="flex pb-4">
                <div className="w-full border-b-2 pb-4">
                    <div className="flex flex-row gap-2 px-2">
                        <button className="rounded-md border px-4 py-2">Postingan Top</button>
                        <button className="rounded-md border px-4 py-2">Terbaru</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default KomunitasHeader;
