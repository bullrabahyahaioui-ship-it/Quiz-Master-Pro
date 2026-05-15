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

import { ADS } from "@/constants/ads";
import colors from "@/constants/colors";
import { useQuiz } from "@/contexts/QuizContext";
import type { Category } from "@/data/questions";
import { useColors } from "@/hooks/useColors";
import {
  BannerAd,
  BannerAdSize,
  isAdMobAvailable,
} from "@/utils/adProvider";

const CATEGORIES: Array<{ id: Category; name: string; questionCount: number }> = [
  { id: "geography", name: "Geography", questionCount: 10 },
  { id: "sports", name: "Sports", questionCount: 10 },
  { id: "science", name: "Science", questionCount: 10 },
  { id: "history", name: "History", questionCount: 10 },
];

function CategoryCard({
  category,
  name,
  questionCount,
  delay,
  onPress,
}: {
  category: Category;
  name: string;
  questionCount: number;
  delay: number;
  onPress: () => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const info = colors.category[category];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const iconName =
    category === "geography"
      ? "earth"
      : category === "sports"
        ? "football"
        : category === "science"
          ? "flask"
          : "time";

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, { backgroundColor: info.color }]}
        testID={`category-${category}`}
      >
        <View style={[styles.cardGlow, { backgroundColor: info.dark }]} />
        <View style={styles.cardContent}>
          <View style={styles.iconCircle}>
            <Ionicons name={iconName as any} size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.cardName}>{name}</Text>
          <Text style={styles.cardCount}>{questionCount} Questions</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function AdBannerSection() {
  const appColors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  if (isAdMobAvailable && BannerAd && BannerAdSize) {
    return (
      <View style={[styles.realAdContainer, { paddingBottom: bottomPad + 8 }]}>
        <Text style={[styles.adLabel, { color: appColors.mutedForeground }]}>
          ADVERTISEMENT
        </Text>
        <View style={styles.realAdWrapper}>
          <BannerAd
            unitId={ADS.BANNER_ID}
            size={BannerAdSize.BANNER}
            requestOptions={{ requestNonPersonalizedAdsOnly: true }}
            onAdFailedToLoad={() => {/* fail silently */}}
          />
        </View>
      </View>
    );
  }

  // Fallback for Expo Go / web
  return (
    <View
      style={[
        styles.adBanner,
        {
          backgroundColor: appColors.card,
          borderColor: appColors.border,
          marginBottom: bottomPad + 8,
        },
      ]}
    >
      <Text style={[styles.adLabel, { color: appColors.mutedForeground }]}>
        ADVERTISEMENT
      </Text>
      <View style={[styles.adContent, { backgroundColor: appColors.muted }]}>
        <Ionicons name="megaphone" size={16} color={appColors.mutedForeground} />
        <Text style={[styles.adText, { color: appColors.mutedForeground }]}>
          Your ad could be here • quizmaster.app
        </Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const appColors = useColors();
  const insets = useSafeAreaInsets();
  const { startQuiz } = useQuiz();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleCategory = (category: Category) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    startQuiz(category);
    router.push("/quiz");
  };

  const handleLeaderboard = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/leaderboard");
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: appColors.background, paddingTop: topPad },
      ]}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={[styles.logoBadge, { backgroundColor: appColors.primary }]}>
            <Ionicons name="help-circle" size={28} color="#FFFFFF" />
          </View>
          <View>
            <Text style={[styles.appTitle, { color: appColors.foreground }]}>
              QuizMaster
            </Text>
            <Text style={[styles.appSubtitle, { color: appColors.mutedForeground }]}>
              Test your knowledge
            </Text>
          </View>
        </View>
        <Pressable
          onPress={handleLeaderboard}
          style={[styles.leaderboardBtn, { backgroundColor: appColors.card }]}
          testID="leaderboard-button"
        >
          <Ionicons name="trophy" size={20} color="#F59E0B" />
        </Pressable>
      </View>

      <Text style={[styles.sectionLabel, { color: appColors.mutedForeground }]}>
        PICK A CATEGORY
      </Text>

      <View style={styles.grid}>
        {CATEGORIES.map((cat, i) => (
          <CategoryCard
            key={cat.id}
            category={cat.id}
            name={cat.name}
            questionCount={cat.questionCount}
            delay={i * 100}
            onPress={() => handleCategory(cat.id)}
          />
        ))}
      </View>

      <View style={styles.infoRow}>
        <View style={[styles.infoBadge, { backgroundColor: appColors.card }]}>
          <Ionicons name="shield-checkmark" size={14} color={appColors.primary} />
          <Text style={[styles.infoText, { color: appColors.mutedForeground }]}>
            3 lifelines per game
          </Text>
        </View>
        <View style={[styles.infoBadge, { backgroundColor: appColors.card }]}>
          <Ionicons name="timer" size={14} color={appColors.primary} />
          <Text style={[styles.infoText, { color: appColors.mutedForeground }]}>
            10 seconds per question
          </Text>
        </View>
      </View>

      <AdBannerSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 28,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  appTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  leaderboardBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 20,
  },
  cardWrapper: {
    width: "47%",
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    height: 150,
  },
  cardGlow: {
    position: "absolute",
    bottom: -20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.4,
  },
  cardContent: {
    flex: 1,
    padding: 18,
    justifyContent: "space-between",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardName: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    marginTop: 8,
  },
  cardCount: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
  },
  infoRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  infoBadge: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  realAdContainer: {
    alignItems: "center",
    marginTop: "auto",
  },
  realAdWrapper: {
    alignItems: "center",
  },
  adBanner: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    marginTop: "auto",
  },
  adLabel: {
    fontSize: 9,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
    textAlign: "center",
    paddingVertical: 4,
  },
  adContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  adText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
