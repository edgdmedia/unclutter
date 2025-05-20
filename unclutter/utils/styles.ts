import { StyleSheet, useColorScheme } from 'react-native';

// Mental Wellness App color palette
export const unclutterColors = {
  // Primary Lotus Yellow (brand color)
  lotus: '#ffdc5e',
  lotusDark: '#e6c654',
  lotusLight: '#fff0a8',
  
  // Module Colors
  modules: {
    // Journal Module
    journal: '#4a90e2',  // Blue
    journalDark: '#3a73b5',
    // Mood Tracker Module
    mood: '#f5a623',     // Orange
    moodDark: '#d48c1f',
    // Expense Manager Module
    expense: '#7ed321',   // Green
    expenseDark: '#65a91b',
    // Planner Module
    planner: '#bd10e0',   // Purple
    plannerDark: '#9c0db9',
    // Book Reader Module
    reader: '#e74c3c',    // Red
    readerDark: '#c0392b',
  },
  
  // UI Colors
  ui: {
    background: '#ffffff',
    backgroundDark: '#121212',
    card: '#ffffff',
    cardDark: '#1e1e1e',
    text: '#000000',
    textDark: '#ffffff',
    secondaryText: '#6b7280',
    secondaryTextDark: '#9ca3af',
    border: '#e5e7eb',
    borderDark: '#2e2e2e',
  },
  
  // Mood Colors (for mood tracking)
  moods: {
    great: '#7ed321',     // Green
    good: '#4a90e2',      // Blue
    neutral: '#f5a623',   // Orange
    bad: '#e74c3c',       // Red
    terrible: '#9b59b6',  // Purple
  },
  
  // Status Colors
  status: {
    success: '#10b981',
    successDark: '#0d9668',
    warning: '#f59e0b',
    warningDark: '#d48806',
    error: '#ef4444',
    errorDark: '#c53030',
    info: '#3b82f6',
    infoDark: '#2563eb',
  }
};

// Define spacing units
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Define font sizes
export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

// Define border radius
export const borderRadius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

// Define shadows
export const shadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Common styles for layouts
export const layouts = StyleSheet.create({
  // Flex
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  flex3: { flex: 3 },
  flexGrow1: { flexGrow: 1 },
  flexShrink1: { flexShrink: 1 },
  flexWrap: { flexWrap: 'wrap' },
  flexNoWrap: { flexWrap: 'nowrap' },
  
  // Container
  container: {
    flex: 1,
    backgroundColor: unclutterColors.ui.background,
  },
  containerWhite: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Flex Direction
  row: { flexDirection: 'row' },
  rowReverse: { flexDirection: 'row-reverse' },
  col: { flexDirection: 'column' },
  colReverse: { flexDirection: 'column-reverse' },
  
  // Justify Content
  justifyStart: { justifyContent: 'flex-start' },
  justifyEnd: { justifyContent: 'flex-end' },
  justifyCenter: { justifyContent: 'center' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyAround: { justifyContent: 'space-around' },
  justifyEvenly: { justifyContent: 'space-evenly' },
  
  // Align Items
  itemsStart: { alignItems: 'flex-start' },
  itemsEnd: { alignItems: 'flex-end' },
  itemsCenter: { alignItems: 'center' },
  itemsStretch: { alignItems: 'stretch' },
  itemsBaseline: { alignItems: 'baseline' },
  
  // Align Self
  selfStart: { alignSelf: 'flex-start' },
  selfEnd: { alignSelf: 'flex-end' },
  selfCenter: { alignSelf: 'center' },
  selfStretch: { alignSelf: 'stretch' },
  
  // Align Content
  contentStart: { alignContent: 'flex-start' },
  contentEnd: { alignContent: 'flex-end' },
  contentCenter: { alignContent: 'center' },
  contentBetween: { alignContent: 'space-between' },
  contentAround: { alignContent: 'space-around' },
  contentStretch: { alignContent: 'stretch' },
  
  // Combinations
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Position
  relative: { position: 'relative' },
  absolute: { position: 'absolute' },
  absoluteFill: StyleSheet.absoluteFillObject,
  
  // Position values
  top0: { top: 0 },
  right0: { right: 0 },
  bottom0: { bottom: 0 },
  left0: { left: 0 },
  
  // Z-Index
  z0: { zIndex: 0 },
  z10: { zIndex: 10 },
  z20: { zIndex: 20 },
  z30: { zIndex: 30 },
  z40: { zIndex: 40 },
  z50: { zIndex: 50 },
  
  // Width & Height
  w100: { width: '100%' },
  h100: { height: '100%' },
  wh100: { width: '100%', height: '100%' },
  w50: { width: '50%' },
  h50: { height: '50%' },
  w25: { width: '25%' },
  h25: { height: '25%' },
  w75: { width: '75%' },
  h75: { height: '75%' },
  
  // Overflow
  overflowHidden: { overflow: 'hidden' },
  overflowVisible: { overflow: 'visible' },
  overflowScroll: { overflow: 'scroll' },
  
  // Padding
  p0: { padding: 0 },
  p1: { padding: spacing.xs },
  p2: { padding: spacing.sm },
  p3: { padding: spacing.md },
  p4: { padding: spacing.lg },
  p5: { padding: spacing.xl },
  p6: { padding: spacing.xxl },
  
  // Padding horizontal
  px0: { paddingHorizontal: 0 },
  px1: { paddingHorizontal: spacing.xs },
  px2: { paddingHorizontal: spacing.sm },
  px3: { paddingHorizontal: spacing.md },
  px4: { paddingHorizontal: spacing.lg },
  px5: { paddingHorizontal: spacing.xl },
  px6: { paddingHorizontal: spacing.xxl },
  
  // Padding vertical
  py0: { paddingVertical: 0 },
  py1: { paddingVertical: spacing.xs },
  py2: { paddingVertical: spacing.sm },
  py3: { paddingVertical: spacing.md },
  py4: { paddingVertical: spacing.lg },
  py5: { paddingVertical: spacing.xl },
  py6: { paddingVertical: spacing.xxl },
  
  // Padding top, right, bottom, left
  pt0: { paddingTop: 0 },
  pt1: { paddingTop: spacing.xs },
  pt2: { paddingTop: spacing.sm },
  pt3: { paddingTop: spacing.md },
  pt4: { paddingTop: spacing.lg },
  pt5: { paddingTop: spacing.xl },
  pt6: { paddingTop: spacing.xxl },
  
  pr0: { paddingRight: 0 },
  pr1: { paddingRight: spacing.xs },
  pr2: { paddingRight: spacing.sm },
  pr3: { paddingRight: spacing.md },
  pr4: { paddingRight: spacing.lg },
  pr5: { paddingRight: spacing.xl },
  pr6: { paddingRight: spacing.xxl },
  
  pb0: { paddingBottom: 0 },
  pb1: { paddingBottom: spacing.xs },
  pb2: { paddingBottom: spacing.sm },
  pb3: { paddingBottom: spacing.md },
  pb4: { paddingBottom: spacing.lg },
  pb5: { paddingBottom: spacing.xl },
  pb6: { paddingBottom: spacing.xxl },
  
  pl0: { paddingLeft: 0 },
  pl1: { paddingLeft: spacing.xs },
  pl2: { paddingLeft: spacing.sm },
  pl3: { paddingLeft: spacing.md },
  pl4: { paddingLeft: spacing.lg },
  pl5: { paddingLeft: spacing.xl },
  pl6: { paddingLeft: spacing.xxl },
  
  // Margin
  m0: { margin: 0 },
  m1: { margin: spacing.xs },
  m2: { margin: spacing.sm },
  m3: { margin: spacing.md },
  m4: { margin: spacing.lg },
  m5: { margin: spacing.xl },
  m6: { margin: spacing.xxl },
  
  // Margin horizontal
  mx0: { marginHorizontal: 0 },
  mx1: { marginHorizontal: spacing.xs },
  mx2: { marginHorizontal: spacing.sm },
  mx3: { marginHorizontal: spacing.md },
  mx4: { marginHorizontal: spacing.lg },
  mx5: { marginHorizontal: spacing.xl },
  mx6: { marginHorizontal: spacing.xxl },
  
  // Margin vertical
  my0: { marginVertical: 0 },
  my1: { marginVertical: spacing.xs },
  my2: { marginVertical: spacing.sm },
  my3: { marginVertical: spacing.md },
  my4: { marginVertical: spacing.lg },
  my5: { marginVertical: spacing.xl },
  my6: { marginVertical: spacing.xxl },
  
  // Margin top, right, bottom, left
  mt0: { marginTop: 0 },
  mt1: { marginTop: spacing.xs },
  mt2: { marginTop: spacing.sm },
  mt3: { marginTop: spacing.md },
  mt4: { marginTop: spacing.lg },
  mt5: { marginTop: spacing.xl },
  mt6: { marginTop: spacing.xxl },
  
  mr0: { marginRight: 0 },
  mr1: { marginRight: spacing.xs },
  mr2: { marginRight: spacing.sm },
  mr3: { marginRight: spacing.md },
  mr4: { marginRight: spacing.lg },
  mr5: { marginRight: spacing.xl },
  mr6: { marginRight: spacing.xxl },
  
  mb0: { marginBottom: 0 },
  mb1: { marginBottom: spacing.xs },
  mb2: { marginBottom: spacing.sm },
  mb3: { marginBottom: spacing.md },
  mb4: { marginBottom: spacing.lg },
  mb5: { marginBottom: spacing.xl },
  mb6: { marginBottom: spacing.xxl },
  
  ml0: { marginLeft: 0 },
  ml1: { marginLeft: spacing.xs },
  ml2: { marginLeft: spacing.sm },
  ml3: { marginLeft: spacing.md },
  ml4: { marginLeft: spacing.lg },
  ml5: { marginLeft: spacing.xl },
});

// Common styles for text
export const typography = StyleSheet.create({
  // Predefined text styles
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: unclutterColors.ui.text,
  },
  subtitle: {
    fontSize: fontSize.xl,
    fontWeight: '500',
    color: unclutterColors.ui.secondaryText,
  },
  h1: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: unclutterColors.ui.text,
  },
  h2: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: unclutterColors.ui.text,
  },
  h3: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: unclutterColors.ui.text,
  },
  body: {
    fontSize: fontSize.md,
    color: unclutterColors.ui.text,
  },
  bodySmall: {
    fontSize: fontSize.sm,
    color: unclutterColors.ui.secondaryText,
  },
  caption: {
    fontSize: fontSize.xs,
    color: unclutterColors.ui.secondaryText,
  },
  button: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#ffffff',
  },
  link: {
    fontSize: fontSize.md,
    color: unclutterColors.modules.journal,
    textDecorationLine: 'underline',
  },
  
  // Font sizes
  text2xs: { fontSize: fontSize.xxs },
  textXs: { fontSize: fontSize.xs },
  textSm: { fontSize: fontSize.sm },
  textBase: { fontSize: fontSize.md },
  textLg: { fontSize: fontSize.lg },
  textXl: { fontSize: fontSize.xl },
  text2xl: { fontSize: fontSize.xxl },
  text3xl: { fontSize: fontSize.xxxl },
  
  // Font weights
  fontThin: { fontWeight: '100' },
  fontExtralight: { fontWeight: '200' },
  fontLight: { fontWeight: '300' },
  fontNormal: { fontWeight: '400' },
  fontMedium: { fontWeight: '500' },
  fontSemibold: { fontWeight: '600' },
  fontBold: { fontWeight: '700' },
  fontExtrabold: { fontWeight: '800' },
  fontBlack: { fontWeight: '900' },
  
  // Text alignment
  textLeft: { textAlign: 'left' },
  textCenter: { textAlign: 'center' },
  textRight: { textAlign: 'right' },
  textJustify: { textAlign: 'justify' },
  
  // Text colors
  textWhite: { color: '#FFFFFF' },
  textBlack: { color: '#000000' },
  textGray: { color: unclutterColors.ui.secondaryText },
  textPrimary: { color: unclutterColors.modules.journal },
  textSecondary: { color: unclutterColors.modules.mood },
  textSuccess: { color: unclutterColors.status.success },
  textDanger: { color: unclutterColors.status.error },
  textWarning: { color: unclutterColors.status.warning },
  textInfo: { color: unclutterColors.status.info },
  
  // Text decoration
  underline: { textDecorationLine: 'underline' },
  lineThrough: { textDecorationLine: 'line-through' },
  noUnderline: { textDecorationLine: 'none' },
  
  // Text transform
  uppercase: { textTransform: 'uppercase' },
  lowercase: { textTransform: 'lowercase' },
  capitalize: { textTransform: 'capitalize' },
  normalCase: { textTransform: 'none' },
});

// Common styles for borders
export const borders = StyleSheet.create({
  // Border widths
  borderWidth0: { borderWidth: 0 },
  borderWidth1: { borderWidth: 1 },
  borderWidth2: { borderWidth: 2 },
  borderWidth3: { borderWidth: 3 },
  borderWidth4: { borderWidth: 4 },
  borderWidth5: { borderWidth: 5 },
  
  // Border styles
  borderSolid: { borderStyle: 'solid' },
  borderDashed: { borderStyle: 'dashed' },
  borderDotted: { borderStyle: 'dotted' },
  
  // Border colors
  borderColorWhite: { borderColor: '#FFFFFF' },
  borderColorBlack: { borderColor: '#000000' },
  borderColorGray: { borderColor: unclutterColors.ui.secondaryText },
  borderColorPrimary: { borderColor: unclutterColors.modules.journal },
  borderColorSecondary: { borderColor: unclutterColors.modules.mood },
  borderColorSuccess: { borderColor: unclutterColors.status.success },
  borderColorDanger: { borderColor: unclutterColors.status.error },
  borderColorWarning: { borderColor: unclutterColors.status.warning },
  borderColorInfo: { borderColor: unclutterColors.status.info },
  
  // Border radius
  borderRadius0: { borderRadius: 0 },
  borderRadiusSm: { borderRadius: borderRadius.sm },
  borderRadiusMd: { borderRadius: borderRadius.md },
  borderRadiusLg: { borderRadius: borderRadius.lg },
  borderRadiusXl: { borderRadius: borderRadius.xl },
  borderRadiusFull: { borderRadius: borderRadius.full },
});

// Common styles for backgrounds
export const backgrounds = StyleSheet.create({
  // Background colors
  backgroundColorWhite: { backgroundColor: '#FFFFFF' },
  backgroundColorBlack: { backgroundColor: '#000000' },
  backgroundColorGray: { backgroundColor: unclutterColors.ui.secondaryText },
  backgroundColorPrimary: { backgroundColor: unclutterColors.modules.journal },
  backgroundColorSecondary: { backgroundColor: unclutterColors.modules.mood },
  backgroundColorSuccess: { backgroundColor: unclutterColors.status.success },
  backgroundColorDanger: { backgroundColor: unclutterColors.status.error },
  backgroundColorWarning: { backgroundColor: unclutterColors.status.warning },
  backgroundColorInfo: { backgroundColor: unclutterColors.status.info },
  
  // Background images
  backgroundImageCover: { resizeMode: 'cover' },
  backgroundImageContain: { resizeMode: 'contain' },
  backgroundImageStretch: { resizeMode: 'stretch' },
  backgroundImageRepeat: { resizeMode: 'repeat' },
  backgroundImageCenter: { resizeMode: 'center' },
});

// Common styles for cards
export const cards = StyleSheet.create({
  basic: {
    backgroundColor: unclutterColors.ui.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.sm,
  },
  elevated: {
    backgroundColor: unclutterColors.ui.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.md,
  },
  outlined: {
    backgroundColor: unclutterColors.ui.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: unclutterColors.ui.border,
  },
  // Card sizes
  small: {
    padding: spacing.sm,
  },
  large: {
    padding: spacing.lg,
  },
  // Card shapes
  rounded: {
    borderRadius: borderRadius.lg,
  },
  roundedLg: {
    borderRadius: borderRadius.xl,
  },
  circle: {
    borderRadius: borderRadius.full,
  },
});

// Common styles for buttons
export const buttons = StyleSheet.create({
  primary: {
    backgroundColor: unclutterColors.modules.journal,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: unclutterColors.modules.mood,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlined: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: unclutterColors.modules.journal,
  },
  text: {
    backgroundColor: 'transparent',
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Helper function to create dynamic styles
export function createStyles(styleObj) {
  return StyleSheet.create(styleObj);
}
