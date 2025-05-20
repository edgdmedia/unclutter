import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { layouts, typography, cards, buttons, colors, spacing } from '../utils/styles';

export default function AboutScreen() {
  const router = useRouter();
  
  return (
    <View style={[layouts.container, layouts.centered]}>
      <View style={[cards.elevated, { width: '80%' }]}>
        <Text style={typography.title}>About</Text>
        <Text style={[typography.body, { marginVertical: spacing.md }]}>
          This is the about page. It demonstrates how Expo Router works with our custom styling system.
        </Text>
        
        <TouchableOpacity 
          style={[buttons.outlined, { marginTop: spacing.md }]}
          onPress={() => router.back()}
        >
          <Text style={[typography.body, { color: colors.primary }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
