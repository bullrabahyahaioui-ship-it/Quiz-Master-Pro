import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { type Category, type Question, getQuestionsForCategory } from "@/data/questions";

export type LifelineType = "fiftyFifty" | "extraTime" | "hint";

export interface LeaderboardEntry {
  id: string;
  category: Category;
  score: number;
  total: number;
  percentage: number;
  timestamp: number;
}

export type QuizPhase =
  | "idle"
  | "answering"
  | "answered"
  | "interstitial"
  | "reward_ad"
  | "complete";

interface Lifelines {
  fiftyFifty: number;
  extraTime: number;
  hint: number;
}

interface QuizState {
  category: Category | null;
  questions: Question[];
  currentIndex: number;
  score: number;
  timeLeft: number;
  totalTime: number;
  lifelines: Lifelines;
  eliminatedOptions: number[];
  hintText: string | null;
  selectedAnswer: number | null;
  phase: QuizPhase;
  pendingLifeline: LifelineType | null;
  leaderboard: LeaderboardEntry[];
}

interface QuizContextValue extends QuizState {
  startQuiz: (category: Category) => void;
  selectAnswer: (index: number) => void;
  requestLifeline: (type: LifelineType) => void;
  confirmLifelineAd: () => void;
  cancelLifelineAd: () => void;
  nextQuestion: () => void;
  dismissInterstitial: () => void;
  resetQuiz: () => void;
}

export const INITIAL_TIME = 10;
const LEADERBOARD_KEY = "quizmaster_leaderboard_v1";
const TOTAL_QUESTIONS = 10;

const defaultState: QuizState = {
  category: null,
  questions: [],
  currentIndex: 0,
  score: 0,
  timeLeft: INITIAL_TIME,
  totalTime: INITIAL_TIME,
  lifelines: { fiftyFifty: 3, extraTime: 3, hint: 3 },
  eliminatedOptions: [],
  hintText: null,
  selectedAnswer: null,
  phase: "idle",
  pendingLifeline: null,
  leaderboard: [],
};

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<QuizState>(defaultState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionCountRef = useRef(0);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (duration: number) => {
      stopTimer();
      if (duration <= 0) return;
      timerRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.phase !== "answering") {
            return prev;
          }
          if (prev.timeLeft <= 1) {
            stopTimer();
            return {
              ...prev,
              timeLeft: 0,
              phase: "answered" as QuizPhase,
              selectedAnswer: null,
            };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    },
    [stopTimer]
  );

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  const loadLeaderboard = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(LEADERBOARD_KEY);
      if (data) {
        const parsed: LeaderboardEntry[] = JSON.parse(data);
        setState((prev) => ({ ...prev, leaderboard: parsed }));
      }
    } catch {}
  }, []);

  const saveLeaderboard = useCallback(async (entries: LeaderboardEntry[]) => {
    try {
      await AsyncStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
    } catch {}
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const startQuiz = useCallback(
    (category: Category) => {
      stopTimer();
      questionCountRef.current = 0;
      const questions = getQuestionsForCategory(category);
      setState((prev) => ({
        ...defaultState,
        category,
        questions,
        phase: "answering",
        leaderboard: prev.leaderboard,
      }));
    },
    [stopTimer]
  );

  // Start timer whenever phase becomes 'answering' (new question or returning from lifeline ad)
  useEffect(() => {
    if (state.phase === "answering") {
      startTimer(state.timeLeft);
    } else {
      stopTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.currentIndex]);

  // Save leaderboard on quiz complete
  useEffect(() => {
    if (state.phase === "complete" && state.category) {
      const entry: LeaderboardEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        category: state.category,
        score: state.score,
        total: TOTAL_QUESTIONS,
        percentage: Math.round((state.score / TOTAL_QUESTIONS) * 100),
        timestamp: Date.now(),
      };
      setState((prev) => {
        const updated = [...prev.leaderboard, entry]
          .sort((a, b) => b.score - a.score || b.percentage - a.percentage)
          .slice(0, 10);
        saveLeaderboard(updated);
        return { ...prev, leaderboard: updated };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  const selectAnswer = useCallback(
    (index: number) => {
      stopTimer();
      setState((prev) => {
        if (prev.phase !== "answering") return prev;
        const correct = prev.questions[prev.currentIndex]?.correctIndex;
        const isCorrect = index === correct;
        return {
          ...prev,
          selectedAnswer: index,
          score: isCorrect ? prev.score + 1 : prev.score,
          phase: "answered",
        };
      });
    },
    [stopTimer]
  );

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== "answered") return prev;
      const nextIndex = prev.currentIndex + 1;

      if (nextIndex >= TOTAL_QUESTIONS) {
        return { ...prev, phase: "complete" };
      }

      questionCountRef.current += 1;
      const showInterstitial = questionCountRef.current % 3 === 0;

      return {
        ...prev,
        currentIndex: nextIndex,
        selectedAnswer: null,
        eliminatedOptions: [],
        hintText: null,
        timeLeft: INITIAL_TIME,
        totalTime: INITIAL_TIME,
        phase: showInterstitial ? "interstitial" : "answering",
      };
    });
  }, []);

  const requestLifeline = useCallback(
    (type: LifelineType) => {
      setState((prev) => {
        if (prev.phase !== "answering") return prev;
        if (prev.lifelines[type] <= 0) return prev;
        stopTimer();
        return { ...prev, phase: "reward_ad", pendingLifeline: type };
      });
    },
    [stopTimer]
  );

  const confirmLifelineAd = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== "reward_ad" || !prev.pendingLifeline) return prev;
      const type = prev.pendingLifeline;
      const question = prev.questions[prev.currentIndex];

      const updates: Partial<QuizState> = {
        phase: "answering" as QuizPhase,
        pendingLifeline: null,
        lifelines: {
          ...prev.lifelines,
          [type]: prev.lifelines[type] - 1,
        },
      };

      if (type === "fiftyFifty") {
        const wrong: number[] = [];
        for (let i = 0; i < question.options.length; i++) {
          if (i !== question.correctIndex) wrong.push(i);
        }
        const shuffled = wrong.sort(() => Math.random() - 0.5);
        updates.eliminatedOptions = shuffled.slice(0, 2);
      } else if (type === "extraTime") {
        updates.timeLeft = prev.timeLeft + 10;
        updates.totalTime = prev.totalTime + 10;
      } else if (type === "hint") {
        updates.hintText = question.hint;
      }

      return { ...prev, ...updates };
    });
    // Timer restarts via the useEffect watching phase + currentIndex changes
  }, []);

  const cancelLifelineAd = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== "reward_ad") return prev;
      return { ...prev, phase: "answering", pendingLifeline: null };
    });
    // Timer restarts via the useEffect watching phase changes
  }, []);

  const dismissInterstitial = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== "interstitial") return prev;
      return {
        ...prev,
        timeLeft: INITIAL_TIME,
        totalTime: INITIAL_TIME,
        phase: "answering",
      };
    });
    // Timer restarts via the useEffect watching phase changes
  }, []);

  const resetQuiz = useCallback(() => {
    stopTimer();
    questionCountRef.current = 0;
    setState((prev) => ({ ...defaultState, leaderboard: prev.leaderboard }));
  }, [stopTimer]);

  const value: QuizContextValue = {
    ...state,
    startQuiz,
    selectAnswer,
    requestLifeline,
    confirmLifelineAd,
    cancelLifelineAd,
    nextQuestion,
    dismissInterstitial,
    resetQuiz,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used inside QuizProvider");
  return ctx;
}
