// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import CounterScreen from './screens/CounterScreen';

export type RootStackParamList = {
  Home: undefined;
  Counter: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
              headerShown: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        //   options={{ title: 'DFM (Kick counter)' }}
        />
        <Stack.Screen
          name="Counter"
          component={CounterScreen}
        //   options={{ title: 'Track Movement' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
