import { Hash } from "lucide-react";

const KomunitasHeader = () => {
    return (
        <>
            <div className="mb-6 flex items-center gap-5">
                <Hash size={60} className="text-gray-900 dark:text-white" />
                <div>
                    <h1 className="text-font-primary text-4xl font-bold tracking-wide text-slate-900 dark:text-white">Komunitas Arunika</h1>
                    <p className="text-font-secondary mt-1 text-sm text-slate-500 dark:text-slate-400">Ngobrol dan diskusi bareng yuk!</p>
                </div>
            </div>

            <div className="flex pb-4">
                <div className="w-full border-b-2 border-slate-200 pb-4 dark:border-slate-700">
                    <div className="flex flex-row gap-2 px-2">
                        <button className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white">Postingan Top</button>
                        <button className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white">Terbaru</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default KomunitasHeader;
