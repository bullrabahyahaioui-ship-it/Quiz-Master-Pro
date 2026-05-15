const darkTheme = {
  text: "#FFFFFF",
  tint: "#818CF8",
  background: "#0A0E27",
  foreground: "#FFFFFF",
  card: "#141836",
  cardForeground: "#FFFFFF",
  primary: "#818CF8",
  primaryForeground: "#FFFFFF",
  secondary: "#1A2045",
  secondaryForeground: "#FFFFFF",
  muted: "#1A2045",
  mutedForeground: "#8892B0",
  accent: "#818CF8",
  accentForeground: "#FFFFFF",
  destructive: "#EF4444",
  destructiveForeground: "#FFFFFF",
  border: "#2A3060",
  input: "#2A3060",
};

const colors = {
  light: darkTheme,
  dark: darkTheme,
  radius: 16,
  category: {
    geography: {
      color: "#22C55E",
      dark: "#16A34A",
      icon: "earth" as const,
    },
    sports: {
      color: "#F97316",
      dark: "#EA6B10",
      icon: "football" as const,
    },
    science: {
      color: "#3B82F6",
      dark: "#2563EB",
      icon: "flask" as const,
    },
    history: {
      color: "#A855F7",
      dark: "#9333EA",
      icon: "time" as const,
    },
  },
};

export default colors;
