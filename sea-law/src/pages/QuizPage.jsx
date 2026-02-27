import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, XCircle, RotateCcw, Trophy, ArrowRight } from 'lucide-react';
import { quizQuestions, quizCategories } from '../data/quiz-questions';

const TOTAL_QUESTIONS = 10;

const difficultyOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'easy', label: 'Dễ' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'hard', label: 'Khó' },
];

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getPerformanceMessage(score) {
  if (score >= 8) return { text: 'Xuất sắc! Bạn am hiểu rất tốt về biển đảo Việt Nam!', color: 'text-emerald-600 dark:text-emerald-400' };
  if (score >= 6) return { text: 'Tốt! Bạn có kiến thức khá vững về biển đảo.', color: 'text-blue-600 dark:text-blue-400' };
  if (score >= 4) return { text: 'Cần cố gắng thêm! Hãy tìm hiểu thêm về biển đảo Việt Nam.', color: 'text-yellow-600 dark:text-yellow-400' };
  return { text: 'Hãy học thêm! Kiến thức biển đảo rất quan trọng với mỗi người Việt Nam.', color: 'text-red-600 dark:text-red-400' };
}

export default function QuizPage() {
  const [gameState, setGameState] = useState('start');
  const [difficulty, setDifficulty] = useState('all');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const startQuiz = useCallback(() => {
    const pool = difficulty === 'all'
      ? quizQuestions
      : quizQuestions.filter(q => q.difficulty === difficulty);
    const selected = shuffleArray(pool).slice(0, TOTAL_QUESTIONS);
    setQuestions(selected);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswers([]);
    setGameState('playing');
  }, [difficulty]);

  const handleAnswer = useCallback((optionIndex) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIndex);
    const isCorrect = optionIndex === questions[currentIndex].correct;
    if (isCorrect) setScore(prev => prev + 1);
    setAnswers(prev => [...prev, { question: questions[currentIndex], selected: optionIndex, isCorrect }]);
  }, [selectedAnswer, questions, currentIndex]);

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setGameState('result');
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
    }
  }, [currentIndex, questions.length]);

  const restart = useCallback(() => {
    setGameState('start');
    setSelectedAnswer(null);
    setScore(0);
    setAnswers([]);
    setCurrentIndex(0);
  }, []);

  const incorrectAnswers = useMemo(
    () => answers.filter(a => !a.isCorrect),
    [answers]
  );

  const performance = useMemo(() => getPerformanceMessage(score), [score]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {/* ===== START SCREEN ===== */}
          {gameState === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/40 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Brain size={40} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Trắc nghiệm kiến thức biển đảo
              </h1>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
                Kiểm tra hiểu biết của bạn về Luật Biển, lịch sử chủ quyền, địa lý biển đảo
                và các sự kiện quan trọng liên quan đến Biển Đông Việt Nam. Mỗi bài gồm {TOTAL_QUESTIONS} câu hỏi ngẫu nhiên.
              </p>

              {/* Difficulty selector */}
              <div className="mb-10">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Chọn độ khó</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {difficultyOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setDifficulty(opt.value)}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                        difficulty === opt.value
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startQuiz}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-2xl text-lg shadow-xl shadow-blue-600/25 hover:shadow-2xl hover:shadow-blue-600/40 transition-shadow"
              >
                Bắt đầu
              </motion.button>
            </motion.div>
          )}

          {/* ===== PLAYING SCREEN ===== */}
          {gameState === 'playing' && questions.length > 0 && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Câu {currentIndex + 1} / {questions.length}
                  </span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    Điểm: {score}
                  </span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Category badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  {quizCategories[questions[currentIndex].category] || questions[currentIndex].category}
                </span>
              </div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-8 leading-relaxed">
                    {questions[currentIndex].question}
                  </h2>

                  {/* Options */}
                  <div className="grid gap-3">
                    {questions[currentIndex].options.map((option, idx) => {
                      const isSelected = selectedAnswer === idx;
                      const isCorrect = idx === questions[currentIndex].correct;
                      const hasAnswered = selectedAnswer !== null;

                      let cardClass = 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md cursor-pointer';
                      if (hasAnswered) {
                        if (isCorrect) {
                          cardClass = 'bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-500 dark:border-emerald-400';
                        } else if (isSelected && !isCorrect) {
                          cardClass = 'bg-red-50 dark:bg-red-900/30 border-2 border-red-500 dark:border-red-400';
                        } else {
                          cardClass = 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 opacity-50';
                        }
                      }

                      return (
                        <motion.button
                          key={idx}
                          whileHover={!hasAnswered ? { scale: 1.01 } : {}}
                          whileTap={!hasAnswered ? { scale: 0.99 } : {}}
                          onClick={() => handleAnswer(idx)}
                          disabled={hasAnswered}
                          className={`w-full p-4 sm:p-5 rounded-xl text-left transition-all flex items-center gap-4 ${cardClass}`}
                        >
                          <span className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                            hasAnswered && isCorrect
                              ? 'bg-emerald-500 text-white'
                              : hasAnswered && isSelected && !isCorrect
                                ? 'bg-red-500 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}>
                            {hasAnswered && isCorrect ? (
                              <CheckCircle size={18} />
                            ) : hasAnswered && isSelected && !isCorrect ? (
                              <XCircle size={18} />
                            ) : (
                              String.fromCharCode(65 + idx)
                            )}
                          </span>
                          <span className={`font-medium ${
                            hasAnswered && isCorrect
                              ? 'text-emerald-700 dark:text-emerald-300'
                              : hasAnswered && isSelected && !isCorrect
                                ? 'text-red-700 dark:text-red-300'
                                : 'text-slate-700 dark:text-slate-200'
                          }`}>
                            {option}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <AnimatePresence>
                    {selectedAnswer !== null && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6"
                      >
                        <div className="p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">Giải thích:</p>
                          <p className="text-sm text-blue-700 dark:text-blue-200 leading-relaxed">
                            {questions[currentIndex].explanation}
                          </p>
                        </div>

                        <div className="flex justify-end mt-6">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={nextQuestion}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl transition-shadow"
                          >
                            {currentIndex + 1 >= questions.length ? 'Xem kết quả' : 'Câu tiếp theo'}
                            <ArrowRight size={18} />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* ===== RESULT SCREEN ===== */}
          {gameState === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              {/* Score display */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="w-28 h-28 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/30"
              >
                <Trophy size={48} className="text-white" />
              </motion.div>

              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Kết quả
              </h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-5xl sm:text-6xl font-black text-blue-600 dark:text-blue-400 mb-4"
              >
                {score}/{questions.length}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className={`text-lg font-semibold mb-10 ${performance.color}`}
              >
                {performance.text}
              </motion.p>

              {/* Incorrect answers review */}
              {incorrectAnswers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mb-10 text-left"
                >
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Các câu trả lời sai ({incorrectAnswers.length})
                  </h3>
                  <div className="space-y-4">
                    {incorrectAnswers.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                      >
                        <p className="font-semibold text-slate-900 dark:text-white mb-3">
                          {item.question.question}
                        </p>
                        <div className="flex items-start gap-2 mb-2">
                          <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-red-600 dark:text-red-400">
                            Bạn chọn: {item.question.options[item.selected]}
                          </p>
                        </div>
                        <div className="flex items-start gap-2 mb-3">
                          <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-emerald-600 dark:text-emerald-400">
                            Đáp án đúng: {item.question.options[item.question.correct]}
                          </p>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                          {item.question.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Restart button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={restart}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-2xl text-lg shadow-xl shadow-blue-600/25 hover:shadow-2xl hover:shadow-blue-600/40 transition-shadow"
              >
                <RotateCcw size={20} />
                Làm lại
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
