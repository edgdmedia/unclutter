import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, useColorScheme } from 'react-native';
import { useState, useEffect } from 'react';
import { layouts } from '../utils/styles';
import SplashScreen from '../components/SplashScreen';
import Onboarding from '../components/Onboarding';
import { useTheme } from '../utils/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const [appState, setAppState] = useState<'loading' | 'onboarding' | 'ready'>('loading');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const colorScheme = useColorScheme();
  const theme = useTheme();
  
  // Check if user has completed onboarding and load resources
  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Check if user has completed onboarding
        const onboardingCompleted = await AsyncStorage.getItem('hasCompletedOnboarding');
        setHasCompletedOnboarding(onboardingCompleted === 'true');
        
        // Simulate loading resources
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        // Move to onboarding or main app
        setAppState(onboardingCompleted === 'true' ? 'ready' : 'onboarding');
      } catch (error) {
        console.error('Error preparing app:', error);
        // Default to onboarding if there's an error
        setAppState('onboarding');
      }
    };
    
    prepareApp();
  }, []);
  
  // Handle splash screen completion
  const handleSplashComplete = () => {
    setAppState(hasCompletedOnboarding ? 'ready' : 'onboarding');
  };
  
  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    setAppState('ready');
  };
  
  // Show splash screen during loading
  if (appState === 'loading') {
    return <SplashScreen onFinish={handleSplashComplete} />;
  }
  
  // Show onboarding for first-time users
  if (appState === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }
  
  return (
    <View style={[layouts.container, { backgroundColor: theme.background }]}>
      <Stack 
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }} 
      />
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}
