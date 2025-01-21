/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    background: "#ffffff", // White background for light mode
    text: "#000000", // Black text for light mode
    border: "#ddd", // Border color for light mode
    primary: "#4CAF50", // Primary color for buttons and accents
    cardBackground: "#f9f9f9", // Background color for cards
  },
  dark: {
    background: "#121212", // Dark background for dark mode
    text: "#ffffff", // White text for dark mode
    border: "#333", // Darker border for dark mode
    primary: "#4CAF50", // Same primary color (or you can change it)
    cardBackground: "#1e1e1e", // Darker background color for cards
  },
  primary: "#4CAF50", // Primary color (used across both light/dark modes)
};
