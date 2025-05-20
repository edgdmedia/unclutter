import { useColorScheme } from 'react-native';
import { unclutterColors } from './styles';

// Define theme types
export type ThemeColors = {
  // Primary colors
  lotus: string;
  
  // Background colors
  background: string;
  card: string;
  
  // Text colors
  text: string;
  secondaryText: string;
  
  // Border colors
  border: string;
  
  // Module colors
  journalModule: string;
  moodModule: string;
  expenseModule: string;
  plannerModule: string;
  readerModule: string;
  
  // Mood colors
  moodGreat: string;
  moodGood: string;
  moodNeutral: string;
  moodBad: string;
  moodTerrible: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
};

// Hook to get the current theme colors
export function useTheme(): ThemeColors {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return {
    // Primary colors
    lotus: isDark ? unclutterColors.lotusDark : unclutterColors.lotus,
    
    // Background colors
    background: isDark ? unclutterColors.ui.backgroundDark : unclutterColors.ui.background,
    card: isDark ? unclutterColors.ui.cardDark : unclutterColors.ui.card,
    
    // Text colors
    text: isDark ? unclutterColors.ui.textDark : unclutterColors.ui.text,
    secondaryText: isDark ? unclutterColors.ui.secondaryTextDark : unclutterColors.ui.secondaryText,
    
    // Border colors
    border: isDark ? unclutterColors.ui.borderDark : unclutterColors.ui.border,
    
    // Module colors
    journalModule: isDark ? unclutterColors.modules.journalDark : unclutterColors.modules.journal,
    moodModule: isDark ? unclutterColors.modules.moodDark : unclutterColors.modules.mood,
    expenseModule: isDark ? unclutterColors.modules.expenseDark : unclutterColors.modules.expense,
    plannerModule: isDark ? unclutterColors.modules.plannerDark : unclutterColors.modules.planner,
    readerModule: isDark ? unclutterColors.modules.readerDark : unclutterColors.modules.reader,
    
    // Mood colors
    moodGreat: unclutterColors.moods.great,
    moodGood: unclutterColors.moods.good,
    moodNeutral: unclutterColors.moods.neutral,
    moodBad: unclutterColors.moods.bad,
    moodTerrible: unclutterColors.moods.terrible,
    
    // Status colors
    success: isDark ? unclutterColors.status.successDark : unclutterColors.status.success,
    warning: isDark ? unclutterColors.status.warningDark : unclutterColors.status.warning,
    error: isDark ? unclutterColors.status.errorDark : unclutterColors.status.error,
    info: isDark ? unclutterColors.status.infoDark : unclutterColors.status.info,
  };
}

// Function to get tailwind-like class names with theme support
export function tw(colorScheme: 'light' | 'dark' | null | undefined, classNames: string): any {
  // This is a placeholder for future implementation
  // We'll use this to convert tailwind-like class names to StyleSheet objects
  return {};
}
