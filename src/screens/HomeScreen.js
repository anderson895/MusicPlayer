import React from 'react';
import { StyleSheet, Text, Button, ImageBackground, View } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground 
      source={require('../../assets/biniBanner.jpg')}  // Correct relative path for local image
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to Marlyn Music Player</Text>
        <Button 
          title="Go to Music Player"
          onPress={() => navigation.navigate('Player')}  // Navigate to the Player screen
          color="#4CAF50"  // Custom button color
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',  // Ensures the image covers the screen without distortion
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',  // Slightly more opaque for better contrast
    borderRadius: 15,  // Rounded corners for a softer look
    padding: 30,
    width: '85%',  // Adjust card width for better proportion
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 6,  // For Android shadow effect
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',  // Slightly darker color for better contrast
    marginBottom: 20,
    textAlign: 'center',  // Ensures the text is aligned properly in the center
  },
});

export default HomeScreen;
