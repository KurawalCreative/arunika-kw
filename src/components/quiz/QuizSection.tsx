"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { QuizData, Question } from "@/types/quiz";
import Image from "next/image";
import ranimikir from '@/assets/images/ranimikir.png'

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
            <div className="relative bg-linear-to-r from-orange-50 via-yellow-50 to-red-50 w-fit mx-auto rounded-2xl overflow-hidden border border-orange-200">
                {/* Decorative circles background */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-orange-200 rounded-full opacity-20 -translate-y-24 translate-x-24"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-200 rounded-full opacity-20 translate-y-16 -translate-x-16"></div>
                <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-yellow-200 rounded-full opacity-15"></div>
                
                {/* Content wrapper */}
                <div className="relative z-10 flex gap-6 border py-10">
                    {/* Image section */}
                    <div className="absolute bottom-0 left-0">
                        <Image
                            src={ranimikir}
                            alt="Arunika"
                            height={200}
                            width={200}
                            className="object-contain"
                        />
                    </div>

                    {/* Text and button section */}
                    <motion.div
                        className="grid grid-cols-1 gap-4 flex-1 ml-50 px-6 "
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3 className="text-xl font-bold text-gray-800">
                            Wah, seru banget ya belajar budaya bareng Arunika! 🎉
                        </h3>
                        <p className="text-gray-700 text-base leading-relaxed w-lg">
                            Kira-kira kamu masih inget nggak sama yang tadi? Yuk, cobain kuisnya dan lihat seberapa paham kamu tentang budaya {province}! 
                        </p>
                        <motion.button
                            onClick={() => {
                                setShowModal(true);
                                startQuiz();
                            }}
                            disabled={loading}
                            className="px-4 py-3 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold hover:shadow-lg disabled:bg-gray-400 transition-all w-fit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {loading ? "Membuat Kuis..." : ` Mulai Kuis Budaya`}
                        </motion.button>
                        {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
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
                <motion.div
                    className="fixed inset-0 bg-black/50 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleCloseModal}
                />

                {/* Modal Content */}
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="mt-10 max-w-2xl mx-auto w-full pointer-events-auto bg-white rounded-2xl shadow-xl p-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-right mb-4">
                            <motion.button
                                onClick={handleCloseModal}
                                className="text-2xl text-gray-500 hover:text-gray-700 transition-colors"
                                whileHover={{ scale: 1.2 }}
                            >
                                ✕
                            </motion.button>
                        </div>

                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="text-6xl mb-4">
                                {percentage === 100 ? "🎉" : percentage >= 80 ? "🌟" : percentage >= 60 ? "👍" : "📚"}
                            </div>

                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Kuis Selesai!</h2>

                            <div className="bg-linear-to-r from-orange-100 to-red-100 rounded-xl p-6 mb-6">
                                <p className="text-5xl font-bold text-orange-600 mb-2">
                                    {score}/{totalQuestions}
                                </p>
                                <p className="text-2xl font-semibold text-gray-700 mb-2">
                                    {percentage.toFixed(0)}%
                                </p>
                                <p className="text-lg text-gray-600">
                                    {percentage === 100
                                        ? "🏆 Sempurna! Anda ahli budaya ini!"
                                        : percentage >= 80
                                            ? "⭐ Luar biasa! Pemahaman Anda sangat baik!"
                                            : percentage >= 60
                                                ? "✓ Bagus! Coba lagi untuk hasil lebih baik."
                                                : "📖 Tetap semangat! Pelajari lebih lanjut tentang budaya ini."}
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <motion.button
                                    onClick={handleRestartQuiz}
                                    className="flex-1 bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Kuis Ulang
                                </motion.button>
                                <motion.button
                                    onClick={handleCloseModal}
                                    className="flex-1 bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
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
            {showModal && (
                <motion.div
                    className="fixed inset-0 bg-black/50 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleCloseModal}
                />
            )}

            {/* Modal Content */}
            {showModal && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="max-w-3xl mx-auto w-full pointer-events-auto bg-white rounded-2xl shadow-xl p-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-right mb-4">
                            <motion.button
                                onClick={handleCloseModal}
                                className="text-2xl text-gray-500 hover:text-gray-700 transition-colors"
                                whileHover={{ scale: 1.2 }}
                            >
                                ✕
                            </motion.button>
                        </div>
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Kuis Budaya {quizData.province}
                                </h2>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Pertanyaan {currentQuestion + 1} dari {totalQuestions}</p>
                                    <p className="text-lg font-bold text-orange-500">Skor: {score}/{totalQuestions}</p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercentage}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>

                        {/* Question */}
                        <motion.div
                            key={currentQuestion}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-8"
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">
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
                                            className={`w-full text-left p-4 rounded-lg border-2 font-semibold transition-all ${showCorrect
                                                ? "border-green-500 bg-green-50 text-green-800"
                                                : showIncorrect
                                                    ? "border-red-500 bg-red-50 text-red-800"
                                                    : isSelected && !answerState.isAnswered
                                                        ? "border-orange-500 bg-orange-50 text-orange-800"
                                                        : answerState.isAnswered
                                                            ? "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                                                            : "border-gray-300 hover:border-orange-500 hover:bg-orange-50 cursor-pointer"
                                                }`}
                                            whileHover={!answerState.isAnswered ? { scale: 1.02 } : {}}
                                            whileTap={!answerState.isAnswered ? { scale: 0.98 } : {}}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{option}</span>
                                                {showCorrect && <span className="text-2xl">✓</span>}
                                                {showIncorrect && <span className="text-2xl">✗</span>}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Feedback & Explanation */}
                        {answerState.isAnswered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`mb-6 p-4 rounded-lg border-l-4 ${answerState.isCorrect
                                    ? "border-green-500 bg-green-50"
                                    : "border-red-500 bg-red-50"
                                    }`}
                            >
                                <p className="font-semibold mb-2">
                                    {answerState.isCorrect ? "✓ Jawaban Benar!" : "✗ Jawaban Salah!"}
                                </p>
                                {!answerState.isCorrect && (
                                    <p className="text-sm mb-2">
                                        <span className="font-semibold">Jawaban yang benar: </span>
                                        <span className="text-green-700 font-semibold">{currentQ.answer}</span>
                                    </p>
                                )}
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">Penjelasan: </span>
                                    {currentQ.explanation}
                                </p>
                            </motion.div>
                        )}

                        {/* Next Button */}
                        {answerState.isAnswered && (
                            <motion.button
                                onClick={handleNextQuestion}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {currentQuestion === totalQuestions - 1
                                    ? "Lihat Hasil Akhir"
                                    : "Pertanyaan Berikutnya →"}
                            </motion.button>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </>
    );
}
