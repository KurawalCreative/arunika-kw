"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { useConversation } from "@elevenlabs/react";
import { Mic, MessageSquare, Volume2, X, Send } from "lucide-react";

import raniBahagia from "@/assets/rani/rani-bahagia.svg";
import raniBercanda from "@/assets/rani/rani-bercanda.svg";
import raniBingung from "@/assets/rani/rani-bingung.svg";
import raniTerkejut from "@/assets/rani/rani-terkejut.svg";
import raniMarah from "@/assets/rani/rani-marah.svg";
import raniSedih from "@/assets/rani/rani-sedih.svg";

const expressions = [
    { mood: "happy", src: raniBahagia },
    { mood: "joke", src: raniBercanda },
    { mood: "confused", src: raniBingung },
    { mood: "surprised", src: raniTerkejut },
    { mood: "angry", src: raniMarah },
    { mood: "sad", src: raniSedih },
];

const funnyChats = ["Hai! Aku Rani~ 👋", "Lagi apa nih? 🤔", "Klik aku dong! 😊", "Yuk ngobrol! 💬", "Jangan malu-malu~ 😆", "Halo halo! 🙋‍♀️", "Ada yang bisa aku bantu? 🤗", "Penasaran sama aku? 😉", "Tap tap tap! ☝️", "Aku di sini loh! 👀", "Jangan di ignore dong~ 🥺", "Kesepian nih... 😢", "Yuk kita main! 🎮", "Cerita dong! 📖", "Aku bosen nih~ 😴", "Hehehe 😁", "Psst... sini! 🤫", "Aku punya cerita seru! ✨"];

async function getSignedUrl(): Promise<string> {
    const response = await fetch("/api/signed-url");
    if (!response.ok) {
        throw Error("Failed to get signed url");
    }
    const data = await response.json();
    return data.signedUrl;
}

const RaniChatCompanion = () => {
    const [currentMood, setCurrentMood] = useState(expressions[0]);
    const [mode, setMode] = useState<"text" | "voice" | "speech">("text");
    const [userMessage, setUserMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<Array<{ text: string; sender: "user" | "ai" }>>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeechActive, setIsSpeechActive] = useState(false);
    const [isWidgetOpen, setIsWidgetOpen] = useState(false);
    const [floatingChat, setFloatingChat] = useState("");
    const [showFloatingChat, setShowFloatingChat] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Auto scroll ke bawah saat ada chat baru
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    // Random expression setiap 5 detik saat widget tertutup
    useEffect(() => {
        if (!isWidgetOpen) {
            const interval = setInterval(() => {
                const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
                setCurrentMood(randomExpression);
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [isWidgetOpen]);

    // Random floating chat saat widget tertutup
    useEffect(() => {
        if (!isWidgetOpen) {
            // Show first chat after 2 seconds
            const initialTimeout = setTimeout(() => {
                const randomChat = funnyChats[Math.floor(Math.random() * funnyChats.length)];
                setFloatingChat(randomChat);
                setShowFloatingChat(true);

                // Hide after 4 seconds
                setTimeout(() => {
                    setShowFloatingChat(false);
                }, 4000);
            }, 2000);

            // Then show random chats every 10 seconds
            const interval = setInterval(() => {
                const randomChat = funnyChats[Math.floor(Math.random() * funnyChats.length)];
                setFloatingChat(randomChat);
                setShowFloatingChat(true);

                // Hide after 4 seconds
                setTimeout(() => {
                    setShowFloatingChat(false);
                }, 4000);
            }, 10000);

            return () => {
                clearTimeout(initialTimeout);
                clearInterval(interval);
            };
        } else {
            setShowFloatingChat(false);
        }
    }, [isWidgetOpen]);

    // Clear chat history saat ganti mode
    useEffect(() => {
        setChatHistory([]);

        // Stop session jika sedang aktif di mode speech
        if (isSpeechActive) {
            conversation.endSession();
            setIsSpeechActive(false);
        }
    }, [mode]);

    // Conversation hook hanya untuk mode speech
    const conversation = useConversation({
        onConnect: () => {
            console.log("Connected to agent");
            setIsSpeechActive(true);
            setChatHistory((prev) => [...prev, { text: "Terhubung dengan Rani! 😊", sender: "ai" }]);
        },
        onDisconnect: () => {
            console.log("Disconnected from agent");
            setIsSpeechActive(false);
            setChatHistory((prev) => [...prev, { text: "Koneksi terputus.", sender: "ai" }]);
        },
        onMessage: ({ message, source }) => {
            console.log("Message:", message, "Source:", source);

            // Hanya proses jika mode speech dan session aktif
            if (mode === "speech" && isSpeechActive) {
                if (source === "ai") {
                    const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
                    setCurrentMood(randomExpression);
                    setChatHistory((prev) => [...prev, { text: message, sender: "ai" }]);
                } else if (source === "user") {
                    setChatHistory((prev) => [...prev, { text: message, sender: "user" }]);
                }
            }
        },
        onError: (message, context) => {
            console.error("Error:", message, "Context:", context);
            setIsSpeechActive(false);
            setChatHistory((prev) => [...prev, { text: "Maaf, terjadi kesalahan. Coba lagi ya!", sender: "ai" }]);
        },
    });

    const handleUserMessage = async () => {
        if (!userMessage.trim() || isProcessing) return;

        setIsProcessing(true);

        // Tambahkan pesan user ke history
        const message = userMessage;
        setChatHistory((prev) => [...prev, { text: message, sender: "user" }]);
        setUserMessage(""); // Reset pesan pengguna

        const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
        setCurrentMood(randomExpression);

        try {
            // MODE TEXT: Respons dari Gemini AI, tidak ada audio
            if (mode === "text") {
                const response = await fetch("/api/chat-text", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ text: message }),
                });

                if (!response.ok) {
                    throw new Error("Gagal mendapatkan respons");
                }

                const { response: aiResponse } = await response.json();

                // Tampilkan respons AI dari Gemini
                setChatHistory((prev) => [...prev, { text: aiResponse, sender: "ai" }]);
            }
            // MODE VOICE: Respons dari Gemini + audio dari ElevenLabs
            else if (mode === "voice") {
                // Dapatkan text response dari Gemini
                const textResponse = await fetch("/api/chat-text", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ text: message }),
                });

                if (!textResponse.ok) {
                    throw new Error("Gagal mendapatkan respons");
                }

                const { response: aiResponse } = await textResponse.json();

                // Tampilkan respons AI dari Gemini
                setChatHistory((prev) => [...prev, { text: aiResponse, sender: "ai" }]);

                // Convert respons ke audio menggunakan ElevenLabs
                const audioResponse = await fetch("/api/elevenlabs", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ text: aiResponse }),
                });

                if (audioResponse.ok) {
                    const audioBlob = await audioResponse.blob();
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audioPlayer = new Audio(audioUrl);
                    audioPlayer.play();
                }
            }
        } catch (error) {
            console.error("Error saat memproses pesan pengguna:", error);
            setChatHistory((prev) => [...prev, { text: "Maaf, terjadi kesalahan. Coba lagi ya!", sender: "ai" }]);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSpeechInput = async () => {
        if (isSpeechActive) {
            // Jika sudah aktif, stop session
            conversation.endSession();
            setIsSpeechActive(false);
            return;
        }

        try {
            // Untuk Speech-to-Speech, gunakan conversation langsung
            await navigator.mediaDevices.getUserMedia({ audio: true });
            const signedUrl = await getSignedUrl();

            // Start session untuk speech-to-speech
            await conversation.startSession({
                signedUrl,
            });

            console.log("Speech-to-Speech session started");
        } catch (error) {
            console.error("Error saat menangkap input suara:", error);
            setChatHistory((prev) => [...prev, { text: "Maaf, tidak bisa mengakses mikrofon. Pastikan izin diberikan!", sender: "ai" }]);
        }
    };

    return (
        <div className="fixed right-8 bottom-8 z-50 select-none">
            {!isWidgetOpen && (
                <>
                    {/* Floating Bubble Chat */}
                    {showFloatingChat && floatingChat && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }} className="absolute right-0 bottom-24 mb-2 w-64">
                            <div className="relative rounded-2xl bg-white px-4 py-3 shadow-lg dark:bg-gray-800">
                                <p className="text-sm text-gray-700 dark:text-gray-200">{floatingChat}</p>
                                {/* Arrow pointer ke Rani */}
                                <div className="absolute right-8 -bottom-2 h-0 w-0 border-t-8 border-r-8 border-l-8 border-t-white border-r-transparent border-l-transparent dark:border-t-gray-800" />
                            </div>
                        </motion.div>
                    )}

                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="cursor-pointer" onClick={() => setIsWidgetOpen(true)}>
                        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="relative">
                            {/* Glow effect */}
                            <motion.div
                                className="absolute inset-0 rounded-full blur-2xl"
                                style={{
                                    background: "radial-gradient(circle, rgba(255,180,200,0.6), transparent 70%)",
                                    zIndex: -1,
                                }}
                                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <Image src={currentMood.src} alt={currentMood.mood} width={80} height={80} className="object-contain transition-transform duration-200 hover:scale-110" />
                        </motion.div>
                    </motion.div>
                </>
            )}

            {/* Widget Chat */}
            {isWidgetOpen && (
                <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} className="w-96 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
                    <div className="from-primary-blue bg-linear-to-r to-cyan-300 p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Image src={currentMood.src} alt={currentMood.mood} width={50} height={50} className="object-contain" />
                                <div>
                                    <h3 className="text-lg font-bold text-white">Rani</h3>
                                    <p className="text-xs text-white">AI Assistant</p>
                                </div>
                            </div>
                            <Button size="icon" variant="ghost" onClick={() => setIsWidgetOpen(false)} className="h-8 w-8 text-white hover:bg-white/20">
                                <X size={18} />
                            </Button>
                        </div>

                        {/* Mode Selection */}
                        {/* <div className="flex gap-2 rounded-lg bg-white/10 p-2 backdrop-blur-sm">
                            <Button size="sm" variant={mode === "text" ? "default" : "ghost"} onClick={() => setMode("text")} className="h-8 flex-1 gap-1.5 text-xs">
                                <MessageSquare size={14} />
                                Text
                            </Button>
                            <Button size="sm" variant={mode === "voice" ? "default" : "ghost"} onClick={() => setMode("voice")} className="h-8 flex-1 gap-1.5 text-xs">
                                <Volume2 size={14} />
                                Voice
                            </Button>
                            <Button size="sm" variant={mode === "speech" ? "default" : "ghost"} onClick={() => setMode("speech")} className="h-8 flex-1 gap-1.5 text-xs">
                                <Mic size={14} />
                                Speech
                            </Button>
                        </div> */}
                    </div>

                    {/* Chat Area */}
                    <div ref={chatContainerRef} className="h-80 space-y-3 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-800">
                        {chatHistory.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-sm text-gray-400">Mulai percakapan dengan Rani...</div>
                        ) : (
                            <>
                                {chatHistory.map((chat, index) => (
                                    <motion.div key={`${index}-${chat.text.slice(0, 10)}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={chat.sender === "user" ? "flex justify-end" : "flex justify-start"}>
                                        <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${chat.sender === "user" ? "bg-primary-blue rounded-br-sm text-white" : "rounded-bl-sm bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-100"}`}>
                                            <div className={`prose prose-sm prose-p:my-1 prose-pre:my-2 prose-ul:my-1 prose-ol:my-1 prose-code:text-xs max-w-none ${chat.sender === "user" ? "prose-invert prose-headings:text-white prose-p:text-white prose-strong:text-white prose-code:text-white prose-a:text-white" : "dark:prose-invert"}`}>
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{chat.text}</ReactMarkdown>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                        {mode === "speech" ? (
                            <Button onClick={handleSpeechInput} variant={isSpeechActive ? "destructive" : "default"} className="w-full gap-2">
                                <Mic size={16} />
                                {isSpeechActive ? "Stop Speaking" : "Tap to Speak"}
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={userMessage}
                                    onChange={(e) => setUserMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && !isProcessing && handleUserMessage()}
                                    placeholder="Type your message..."
                                    disabled={isProcessing}
                                    className="focus:border-primary-blue focus:ring-primary-blue/20 flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                                />
                                <Button onClick={handleUserMessage} variant="outline" size="icon" disabled={isProcessing || !userMessage.trim()}>
                                    <Send size={16} />
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default RaniChatCompanion;
