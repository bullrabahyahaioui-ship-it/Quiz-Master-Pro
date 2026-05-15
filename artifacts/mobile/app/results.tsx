import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";
import { useQuiz } from "@/contexts/QuizContext";
import { useColors } from "@/hooks/useColors";

const TOTAL_QUESTIONS = 10;

function getGrade(percentage: number) {
  if (percentage >= 90) return { grade: "A+", label: "Outstanding!", color: "#22C55E" };
  if (percentage >= 80) return { grade: "A", label: "Excellent!", color: "#22C55E" };
  if (percentage >= 70) return { grade: "B", label: "Great Job!", color: "#3B82F6" };
  if (percentage >= 60) return { grade: "C", label: "Good Work!", color: "#F59E0B" };
  if (percentage >= 50) return { grade: "D", label: "Keep Trying!", color: "#F97316" };
  return { grade: "F", label: "Practice More!", color: "#EF4444" };
}

export default function ResultsScreen() {
  const appColors = useColors();
  const insets = useSafeAreaInsets();
  const { score, category, startQuiz, resetQuiz } = useQuiz();

  const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);
  const { grade, label, color } = getGrade(percentage);

  const catInfo = category ? colors.category[category] : null;
  const catColor = catInfo ? catInfo.color : appColors.primary;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const circleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Haptics.notificationAsync(
      percentage >= 70
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Warning
    );
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    Animated.timing(circleAnim, {
      toValue: percentage / 100,
      duration: 1200,
      delay: 200,
      useNativeDriver: false,
    }).start();
  }, []);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handlePlayAgain = () => {
    if (category) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      startQuiz(category);
      router.replace("/quiz");
    }
  };

  const handleHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resetQuiz();
    router.replace("/");
  };

  const handleLeaderboard = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/leaderboard");
  };

  const statsRows = [
    {
      label: "Score",
      value: `${score} / ${TOTAL_QUESTIONS}`,
      icon: "star",
      color: catColor,
    },
    {
      label: "Accuracy",
      value: `${percentage}%`,
      icon: "checkmark-circle",
      color: "#22C55E",
    },
    {
      label: "Grade",
      value: grade,
      icon: "school",
      color,
    },
    {
      label: "Category",
      value: category
        ? category.charAt(0).toUpperCase() + category.slice(1)
        : "—",
      icon: catInfo ? (catInfo.icon as any) : "help",
      color: catColor,
    },
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: appColors.background, paddingTop: topPad },
      ]}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Pressable onPress={handleHome} style={styles.homeBtn}>
          <Ionicons name="home" size={22} color={appColors.mutedForeground} />
        </Pressable>
        <Pressable onPress={handleLeaderboard} style={styles.leaderBtn}>
          <Ionicons name="trophy" size={20} color="#F59E0B" />
        </Pressable>
      </View>

      <Animated.View
        style={[styles.scoreCircle, { transform: [{ scale: scaleAnim }] }]}
      >
        <View
          style={[styles.circleOuter, { borderColor: `${catColor}33` }]}
        >
          <View style={[styles.circleInner, { borderColor: catColor }]}>
            <Text style={[styles.gradeText, { color }]}>{grade}</Text>
            <Text style={[styles.scoreNumber, { color: appColors.foreground }]}>
              {score}/{TOTAL_QUESTIONS}
            </Text>
            <Text style={[styles.percentText, { color: appColors.mutedForeground }]}>
              {percentage}%
            </Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
        <Text style={[styles.resultLabel, { color }]}>{label}</Text>
        <Text
          style={[styles.resultSub, { color: appColors.mutedForeground }]}
        >
          {percentage >= 80
            ? "You're a quiz champion!"
            : percentage >= 60
              ? "Solid performance, keep it up!"
              : "Review and try again — you've got this!"}
        </Text>
      </Animated.View>

      <Animated.View style={[styles.statsGrid, { opacity: fadeAnim }]}>
        {statsRows.map((stat) => (
          <View
            key={stat.label}
            style={[styles.statCard, { backgroundColor: appColors.card }]}
          >
            <Ionicons name={stat.icon as any} size={18} color={stat.color} />
            <Text style={[styles.statValue, { color: appColors.foreground }]}>
              {stat.value}
            </Text>
            <Text style={[styles.statLabel, { color: appColors.mutedForeground }]}>
              {stat.label}
            </Text>
          </View>
        ))}
      </Animated.View>

      <View style={[styles.actions, { paddingBottom: bottomPad + 16 }]}>
        <Pressable
          onPress={handlePlayAgain}
          style={[styles.playAgainBtn, { backgroundColor: catColor }]}
          testID="play-again-button"
        >
          <Ionicons name="refresh" size={20} color="#FFFFFF" />
          <Text style={styles.playAgainText}>Play Again</Text>
        </Pressable>
        <Pressable
          onPress={handleHome}
          style={[
            styles.homeActionBtn,
            { backgroundColor: appColors.card, borderColor: appColors.border },
          ]}
          testID="home-button"
        >
          <Ionicons name="grid" size={20} color={appColors.foreground} />
          <Text style={[styles.homeActionText, { color: appColors.foreground }]}>
            Choose Category
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 20,
  },
  homeBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  leaderBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreCircle: {
    alignItems: "center",
    marginBottom: 20,
  },
  circleOuter: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  circleInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  gradeText: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
  },
  scoreNumber: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  percentText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  resultLabel: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    marginBottom: 6,
  },
  resultSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 24,
    marginBottom: 8,
  },
  statCard: {
    width: "47%",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    gap: 6,
  },
  statValue: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  actions: {
    marginTop: "auto",
    gap: 12,
  },
  playAgainBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  playAgainText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontFamily: "Inter_700Bold",
  },
  homeActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  homeActionText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
});
