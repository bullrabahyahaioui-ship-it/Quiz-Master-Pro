import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";
import { useQuiz, type LifelineType } from "@/contexts/QuizContext";
import { useColors } from "@/hooks/useColors";

function AnswerButton({
  text,
  index,
  selectedAnswer,
  correctIndex,
  eliminated,
  onPress,
  disabled,
}: {
  text: string;
  index: number;
  selectedAnswer: number | null;
  correctIndex: number;
  eliminated: boolean;
  onPress: () => void;
  disabled: boolean;
}) {
  const appColors = useColors();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  const isSelected = selectedAnswer === index;
  const isCorrect = index === correctIndex;
  const isAnswered = selectedAnswer !== null;

  let borderColor = appColors.border;
  let bgColor = appColors.card;
  let textColor = appColors.foreground;
  let labelBg = appColors.muted;
  let labelText = appColors.mutedForeground;

  const labels = ["A", "B", "C", "D"];

  if (isAnswered && isCorrect) {
    borderColor = "#22C55E";
    bgColor = "rgba(34,197,94,0.15)";
    textColor = "#22C55E";
    labelBg = "#22C55E";
    labelText = "#FFFFFF";
  } else if (isAnswered && isSelected && !isCorrect) {
    borderColor = "#EF4444";
    bgColor = "rgba(239,68,68,0.15)";
    textColor = "#EF4444";
    labelBg = "#EF4444";
    labelText = "#FFFFFF";
  }

  if (eliminated) {
    borderColor = appColors.border;
    bgColor = "rgba(0,0,0,0.1)";
    textColor = appColors.mutedForeground;
    labelBg = appColors.muted;
    labelText = appColors.mutedForeground;
  }

  const handlePressIn = () => {
    if (disabled || eliminated) return;
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || eliminated}
        style={[
          styles.answerBtn,
          { backgroundColor: bgColor, borderColor },
          eliminated && styles.answerBtnEliminated,
        ]}
        testID={`answer-${index}`}
      >
        <View style={[styles.answerLabel, { backgroundColor: labelBg }]}>
          <Text style={[styles.answerLabelText, { color: labelText }]}>
            {labels[index]}
          </Text>
        </View>
        <Text
          style={[
            styles.answerText,
            { color: textColor },
            eliminated && styles.answerTextEliminated,
          ]}
          numberOfLines={2}
        >
          {text}
        </Text>
        {isAnswered && isCorrect && (
          <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
        )}
        {isAnswered && isSelected && !isCorrect && (
          <Ionicons name="close-circle" size={20} color="#EF4444" />
        )}
        {eliminated && (
          <Ionicons name="close" size={18} color={appColors.mutedForeground} />
        )}
      </Pressable>
    </Animated.View>
  );
}

function LifelineButton({
  icon,
  label,
  count,
  onPress,
  disabled,
  color,
}: {
  icon: string;
  label: string;
  count: number;
  onPress: () => void;
  disabled: boolean;
  color: string;
}) {
  const appColors = useColors();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, { toValue: 0.9, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.lifelineBtn,
          {
            backgroundColor: disabled ? appColors.muted : `${color}22`,
            borderColor: disabled ? appColors.border : color,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        testID={`lifeline-${label.toLowerCase().replace(/\s/g, "-")}`}
      >
        <Ionicons name={icon as any} size={18} color={disabled ? appColors.mutedForeground : color} />
        <Text
          style={[
            styles.lifelineBtnText,
            { color: disabled ? appColors.mutedForeground : color },
          ]}
        >
          {count}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function InterstitialAdModal({
  visible,
  onDismiss,
}: {
  visible: boolean;
  onDismiss: () => void;
}) {
  const appColors = useColors();
  const [countdown, setCountdown] = useState(3);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      setCountdown(3);
      progressAnim.setValue(0);
      return;
    }
    setCountdown(3);
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [visible]);

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.adModalOverlay}>
        <View style={[styles.adModalBox, { backgroundColor: appColors.card }]}>
          <Text style={[styles.adModalLabel, { color: appColors.mutedForeground }]}>
            ADVERTISEMENT
          </Text>
          <View
            style={[styles.adModalContent, { backgroundColor: appColors.muted }]}
          >
            <Ionicons name="megaphone" size={40} color={appColors.primary} />
            <Text style={[styles.adModalTitle, { color: appColors.foreground }]}>
              Sponsored Content
            </Text>
            <Text style={[styles.adModalBody, { color: appColors.mutedForeground }]}>
              Your next great adventure awaits.{"\n"}Discover it today!
            </Text>
          </View>
          <View style={[styles.adProgressTrack, { backgroundColor: appColors.muted }]}>
            <Animated.View
              style={[
                styles.adProgressBar,
                { width: barWidth, backgroundColor: appColors.primary },
              ]}
            />
          </View>
          <Text style={[styles.adCountdown, { color: appColors.mutedForeground }]}>
            Closing in {countdown}s
          </Text>
        </View>
      </View>
    </Modal>
  );
}

function RewardedAdModal({
  visible,
  lifelineName,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  lifelineName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const appColors = useColors();
  const [watching, setWatching] = useState(false);
  const [done, setDone] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [adProgress, setAdProgress] = useState(0);

  useEffect(() => {
    if (!visible) {
      setWatching(false);
      setDone(false);
      progressAnim.setValue(0);
      setAdProgress(0);
    }
  }, [visible]);

  const watchAd = () => {
    setWatching(true);
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      setDone(true);
    });
    const interval = setInterval(() => {
      setAdProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 33;
      });
    }, 1000);
  };

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.adModalOverlay}>
        <View
          style={[styles.rewardModalBox, { backgroundColor: appColors.card }]}
        >
          <View style={styles.rewardHeader}>
            <Ionicons name="gift" size={24} color="#F59E0B" />
            <Text style={[styles.rewardTitle, { color: appColors.foreground }]}>
              Use Lifeline
            </Text>
            <Pressable onPress={onCancel}>
              <Ionicons name="close" size={22} color={appColors.mutedForeground} />
            </Pressable>
          </View>

          <Text style={[styles.rewardBody, { color: appColors.mutedForeground }]}>
            Watch a short ad to unlock{"\n"}
            <Text style={{ color: appColors.primary, fontFamily: "Inter_700Bold" }}>
              {lifelineName}
            </Text>
          </Text>

          {!watching && !done && (
            <Pressable
              onPress={watchAd}
              style={[styles.watchAdBtn, { backgroundColor: "#F59E0B" }]}
            >
              <Ionicons name="play-circle" size={20} color="#FFFFFF" />
              <Text style={styles.watchAdBtnText}>Watch Ad</Text>
            </Pressable>
          )}

          {watching && !done && (
            <View style={styles.watchingContainer}>
              <Text style={[styles.watchingText, { color: appColors.mutedForeground }]}>
                Watching ad...
              </Text>
              <View
                style={[styles.adProgressTrack, { backgroundColor: appColors.muted }]}
              >
                <Animated.View
                  style={[
                    styles.adProgressBar,
                    { width: barWidth, backgroundColor: "#F59E0B" },
                  ]}
                />
              </View>
            </View>
          )}

          {done && (
            <Pressable
              onPress={onConfirm}
              style={[styles.claimBtn, { backgroundColor: "#22C55E" }]}
            >
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.claimBtnText}>Claim Lifeline!</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default function QuizScreen() {
  const appColors = useColors();
  const insets = useSafeAreaInsets();
  const {
    category,
    questions,
    currentIndex,
    score,
    timeLeft,
    totalTime,
    lifelines,
    eliminatedOptions,
    hintText,
    selectedAnswer,
    phase,
    pendingLifeline,
    selectAnswer,
    requestLifeline,
    confirmLifelineAd,
    cancelLifelineAd,
    nextQuestion,
    dismissInterstitial,
    resetQuiz,
  } = useQuiz();

  const timerBarAnim = useRef(new Animated.Value(1)).current;
  const questionFadeAnim = useRef(new Animated.Value(0)).current;
  const prevIndex = useRef(-1);

  useEffect(() => {
    if (phase === "complete") {
      router.replace("/results");
    }
  }, [phase]);

  useEffect(() => {
    if (!category) {
      router.replace("/");
    }
  }, [category]);

  useEffect(() => {
    if (currentIndex !== prevIndex.current) {
      prevIndex.current = currentIndex;
      questionFadeAnim.setValue(0);
      Animated.timing(questionFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      timerBarAnim.setValue(1);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (phase === "answering") {
      const ratio = timeLeft / (totalTime || INITIAL_TIME);
      Animated.timing(timerBarAnim, {
        toValue: ratio,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
  }, [timeLeft]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const question = questions[currentIndex];
  const isAnswered = phase === "answered" || phase === "interstitial";
  const INITIAL_TIME = 10;

  const timerColor = timerBarAnim.interpolate({
    inputRange: [0, 0.3, 0.6, 1],
    outputRange: ["#EF4444", "#F97316", "#EAB308", "#22C55E"],
  });

  const catColor = category ? colors.category[category].color : appColors.primary;

  const handleAnswer = (index: number) => {
    if (phase !== "answering") return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    selectAnswer(index);
  };

  const handleLifeline = (type: LifelineType) => {
    if (phase !== "answering") return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    requestLifeline(type);
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    nextQuestion();
  };

  const handleQuit = () => {
    resetQuiz();
    router.replace("/");
  };

  const lifelineNames: Record<LifelineType, string> = {
    fiftyFifty: "50/50",
    extraTime: "Extra Time",
    hint: "Hint",
  };

  if (!question || !category) return null;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: appColors.background, paddingTop: topPad },
      ]}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.topBar}>
        <Pressable onPress={handleQuit} style={styles.quitBtn}>
          <Ionicons name="close" size={22} color={appColors.mutedForeground} />
        </Pressable>
        <View style={styles.progressDots}>
          {questions.slice(0, 10).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i < currentIndex
                      ? catColor
                      : i === currentIndex
                        ? catColor
                        : appColors.muted,
                  opacity: i === currentIndex ? 1 : i < currentIndex ? 0.6 : 0.3,
                  width: i === currentIndex ? 20 : 8,
                },
              ]}
            />
          ))}
        </View>
        <View style={[styles.scoreBadge, { backgroundColor: catColor }]}>
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      <View style={[styles.timerTrack, { backgroundColor: appColors.muted }]}>
        <Animated.View
          style={[
            styles.timerBar,
            { width: timerBarAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }), backgroundColor: timerColor },
          ]}
        />
      </View>

      <View style={styles.timerRow}>
        <Text style={[styles.timerLabel, { color: appColors.mutedForeground }]}>
          Q{currentIndex + 1} / {questions.length}
        </Text>
        <View style={styles.timerCountdown}>
          <Ionicons name="timer" size={14} color={timeLeft <= 3 ? "#EF4444" : appColors.mutedForeground} />
          <Text
            style={[
              styles.timerNumber,
              { color: timeLeft <= 3 ? "#EF4444" : appColors.mutedForeground },
            ]}
          >
            {timeLeft}s
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.categoryBadge,
          { backgroundColor: `${catColor}22`, borderColor: catColor },
        ]}
      >
        <Ionicons
          name={colors.category[category].icon as any}
          size={12}
          color={catColor}
        />
        <Text style={[styles.categoryBadgeText, { color: catColor }]}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Text>
      </View>

      <Animated.View style={{ opacity: questionFadeAnim }}>
        <Text style={[styles.questionText, { color: appColors.foreground }]}>
          {question.question}
        </Text>
      </Animated.View>

      {hintText && (
        <View
          style={[
            styles.hintBox,
            { backgroundColor: "#F59E0B22", borderColor: "#F59E0B" },
          ]}
        >
          <Ionicons name="bulb" size={14} color="#F59E0B" />
          <Text style={[styles.hintText, { color: "#F59E0B" }]}>{hintText}</Text>
        </View>
      )}

      <View style={styles.answersContainer}>
        {question.options.map((opt, i) => (
          <AnswerButton
            key={i}
            text={opt}
            index={i}
            selectedAnswer={selectedAnswer}
            correctIndex={question.correctIndex}
            eliminated={eliminatedOptions.includes(i)}
            onPress={() => handleAnswer(i)}
            disabled={isAnswered || phase === "reward_ad"}
          />
        ))}
      </View>

      <View style={styles.lifelineRow}>
        <LifelineButton
          icon="remove-circle"
          label="50/50"
          count={lifelines.fiftyFifty}
          color="#818CF8"
          onPress={() => handleLifeline("fiftyFifty")}
          disabled={isAnswered || lifelines.fiftyFifty === 0 || eliminatedOptions.length > 0}
        />
        <LifelineButton
          icon="time"
          label="Extra Time"
          count={lifelines.extraTime}
          color="#22C55E"
          onPress={() => handleLifeline("extraTime")}
          disabled={isAnswered || lifelines.extraTime === 0}
        />
        <LifelineButton
          icon="bulb"
          label="Hint"
          count={lifelines.hint}
          color="#F59E0B"
          onPress={() => handleLifeline("hint")}
          disabled={isAnswered || lifelines.hint === 0 || hintText !== null}
        />
      </View>

      {phase === "answered" && (
        <Pressable
          onPress={handleNext}
          style={[
            styles.nextBtn,
            { backgroundColor: catColor, marginBottom: bottomPad + 12 },
          ]}
        >
          <Text style={styles.nextBtnText}>
            {currentIndex + 1 >= questions.length ? "See Results" : "Next Question"}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </Pressable>
      )}

      <InterstitialAdModal
        visible={phase === "interstitial"}
        onDismiss={dismissInterstitial}
      />

      <RewardedAdModal
        visible={phase === "reward_ad"}
        lifelineName={pendingLifeline ? lifelineNames[pendingLifeline] : ""}
        onConfirm={confirmLifelineAd}
        onCancel={cancelLifelineAd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 12,
  },
  quitBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  progressDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  scoreBadge: {
    minWidth: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  scoreText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  timerTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  timerBar: {
    height: 6,
    borderRadius: 3,
  },
  timerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  timerLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  timerCountdown: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timerNumber: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
  },
  questionText: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    lineHeight: 28,
    marginBottom: 14,
  },
  hintBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  hintText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  answersContainer: {
    gap: 10,
    marginBottom: 16,
    flex: 1,
  },
  answerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  answerBtnEliminated: {
    opacity: 0.4,
  },
  answerLabel: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  answerLabelText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
  answerText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  answerTextEliminated: {
    textDecorationLine: "line-through",
  },
  lifelineRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 8,
  },
  lifelineBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  lifelineBtnText: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  nextBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  adModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  adModalBox: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    padding: 16,
  },
  adModalLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.5,
    textAlign: "center",
    marginBottom: 12,
  },
  adModalContent: {
    borderRadius: 12,
    paddingVertical: 32,
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  adModalTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  adModalBody: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  adProgressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 8,
  },
  adProgressBar: {
    height: 4,
    borderRadius: 2,
  },
  adCountdown: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  rewardModalBox: {
    width: "100%",
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  rewardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rewardTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    flex: 1,
    marginLeft: 10,
  },
  rewardBody: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
  watchAdBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  watchAdBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  watchingContainer: {
    gap: 10,
  },
  watchingText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  claimBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  claimBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
});
