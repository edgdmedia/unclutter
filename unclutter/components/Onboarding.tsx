import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { typography, spacing, buttons } from '../utils/styles';
import LotusLogo from './UnclutterLotus';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: React.ReactNode;
  color: string;
}

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  
  const slides: OnboardingSlide[] = [
    {
      id: 'welcome',
      title: 'Welcome to Unclutter',
      description: 'Your modular mental wellness companion designed to support your personal growth journey.',
      image: <LotusLogo size={width * 0.4} color="#ffdc5e" />,
      color: '#ffffff'
    },
    {
      id: 'journal',
      title: 'Journal Module',
      description: 'Write and organize personal entries with tags and prompts. Reflect on your thoughts and feelings.',
      image: <View style={[styles.moduleIcon, { backgroundColor: '#4a90e2' }]} />,
      color: '#f0f7ff'
    },
    {
      id: 'mood',
      title: 'Mood Tracker',
      description: 'Log your daily mood and visualize emotional patterns over time to gain insights.',
      image: <View style={[styles.moduleIcon, { backgroundColor: '#f5a623' }]} />,
      color: '#fff8f0'
    },
    {
      id: 'expense',
      title: 'Expense Manager',
      description: 'Track expenses and set budget goals for better financial wellness and peace of mind.',
      image: <View style={[styles.moduleIcon, { backgroundColor: '#7ed321' }]} />,
      color: '#f0fff0'
    },
    {
      id: 'planner',
      title: 'Planner & Vision Board',
      description: 'Organize tasks and create vision boards to visualize and achieve your goals.',
      image: <View style={[styles.moduleIcon, { backgroundColor: '#bd10e0' }]} />,
      color: '#f9f0ff'
    },
    {
      id: 'reader',
      title: 'Book Reader',
      description: 'Track reading progress and take notes on your books for continuous learning.',
      image: <View style={[styles.moduleIcon, { backgroundColor: '#e74c3c' }]} />,
      color: '#fff0f0'
    },
  ];
  
  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeOnboarding();
    }
  };
  
  const handleSkip = () => {
    completeOnboarding();
  };
  
  const completeOnboarding = async () => {
    try {
      // Mark onboarding as completed
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      onComplete();
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      // Continue anyway
      onComplete();
    }
  };
  
  const renderDot = (index: number) => {
    return (
      <View
        key={index}
        style={[
          styles.dot,
          { backgroundColor: index === currentIndex ? '#ffdc5e' : '#e0e0e0' }
        ]}
      />
    );
  };
  
  const renderItem = ({ item }: { item: OnboardingSlide }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.color }]}>
        <View style={styles.imageContainer}>
          {item.image}
        </View>
        <Text style={[typography.title, styles.title]}>{item.title}</Text>
        <Text style={[typography.body, styles.description]}>{item.description}</Text>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
      />
      
      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => renderDot(index))}
        </View>
        
        <View style={styles.buttonsContainer}>
          {currentIndex < slides.length - 1 ? (
            <>
              <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[buttons.primary, { backgroundColor: '#ffdc5e' }]} 
                onPress={handleNext}
              >
                <Text style={[typography.button, { color: '#000000' }]}>Next</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={[buttons.primary, { backgroundColor: '#ffdc5e', paddingHorizontal: spacing.xl }]} 
              onPress={handleNext}
            >
              <Text style={[typography.button, { color: '#000000' }]}>Get Started</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  imageContainer: {
    marginBottom: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleIcon: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
  },
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
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'transparent',
  },
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
});

export default Onboarding;
