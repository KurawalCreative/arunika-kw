"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { QuizData, Question } from "@/types/quiz";
import Image from "next/image";
import ranimikir from "@/assets/images/ranimikir.png";

interface QuizSectionProps {
    province: string;
    description: string;
}

interface AnswerState {
    questionIndex: number;
    selectedAnswer: string | null;
    isAnswered: boolean;
    isCorrect: boolean;
}

export default function QuizSection({ province, description }: QuizSectionProps) {
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [answerState, setAnswerState] = useState<AnswerState>({
        questionIndex: 0,
        selectedAnswer: null,
        isAnswered: false,
        isCorrect: false,
    });
    const [quizFinished, setQuizFinished] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const startQuiz = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/generateQuiz", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ province, description }),
            });

            const data = await res.json();

            if (data.error) {
                setError(data.error);
            } else {
                setQuizData(data);
                setCurrentQuestion(0);
                setScore(0);
                setQuizFinished(false);
            }
        } catch (err) {
            setError("Terjadi kesalahan saat membuat kuis.");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (selectedOption: string) => {
        if (answerState.isAnswered) return;

        const currentQ = quizData?.questions[currentQuestion];
        const isCorrect = selectedOption === currentQ?.answer;

        setAnswerState({
            questionIndex: currentQuestion,
            selectedAnswer: selectedOption,
            isAnswered: true,
            isCorrect: isCorrect,
        });

        if (isCorrect) {
            setScore(score + 1);
        }
    };

    const handleNextQuestion = () => {
        if (!quizData) return;

        if (currentQuestion < quizData.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setAnswerState({
                questionIndex: currentQuestion + 1,
                selectedAnswer: null,
                isAnswered: false,
                isCorrect: false,
            });
        } else {
            setQuizFinished(true);
        }
    };

    const handleRestartQuiz = () => {
        setShowModal(true);
        startQuiz();
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setQuizData(null);
        setCurrentQuestion(0);
        setScore(0);
        setQuizFinished(false);
        setAnswerState({
            questionIndex: 0,
            selectedAnswer: null,
            isAnswered: false,
            isCorrect: false,
        });
    };

    // Button untuk membuka modal
    if (!showModal || !quizData) {
        return (
            <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-orange-200 bg-linear-to-r from-orange-50 via-yellow-50 to-red-50 dark:border-orange-700 dark:from-orange-900/20 dark:via-yellow-900/20 dark:to-red-900/20">
                {/* Decorative circles background */}
                <div className="absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-orange-200 opacity-20 md:h-48 md:w-48 md:translate-x-24 md:-translate-y-24 dark:bg-orange-800"></div>
                <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-12 translate-y-12 rounded-full bg-red-200 opacity-20 md:h-32 md:w-32 md:-translate-x-16 md:translate-y-16 dark:bg-red-800"></div>
                <div className="absolute top-1/2 right-1/4 h-16 w-16 rounded-full bg-yellow-200 opacity-15 md:h-24 md:w-24 dark:bg-yellow-800"></div>

                {/* Content wrapper */}
                <div className="relative z-10 flex flex-col gap-4 border px-4 py-6 md:flex-row md:gap-6 md:px-0 md:py-10">
                    {/* Image section */}
                    <div className="absolute bottom-0 left-0 hidden md:block">
                        <Image src={ranimikir} alt="Arunika" height={150} width={150} className="object-contain md:h-[200px] md:w-[200px]" />
                    </div>

                    {/* Text and button section */}
                    <motion.div className="grid flex-1 grid-cols-1 gap-3 px-4 md:ml-50 md:gap-4 md:px-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <h3 className="text-lg font-bold text-gray-800 md:text-xl dark:text-white">Wah, seru banget ya belajar budaya bareng Arunika! 🎉</h3>
                        <p className="text-sm leading-relaxed text-gray-700 md:text-base dark:text-gray-300">Kira-kira kamu masih inget nggak sama yang tadi? Yuk, cobain kuisnya dan lihat seberapa paham kamu tentang budaya {province}!</p>
                        <motion.button
                            onClick={() => {
                                setShowModal(true);
                                startQuiz();
                            }}
                            disabled={loading}
                            className="w-full rounded-lg bg-linear-to-r from-orange-500 to-red-500 px-4 py-2.5 text-sm font-bold text-white transition-all hover:shadow-lg disabled:bg-gray-400 md:w-fit md:py-3 md:text-base disabled:dark:bg-gray-600"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {loading ? "Membuat Kuis..." : ` Mulai Kuis Budaya`}
                        </motion.button>
                        {error && <p className="mt-2 text-xs text-red-600 md:text-sm dark:text-red-400">{error}</p>}
                    </motion.div>
                </div>
            </div>
        );
    }

    // Modal content
    const currentQ = quizData.questions[currentQuestion];
    const totalQuestions = quizData.questions.length;
    const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;

    if (quizFinished) {
        const percentage = (score / totalQuestions) * 100;

        return (
            <>
                {/* Backdrop */}
                <motion.div className="fixed inset-0 z-40 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal} />

                {/* Modal Content */}
                <motion.div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="pointer-events-auto mx-auto mt-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl md:p-8 dark:bg-gray-800" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                        <div className="mb-4 text-right">
                            <motion.button onClick={handleCloseModal} className="text-2xl text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" whileHover={{ scale: 1.2 }}>
                                ✕
                            </motion.button>
                        </div>

                        <motion.div className="text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                            <div className="mb-4 text-4xl md:text-6xl">{percentage === 100 ? "🎉" : percentage >= 80 ? "🌟" : percentage >= 60 ? "👍" : "📚"}</div>

                            <h2 className="mb-4 text-2xl font-bold text-gray-800 md:text-3xl dark:text-white">Kuis Selesai!</h2>

                            <div className="mb-4 rounded-xl bg-linear-to-r from-orange-100 to-red-100 p-4 md:mb-6 md:p-6 dark:from-orange-900/30 dark:to-red-900/30">
                                <p className="mb-2 text-4xl font-bold text-orange-600 md:text-5xl dark:text-orange-400">
                                    {score}/{totalQuestions}
                                </p>
                                <p className="mb-2 text-xl font-semibold text-gray-700 md:text-2xl dark:text-gray-300">{percentage.toFixed(0)}%</p>
                                <p className="text-sm text-gray-600 md:text-lg dark:text-gray-400">{percentage === 100 ? "🏆 Sempurna! Anda ahli budaya ini!" : percentage >= 80 ? "⭐ Luar biasa! Pemahaman Anda sangat baik!" : percentage >= 60 ? "✓ Bagus! Coba lagi untuk hasil lebih baik." : "📖 Tetap semangat! Pelajari lebih lanjut tentang budaya ini."}</p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row md:gap-4">
                                <motion.button onClick={handleRestartQuiz} className="flex-1 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 md:px-8 md:py-3 md:text-base" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    Kuis Ulang
                                </motion.button>
                                <motion.button onClick={handleCloseModal} className="flex-1 rounded-lg bg-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-400 md:px-8 md:py-3 md:text-base dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    Tutup
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </>
        );
    }

    return (
        <>
            {/* Backdrop */}
            {showModal && <motion.div className="fixed inset-0 z-40 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal} />}

            {/* Modal Content */}
            {showModal && (
                <motion.div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="pointer-events-auto mx-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl md:p-8 dark:bg-gray-800" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                        <div className="mb-4 text-right">
                            <motion.button onClick={handleCloseModal} className="text-2xl text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" whileHover={{ scale: 1.2 }}>
                                ✕
                            </motion.button>
                        </div>
                        {/* Header */}
                        <div className="mb-6 md:mb-8">
                            <div className="mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                                <h2 className="text-xl font-bold text-gray-800 md:text-2xl dark:text-white">Kuis Budaya {quizData.province}</h2>
                                <div className="text-left sm:text-right">
                                    <p className="text-xs text-gray-600 md:text-sm dark:text-gray-400">
                                        Pertanyaan {currentQuestion + 1} dari {totalQuestions}
                                    </p>
                                    <p className="text-base font-bold text-orange-500 md:text-lg dark:text-orange-400">
                                        Skor: {score}/{totalQuestions}
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                <motion.div className="h-2 bg-linear-to-r from-orange-500 to-red-500" initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 0.5 }} />
                            </div>
                        </div>

                        {/* Question */}
                        <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="mb-6 md:mb-8">
                            <h3 className="mb-4 text-lg font-semibold text-gray-800 md:mb-6 md:text-xl dark:text-white">
                                {currentQuestion + 1}. {currentQ.question}
                            </h3>

                            {/* Options */}
                            <div className="space-y-3">
                                {currentQ.options.map((option, idx) => {
                                    const isSelected = answerState.selectedAnswer === option;
                                    const isCorrectAnswer = option === currentQ.answer;
                                    const showCorrect = answerState.isAnswered && isCorrectAnswer;
                                    const showIncorrect = answerState.isAnswered && isSelected && !isCorrectAnswer;

                                    return (
                                        <motion.button
                                            key={idx}
                                            onClick={() => handleAnswer(option)}
                                            disabled={answerState.isAnswered}
                                            className={`w-full rounded-lg border-2 p-3 text-left text-sm font-semibold transition-all md:p-4 md:text-base ${
                                                showCorrect
                                                    ? "border-green-500 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                    : showIncorrect
                                                      ? "border-red-500 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                                      : isSelected && !answerState.isAnswered
                                                        ? "border-orange-500 bg-orange-50 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                                                        : answerState.isAnswered
                                                          ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500"
                                                          : "cursor-pointer border-gray-300 hover:border-orange-500 hover:bg-orange-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-orange-900/30"
                                            }`}
                                            whileHover={!answerState.isAnswered ? { scale: 1.02 } : {}}
                                            whileTap={!answerState.isAnswered ? { scale: 0.98 } : {}}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{option}</span>
                                                {showCorrect && <span className="text-xl md:text-2xl">✓</span>}
                                                {showIncorrect && <span className="text-xl md:text-2xl">✗</span>}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Feedback & Explanation */}
                        {answerState.isAnswered && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={`mb-4 rounded-lg border-l-4 p-3 md:mb-6 md:p-4 ${answerState.isCorrect ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-red-500 bg-red-50 dark:bg-red-900/20"}`}>
                                <p className="mb-2 text-sm font-semibold md:text-base dark:text-white">{answerState.isCorrect ? "✓ Jawaban Benar!" : "✗ Jawaban Salah!"}</p>
                                {!answerState.isCorrect && (
                                    <p className="mb-2 text-xs md:text-sm dark:text-gray-300">
                                        <span className="font-semibold">Jawaban yang benar: </span>
                                        <span className="font-semibold text-green-700 dark:text-green-400">{currentQ.answer}</span>
                                    </p>
                                )}
                                <p className="text-xs text-gray-700 md:text-sm dark:text-gray-300">
                                    <span className="font-semibold">Penjelasan: </span>
                                    {currentQ.explanation}
                                </p>
                            </motion.div>
                        )}

                        {/* Next Button */}
                        {answerState.isAnswered && (
                            <motion.button onClick={handleNextQuestion} className="w-full rounded-lg bg-linear-to-r from-orange-500 to-red-500 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg md:py-3 md:text-base" initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                {currentQuestion === totalQuestions - 1 ? "Lihat Hasil Akhir" : "Pertanyaan Berikutnya →"}
                            </motion.button>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </>
    );
}
