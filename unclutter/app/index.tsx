import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { layouts, typography, cards, buttons, spacing } from '../utils/styles';
import { useTheme } from '../utils/useTheme';
import LotusLogo from '../components/UnclutterLotus';

// Feature Card Component
interface FeatureCardProps {
  title: string;
  description: string;
  color: string;
  onPress: () => void;
}

// Mood Button Component
interface MoodButtonProps {
  emoji: string;
  color: string;
  label: string;
  onPress: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, color, onPress }) => {
  const theme = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]} 
      onPress={onPress}
    >
      <View style={[styles.featureIconContainer, { backgroundColor: color + '20' }]}>
        <View style={[styles.featureIcon, { backgroundColor: color }]} />
      </View>
      <Text style={[typography.h3, { color: theme.text }]}>{title}</Text>
      <Text style={[typography.bodySmall, { color: theme.secondaryText }]}>{description}</Text>
    </TouchableOpacity>
  );
};

const MoodButton: React.FC<MoodButtonProps> = ({ emoji, color, label, onPress }) => {
  const theme = useTheme();
  
  return (
    <TouchableOpacity 
      style={styles.moodButton} 
      onPress={onPress}
    >
      <View style={[styles.moodEmoji, { backgroundColor: color + '20' }]}>
        <Text style={styles.emojiText}>{emoji}</Text>
      </View>
      <Text style={[typography.caption, { color: theme.text, marginTop: spacing.xs }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xl * 2,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  card: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  featureCard: {
    width: '48%',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
  },
  moodSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  moodButton: {
    alignItems: 'center',
    padding: spacing.xs,
  },
  moodEmoji: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 24,
  }
});

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  
  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <LotusLogo size={80} color={theme.lotus} />
        <Text style={[typography.title, { color: theme.text, marginTop: spacing.md }]}>
          Unclutter
        </Text>
        <Text style={[typography.subtitle, { color: theme.secondaryText }]}>
          Your modular mental wellness companion
        </Text>
      </View>
      
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[typography.h2, { color: theme.text }]}>
          Welcome to Unclutter
        </Text>
        <Text style={[typography.body, { color: theme.text, marginVertical: spacing.md }]}>
          Unclutter is a modular mental wellness app designed to support your personal growth
          through journaling, mood tracking, financial wellness, planning, and more.
        </Text>
        
        <TouchableOpacity 
          style={[buttons.primary, { backgroundColor: theme.journalModule, marginTop: spacing.md }]}
          onPress={() => router.push('/about')}
        >
          <Text style={[typography.button, { color: '#ffffff' }]}>Learn More</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.featuresContainer}>
        <FeatureCard 
          title="Journal" 
          description="Write and organize personal entries with tags and prompts"
          color={theme.journalModule}
          onPress={() => {}}
        />
        <FeatureCard 
          title="Mood Tracker" 
          description="Log your daily mood and visualize emotional patterns"
          color={theme.moodModule}
          onPress={() => {}}
        />
        <FeatureCard 
          title="Expense Manager" 
          description="Track expenses and set budget goals for financial wellness"
          color={theme.expenseModule}
          onPress={() => {}}
        />
        <FeatureCard 
          title="Planner" 
          description="Organize tasks and create vision boards for your goals"
          color={theme.plannerModule}
          onPress={() => {}}
        />
        <FeatureCard 
          title="Book Reader" 
          description="Track reading progress and take notes on your books"
          color={theme.readerModule}
          onPress={() => {}}
        />
      </View>
      
      <View style={[styles.moodSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[typography.h3, { color: theme.text, marginBottom: spacing.md }]}>
          How are you feeling today?
        </Text>
        <View style={styles.moodRow}>
          <MoodButton emoji="😄" color={theme.moodGreat} label="Great" onPress={() => {}} />
          <MoodButton emoji="🙂" color={theme.moodGood} label="Good" onPress={() => {}} />
          <MoodButton emoji="😐" color={theme.moodNeutral} label="Okay" onPress={() => {}} />
          <MoodButton emoji="😕" color={theme.moodBad} label="Bad" onPress={() => {}} />
          <MoodButton emoji="😢" color={theme.moodTerrible} label="Terrible" onPress={() => {}} />
        </View>
      </View>
    </ScrollView>
  );
}
