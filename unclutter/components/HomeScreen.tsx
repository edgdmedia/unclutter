import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { cssInterop } from 'nativewind';

// Style existing components
const StyledView = cssInterop(View);
const StyledText = cssInterop(Text);
const StyledTouchableOpacity = cssInterop(TouchableOpacity);

export default function HomeScreen() {
  return (
    <StyledView className="flex-1 items-center justify-center bg-gray-100">
      <StyledView className="bg-white p-6 rounded-xl shadow-md w-5/6">
        <StyledText className="text-2xl font-bold text-center text-blue-600 mb-4">
          Welcome to My App!
        </StyledText>
        
        <StyledText className="text-gray-700 mb-6">
          This is a simple example of using NativeWind with Expo and React Native.
        </StyledText>
        
        <StyledTouchableOpacity 
          className="bg-blue-500 py-3 px-4 rounded-lg items-center"
          onPress={() => alert('Button pressed!')}
        >
          <StyledText className="text-white font-semibold">
            Click Me
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
}