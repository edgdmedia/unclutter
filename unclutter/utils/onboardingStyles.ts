import { StyleSheet, Dimensions } from 'react-native';
import { spacing, borderRadius } from './styles';
import { unclutterColors } from './styles';

const { width, height } = Dimensions.get('window');

// Reusable styles for onboarding screens
export const onboardingStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  
  // Image container
  imageContainer: {
    marginBottom: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Module icon styles
  moduleIcon: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
  },
  
  // Text styles
  title: {
    textAlign: 'center',
    marginBottom: spacing.md,
    color: '#000000',
  },
  description: {
    textAlign: 'center',
    color: '#4b4b4b',
    marginBottom: spacing.xl,
  },
  
  // Footer styles
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'transparent',
  },
  
  // Dots container
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  
  // Button container
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    padding: spacing.md,
  },
  skipText: {
    color: '#4b4b4b',
    fontSize: 16,
  },
  
  // Module background colors
  welcomeBackground: {
    backgroundColor: '#ffffff',
  },
  journalBackground: {
    backgroundColor: '#f0f7ff',
  },
  moodBackground: {
    backgroundColor: '#fff8f0',
  },
  expenseBackground: {
    backgroundColor: '#f0fff0',
  },
  plannerBackground: {
    backgroundColor: '#f9f0ff',
  },
  readerBackground: {
    backgroundColor: '#fff0f0',
  },
});

// Slide data for onboarding
export const onboardingSlides = [
  {
    id: 'welcome',
    title: 'Welcome to Unclutter',
    description: 'Your modular mental wellness companion designed to support your personal growth journey.',
    color: unclutterColors.lotus,
    backgroundColor: '#ffffff',
  },
  {
    id: 'journal',
    title: 'Journal Module',
    description: 'Write and organize personal entries with tags and prompts. Reflect on your thoughts and feelings.',
    color: unclutterColors.modules.journal,
    backgroundColor: '#f0f7ff',
  },
  {
    id: 'mood',
    title: 'Mood Tracker',
    description: 'Log your daily mood and visualize emotional patterns over time to gain insights.',
    color: unclutterColors.modules.mood,
    backgroundColor: '#fff8f0',
  },
  {
    id: 'expense',
    title: 'Expense Manager',
    description: 'Track expenses and set budget goals for better financial wellness and peace of mind.',
    color: unclutterColors.modules.expense,
    backgroundColor: '#f0fff0',
  },
  {
    id: 'planner',
    title: 'Planner & Vision Board',
    description: 'Organize tasks and create vision boards to visualize and achieve your goals.',
    color: unclutterColors.modules.planner,
    backgroundColor: '#f9f0ff',
  },
  {
    id: 'reader',
    title: 'Book Reader',
    description: 'Track reading progress and take notes on your books for continuous learning.',
    color: unclutterColors.modules.reader,
    backgroundColor: '#fff0f0',
  },
];
