import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";
import { useQuiz, type LeaderboardEntry } from "@/contexts/QuizContext";
import { useColors } from "@/hooks/useColors";

const CATEGORY_ICONS: Record<string, string> = {
  geography: "earth",
  sports: "football",
  science: "flask",
  history: "time",
};

const RANK_COLORS = ["#F59E0B", "#94A3B8", "#CD7C3E"];

function LeaderboardRow({ entry, rank, delay }: { entry: LeaderboardEntry; rank: number; delay: number }) {
  const appColors = useColors();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, delay, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 350, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const catColor = colors.category[entry.category as keyof typeof colors.category]?.color ?? appColors.primary;
  const rankColor = rank <= 3 ? RANK_COLORS[rank - 1] : appColors.mutedForeground;
  const isTop3 = rank <= 3;

  const date = new Date(entry.timestamp);
  const dateStr = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  return (
    <Animated.View
      style={[
        styles.rowContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View
        style={[
          styles.row,
          {
            backgroundColor: isTop3 ? `${rankColor}11` : appColors.card,
            borderColor: isTop3 ? `${rankColor}44` : appColors.border,
          },
        ]}
      >
        <View style={[styles.rankBadge, { backgroundColor: isTop3 ? rankColor : appColors.muted }]}>
          {rank <= 3 ? (
            <Ionicons name="trophy" size={14} color="#FFFFFF" />
          ) : (
            <Text style={[styles.rankNumber, { color: appColors.mutedForeground }]}>
              {rank}
            </Text>
          )}
        </View>

        <View style={[styles.categoryIcon, { backgroundColor: `${catColor}22` }]}>
          <Ionicons
            name={CATEGORY_ICONS[entry.category] as any}
            size={16}
            color={catColor}
          />
        </View>

        <View style={styles.rowInfo}>
          <Text style={[styles.rowCategory, { color: appColors.foreground }]}>
            {entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}
          </Text>
          <Text style={[styles.rowDate, { color: appColors.mutedForeground }]}>
            {dateStr}
          </Text>
        </View>

        <View style={styles.rowScore}>
          <Text style={[styles.rowScoreNum, { color: catColor }]}>
            {entry.score}/{entry.total}
          </Text>
          <View
            style={[
              styles.percentBadge,
              { backgroundColor: `${catColor}22` },
            ]}
          >
            <Text style={[styles.rowPercent, { color: catColor }]}>
              {entry.percentage}%
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

export default function LeaderboardScreen() {
  const appColors = useColors();
  const insets = useSafeAreaInsets();
  const { leaderboard } = useQuiz();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const titleFade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(titleFade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <View
      style={[styles.container, { backgroundColor: appColors.background, paddingTop: topPad }]}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={appColors.foreground} />
        </Pressable>
        <Animated.View style={{ opacity: titleFade, flex: 1, alignItems: "center" }}>
          <Text style={[styles.title, { color: appColors.foreground }]}>Leaderboard</Text>
        </Animated.View>
        <View style={styles.backBtn} />
      </View>

      {leaderboard.length === 0 ? (
        <View style={styles.empty}>
          <View style={[styles.emptyIconBg, { backgroundColor: appColors.card }]}>
            <Ionicons name="trophy-outline" size={40} color={appColors.mutedForeground} />
          </View>
          <Text style={[styles.emptyTitle, { color: appColors.foreground }]}>
            No scores yet
          </Text>
          <Text style={[styles.emptyBody, { color: appColors.mutedForeground }]}>
            Complete a quiz to appear on the leaderboard
          </Text>
          <Pressable
            onPress={() => { resetNav(); }}
            style={[styles.playNowBtn, { backgroundColor: appColors.primary }]}
          >
            <Ionicons name="play" size={16} color="#FFFFFF" />
            <Text style={styles.playNowText}>Play Now</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 20 }]}
        >
          <View style={styles.topSection}>
            <Ionicons name="trophy" size={32} color="#F59E0B" />
            <Text style={[styles.topLabel, { color: appColors.mutedForeground }]}>
              TOP {leaderboard.length} SCORES
            </Text>
          </View>
          {leaderboard.map((entry, i) => (
            <LeaderboardRow
              key={entry.id}
              entry={entry}
              rank={i + 1}
              delay={i * 60}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function resetNav() {
  router.replace("/");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  topSection: {
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  topLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.5,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  rowContainer: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rankNumber: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowInfo: {
    flex: 1,
    gap: 2,
  },
  rowCategory: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  rowDate: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  rowScore: {
    alignItems: "flex-end",
    gap: 4,
  },
  rowScoreNum: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
  },
  percentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  rowPercent: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  emptyBody: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  playNowBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 8,
  },
  playNowText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
});
