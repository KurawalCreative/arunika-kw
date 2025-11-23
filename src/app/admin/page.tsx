"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface ModalConfig {
    id: string;
    url: string;
    token: string;
    usageCount: number;
}

interface QwenToken {
    id: string;
    token: string;
    usageCount: number;
}

interface GeminiConfig {
    id: string;
    url: string;
    usageCount: number;
}
export default function AdminPage() {
    const { data: session, status } = useSession();
    const [modalConfigs, setModalConfigs] = useState<ModalConfig[]>([]);
    const [qwenTokens, setQwenTokens] = useState<QwenToken[]>([]);
    const [editingModal, setEditingModal] = useState<ModalConfig | null>(null);
    const [editingQwen, setEditingQwen] = useState<QwenToken | null>(null);
    const [geminiConfigs, setGeminiConfigs] = useState<GeminiConfig[]>([]);
    const [editingGemini, setEditingGemini] = useState<GeminiConfig | null>(null);

    const allowedEmails = ["ozan6825@gmail.com"];

    useEffect(() => {
        if (status === "authenticated" && session?.user?.email && allowedEmails.includes(session.user.email)) {
            fetchModalConfigs();
            fetchQwenTokens();
            fetchGeminiConfigs();
        }
    }, [status, session]);

    const fetchModalConfigs = async () => {
        const res = await fetch("/api/admin/modal");
        if (res.ok) {
            const data = await res.json();
            setModalConfigs(data);
        }
    };

    const fetchQwenTokens = async () => {
        const res = await fetch("/api/admin/qwen");
        if (res.ok) {
            const data = await res.json();
            setQwenTokens(data);
        }
    };

    const fetchGeminiConfigs = async () => {
        const res = await fetch("/api/admin/gemini");
        if (res.ok) {
            const data = await res.json();
            setGeminiConfigs(data);
        }
    };

    const handleSaveModal = async (config: Partial<ModalConfig>) => {
        const method = editingModal?.id ? "PUT" : "POST";
        const body = editingModal?.id ? { id: editingModal.id, ...config } : config;
        const res = await fetch("/api/admin/modal", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.ok) {
            fetchModalConfigs();
            setEditingModal(null);
        }
    };

    const handleDeleteModal = async (id: string) => {
        const res = await fetch("/api/admin/modal", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) {
            fetchModalConfigs();
        }
    };

    const handleSaveQwen = async (token: Partial<QwenToken>) => {
        const method = editingQwen?.id ? "PUT" : "POST";
        const body = editingQwen?.id ? { id: editingQwen.id, ...token } : token;
        const res = await fetch("/api/admin/qwen", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.ok) {
            fetchQwenTokens();
            setEditingQwen(null);
        }
    };

    const handleSaveGemini = async (config: Partial<GeminiConfig>) => {
        const method = editingGemini?.id ? "PUT" : "POST";
        const body = editingGemini?.id ? { id: editingGemini.id, ...config } : config;
        const res = await fetch("/api/admin/gemini", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.ok) {
            fetchGeminiConfigs();
            setEditingGemini(null);
        }
    };

    const handleDeleteGemini = async (id: string) => {
        const res = await fetch("/api/admin/gemini", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) {
            fetchGeminiConfigs();
        }
    };

    const handleDeleteQwen = async (id: string) => {
        const res = await fetch("/api/admin/qwen", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) {
            fetchQwenTokens();
        }
    };

    if (status === "loading") return <div>Loading...</div>;

    if (!session || !allowedEmails.includes(session.user?.email || "")) {
        return <div>Unauthorized</div>;
    }

    return (
        <div className="p-8">
            <h1 className="mb-8 text-2xl font-bold">Admin Panel</h1>

            <div className="mb-8">
                <h2 className="mb-4 text-xl font-semibold">Modal Configurations</h2>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 p-2">URL</th>
                                <th className="border border-gray-300 p-2">Token</th>
                                <th className="border border-gray-300 p-2">Usage Count</th>
                                <th className="border border-gray-300 p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {modalConfigs.map((config) => (
                                <tr key={config.id}>
                                    <td className="max-w-xs truncate border border-gray-300 p-2" title={config.url}>
                                        {config.url}
                                    </td>
                                    <td className="max-w-xs truncate border border-gray-300 p-2" title={config.token}>
                                        {config.token}
                                    </td>
                                    <td className="border border-gray-300 p-2">{config.usageCount}</td>
                                    <td className="border border-gray-300 p-2">
                                        <button onClick={() => setEditingModal(config)} className="mr-2 bg-blue-500 px-2 py-1 text-white">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteModal(config.id)} className="bg-red-500 px-2 py-1 text-white">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button onClick={() => setEditingModal({ id: "", url: "", token: "", usageCount: 0 })} className="mt-4 bg-green-500 px-4 py-2 text-white">
                    Add New
                </button>
            </div>

            {editingModal && <ModalForm config={editingModal} onSave={handleSaveModal} onCancel={() => setEditingModal(null)} />}

            <div className="mb-8">
                <h2 className="mb-4 text-xl font-semibold">Qwen Tokens</h2>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 p-2">Token</th>
                                <th className="border border-gray-300 p-2">Usage Count</th>
                                <th className="border border-gray-300 p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {qwenTokens.map((token) => (
                                <tr key={token.id}>
                                    <td className="max-w-xs truncate border border-gray-300 p-2" title={token.token}>
                                        {token.token}
                                    </td>
                                    <td className="border border-gray-300 p-2">{token.usageCount}</td>
                                    <td className="border border-gray-300 p-2">
                                        <button onClick={() => setEditingQwen(token)} className="mr-2 bg-blue-500 px-2 py-1 text-white">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteQwen(token.id)} className="bg-red-500 px-2 py-1 text-white">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button onClick={() => setEditingQwen({ id: "", token: "", usageCount: 0 })} className="mt-4 bg-green-500 px-4 py-2 text-white">
                    Add New
                </button>
            </div>

            {editingQwen && <QwenForm token={editingQwen} onSave={handleSaveQwen} onCancel={() => setEditingQwen(null)} />}

            <div className="mb-8">
                <h2 className="mb-4 text-xl font-semibold">Gemini Configurations</h2>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 p-2">URL</th>
                                <th className="border border-gray-300 p-2">Usage Count</th>
                                <th className="border border-gray-300 p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {geminiConfigs.map((config) => (
                                <tr key={config.id}>
                                    <td className="max-w-xs truncate border border-gray-300 p-2" title={config.url}>
                                        {config.url}
                                    </td>
                                    <td className="border border-gray-300 p-2">{config.usageCount}</td>
                                    <td className="border border-gray-300 p-2">
                                        <button onClick={() => setEditingGemini(config)} className="mr-2 bg-blue-500 px-2 py-1 text-white">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteGemini(config.id)} className="bg-red-500 px-2 py-1 text-white">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button onClick={() => setEditingGemini({ id: "", url: "", usageCount: 0 })} className="mt-4 bg-green-500 px-4 py-2 text-white">
                    Add New
                </button>
            </div>

            {editingGemini && <GeminiForm config={editingGemini} onSave={handleSaveGemini} onCancel={() => setEditingGemini(null)} />}
        </div>
    );
}

function ModalForm({ config, onSave, onCancel }: { config: Partial<ModalConfig>; onSave: (config: Partial<ModalConfig>) => void; onCancel: () => void }) {
    const [url, setUrl] = useState(config.url || "");
    const [token, setToken] = useState(config.token || "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ url, token });
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8 border border-gray-300 p-4">
            <h3 className="mb-4 text-lg font-semibold">{config.id ? "Edit" : "Add"} Modal Config</h3>
            <div className="mb-4">
                <label className="mb-2 block">URL</label>
                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full border border-gray-300 p-2" required />
            </div>
            <div className="mb-4">
                <label className="mb-2 block">Token</label>
                <input type="text" value={token} onChange={(e) => setToken(e.target.value)} className="w-full border border-gray-300 p-2" required />
            </div>
            <button type="submit" className="mr-2 bg-blue-500 px-4 py-2 text-white">
                Save
            </button>
            <button type="button" onClick={onCancel} className="bg-gray-500 px-4 py-2 text-white">
                Cancel
            </button>
        </form>
    );
}

function GeminiForm({ config, onSave, onCancel }: { config: Partial<GeminiConfig>; onSave: (config: Partial<GeminiConfig>) => void; onCancel: () => void }) {
    const [url, setUrl] = useState(config.url || "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ url });
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8 border border-gray-300 p-4">
            <h3 className="mb-4 text-lg font-semibold">{config.id ? "Edit" : "Add"} Gemini Config</h3>
            <div className="mb-4">
                <label className="mb-2 block">URL</label>
                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full border border-gray-300 p-2" required />
            </div>
            <button type="submit" className="mr-2 bg-blue-500 px-4 py-2 text-white">
                Save
            </button>
            <button type="button" onClick={onCancel} className="bg-gray-500 px-4 py-2 text-white">
                Cancel
            </button>
        </form>
    );
}

function QwenForm({ token, onSave, onCancel }: { token: Partial<QwenToken>; onSave: (token: Partial<QwenToken>) => void; onCancel: () => void }) {
    const [tokenValue, setTokenValue] = useState(token.token || "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ token: tokenValue });
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8 border border-gray-300 p-4">
            <h3 className="mb-4 text-lg font-semibold">{token.id ? "Edit" : "Add"} Qwen Token</h3>
            <div className="mb-4">
                <label className="mb-2 block">Token</label>
                <input type="text" value={tokenValue} onChange={(e) => setTokenValue(e.target.value)} className="w-full border border-gray-300 p-2" required />
            </div>
            <button type="submit" className="mr-2 bg-blue-500 px-4 py-2 text-white">
                Save
            </button>
            <button type="button" onClick={onCancel} className="bg-gray-500 px-4 py-2 text-white">
                Cancel
            </button>
        </form>
    );
}
