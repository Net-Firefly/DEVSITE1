import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const QUESTIONS = [
    { q: "How often should you get a professional haircut to maintain shape?", a: ["Every week", "Every 4-6 weeks", "Every 6 months"], correct: 1 },
    { q: "Which treatment is best for adding shine to hair?", a: ["Blackshampoo", "Builder Gel", "Creme of Nature"], correct: 2 },
    { q: "What's the healthiest way to care for nails?", a: ["Avoid trimming", "Regular manicure and moisturize", "Use acetone daily"], correct: 1 },
    { q: "How long should a typical manicure session take?", a: ["15 minutes", "45 minutes", "2 hours"], correct: 1 },
    { q: "What tool is commonly used to blend hair sections?", a: ["Scissors", "Razor", "Clippers"], correct: 2 },
    { q: "Which product helps reduce frizz?", a: ["Oil serum", "Dry shampoo", "Hair dye"], correct: 0 },
    { q: "What's a common aftercare for a facial?", a: ["Exfoliate immediately", "Moisturize and avoid sun", "Use strong acids"], correct: 1 },
    { q: "How often should you replace a razor blade for best shave?", a: ["Every day", "Every 1-2 weeks", "Every 6 months"], correct: 1 },
    { q: "Which color service adds subtle highlights?", a: ["Full dye", "Balayage", "Bleach only"], correct: 1 },
    { q: "Best practice before a manicure is to...", a: ["Soak hands", "Skip cleaning", "Use hot water only"], correct: 0 },
    { q: "What does 'fade' usually refer to?", a: ["Nail style", "Haircut tapering", "Facial massage"], correct: 1 },
    { q: "Which is recommended for dry scalp?", a: ["Clarifying shampoo", "Hydrating oil treatment", "No washing"], correct: 1 },
];

const NUM_QUESTIONS = 3;

const prizes = [
    { score: 3, text: "Free VIP Cut" },
    { score: 2, text: "50% off Manicure" },
    { score: 1, text: "10% off next visit" },
];

const Quiz = () => {
    const [index, setIndex] = useState(0);
    const [questionIndices, setQuestionIndices] = useState<number[]>([]);
    const [choices, setChoices] = useState<number[]>(Array(NUM_QUESTIONS).fill(-1));
    const [submitted, setSubmitted] = useState(false);
    const [claimed, setClaimed] = useState(false);
    const [claimName, setClaimName] = useState("");
    const [claimEmail, setClaimEmail] = useState("");

    const select = (i: number) => {
        const copy = [...choices];
        copy[index] = i;
        setChoices(copy);
    };

    const next = () => setIndex((i) => Math.min(i + 1, Math.max(0, questionIndices.length - 1)));
    const prev = () => setIndex((i) => Math.max(i - 1, 0));

    const displayedQuestions = questionIndices.map((i) => QUESTIONS[i]);

    const score = () =>
        choices.reduce((acc, val, i) => (val === displayedQuestions[i]?.correct ? acc + 1 : acc), 0);

    const handleSubmit = () => setSubmitted(true);

    const prize = prizes.find((p) => score() >= p.score) || null;

    // Generate a unique set of question indices on mount / play again
    useEffect(() => {
        const key = 'quiz_sets_used';

        const getUsed = () => {
            try { return JSON.parse(localStorage.getItem(key) || '[]') as string[]; } catch { return []; }
        };

        const saveUsed = (arr: string[]) => localStorage.setItem(key, JSON.stringify(arr));

        const allIdx = QUESTIONS.map((_, i) => i);

        const pickSet = (): number[] => {
            const attemptLimit = 1000;
            let attempts = 0;
            const used = getUsed();

            while (attempts < attemptLimit) {
                // shuffle and slice
                const shuffled = allIdx.slice().sort(() => Math.random() - 0.5);
                const picked = shuffled.slice(0, NUM_QUESTIONS).sort((a, b) => a - b);
                const keyStr = picked.join(',');
                if (!used.includes(keyStr)) {
                    used.push(keyStr);
                    // if all combos used, clear older entries (keep recent)
                    const maxStored = 5000;
                    if (used.length > maxStored) used.splice(0, used.length - maxStored);
                    saveUsed(used);
                    return picked;
                }
                attempts++;
            }

            // If we failed to find an unused set (pool likely exhausted), clear and pick fresh
            saveUsed([]);
            const fresh = allIdx.slice().sort(() => Math.random() - 0.5).slice(0, NUM_QUESTIONS).sort((a, b) => a - b);
            saveUsed([fresh.join(',')]);
            return fresh;
        };

        const picked = pickSet();
        setQuestionIndices(picked);
        setChoices(Array(picked.length).fill(-1));
        setIndex(0);
    }, []);

    const handleClaim = async () => {
        if (!claimEmail || !claimName) return;
        const payload = { name: claimName, email: claimEmail, prize: prize?.text || null, score: score(), date: new Date().toISOString() };
        try {
            const res = await fetch('/api/quiz-claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setClaimed(true);
                return;
            }
            // otherwise fallback to localStorage
            throw new Error('Server returned non-OK');
        } catch (e) {
            try {
                const key = 'quiz_claims';
                const existing = JSON.parse(localStorage.getItem(key) || '[]');
                existing.push(payload);
                localStorage.setItem(key, JSON.stringify(existing));
                setClaimed(true);
            } catch (err) {
                console.error('Failed to save claim locally:', err);
            }
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-6 py-20">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
                    <h1 className="font-display text-4xl font-bold mb-4">Tripple Kay Quiz</h1>
                    <p className="text-muted-foreground mb-6">Answer three quick questions for a chance to win free services and discounts.</p>

                    {!submitted ? (
                        <div className="space-y-6">
                            <div className="glass-card p-6">
                                <div className="mb-4">
                                    <div className="font-body text-sm text-muted-foreground">Question {index + 1} of {displayedQuestions.length || NUM_QUESTIONS}</div>
                                    <h2 className="font-display text-xl font-bold">{displayedQuestions[index]?.q || '...'}</h2>
                                </div>

                                <div className="grid gap-3">
                                    {(displayedQuestions[index]?.a || []).map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => select(i)}
                                            className={`text-left p-3 rounded border ${choices[index] === i ? "border-primary bg-primary/5" : "border-border"}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={prev} className="px-4 py-2 rounded border">Back</button>
                                {index < (displayedQuestions.length ? displayedQuestions.length - 1 : NUM_QUESTIONS - 1) ? (
                                    <button onClick={next} className="ml-auto px-4 py-2 rounded btn-gold-glow">Next</button>
                                ) : (
                                    <button onClick={handleSubmit} className="ml-auto px-4 py-2 rounded btn-gold-glow">Submit</button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card p-6 text-center">
                            <h2 className="font-display text-2xl font-bold mb-2">Your Score: {score()}/{displayedQuestions.length || NUM_QUESTIONS}</h2>
                            {prize ? (
                                <div>
                                    <p className="mb-4">Congratulations! You won: <strong>{prize.text}</strong></p>
                                    {!claimed ? (
                                        <div className="space-y-3">
                                            <p className="text-sm text-muted-foreground">Enter your name and email to claim your prize.</p>
                                            <input value={claimName} onChange={(e) => setClaimName(e.target.value)} placeholder="Full name" className="w-full p-2 rounded border border-gold-glow bg-primary/5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                            <input value={claimEmail} onChange={(e) => setClaimEmail(e.target.value)} placeholder="Email" className="w-full p-2 rounded border border-gold-glow bg-primary/5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                            <div className="flex gap-3 justify-center mt-2">
                                                <button onClick={handleClaim} className="px-4 py-2 rounded btn-gold-glow">Claim Prize</button>
                                                <button onClick={() => {
                                                    // regenerate a fresh set when replaying
                                                    const allIdx = QUESTIONS.map((_, i) => i);
                                                    const picked = allIdx.slice().sort(() => Math.random() - 0.5).slice(0, NUM_QUESTIONS).sort((a, b) => a - b);
                                                    setQuestionIndices(picked);
                                                    setChoices(Array(picked.length).fill(-1));
                                                    setSubmitted(false);
                                                    setIndex(0);
                                                }} className="px-4 py-2 rounded border">Play Again</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="mb-2">Thanks! Your claim was recorded. We'll contact you at <strong>{claimEmail}</strong>.</p>
                                            <p className="text-sm text-muted-foreground">Show this confirmation on arrival or check your email for details.</p>
                                            <div className="mt-4">
                                                <button onClick={() => { setIndex(0); setChoices(Array(displayedQuestions.length || NUM_QUESTIONS).fill(-1)); setSubmitted(false); setClaimed(false); setClaimName(''); setClaimEmail(''); }} className="px-4 py-2 rounded border">Play Again</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <p className="mb-4">Good try — you earned a discount on your next visit!</p>
                                    <div className="mt-4">
                                        <button onClick={() => { setIndex(0); setChoices(Array(displayedQuestions.length || NUM_QUESTIONS).fill(-1)); setSubmitted(false); }} className="px-4 py-2 rounded border">Play Again</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default Quiz;
