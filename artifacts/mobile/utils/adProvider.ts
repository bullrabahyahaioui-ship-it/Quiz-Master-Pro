import { Platform } from "react-native";

/**
 * Safe AdMob module loader.
 * react-native-google-mobile-ads requires native linking — it is not
 * available in Expo Go. This wrapper tries to load the module and
 * gracefully falls back so the app continues to run in Expo Go with
 * the built-in ad simulations. Real ads activate automatically in
 * production (Expo Launch) builds where the native module is linked.
 */

let admobModule: any = null;
export let isAdMobAvailable = false;

if (Platform.OS !== "web") {
  try {
    admobModule = require("react-native-google-mobile-ads");
    // Verify the key exports exist before marking as available
    if (admobModule?.InterstitialAd && admobModule?.RewardedAd) {
      isAdMobAvailable = true;
    }
  } catch {
    isAdMobAvailable = false;
  }
}

export const BannerAd: any = admobModule?.BannerAd ?? null;
export const InterstitialAd: any = admobModule?.InterstitialAd ?? null;
export const RewardedAd: any = admobModule?.RewardedAd ?? null;
export const AdEventType: Record<string, string> =
  admobModule?.AdEventType ?? {};
export const RewardedAdEventType: Record<string, string> =
  admobModule?.RewardedAdEventType ?? {};
export const BannerAdSize: Record<string, any> =
  admobModule?.BannerAdSize ?? {};

/** Call once at app startup to initialise the AdMob SDK. No-op if unavailable. */
export function initializeAdMob(): void {
  if (!isAdMobAvailable || !admobModule?.default) return;
  try {
    admobModule.default
      .initialize()
      .catch(() => {/* ignore init errors */});
  } catch {/* ignore */}
}
