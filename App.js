import React from 'react';  // Import React
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';  // Import NavigationContainer
import { createStackNavigator } from '@react-navigation/stack';  // Import Stack Navigator
import HomeScreen from './src/screens/HomeScreen';  // Import the HomeScreen component
import Player from './src/components/Player';      // Import the Player component

const Stack = createStackNavigator();  // Create a stack navigator

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Home' }} 
        />
        <Stack.Screen 
          name="Player" 
          component={Player} 
          options={{ title: 'Music Player' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
