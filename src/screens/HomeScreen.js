import React, { useEffect } from 'react';
import { StyleSheet, Text, Button, ImageBackground, View, Alert, BackHandler } from 'react-native';

const HomeScreen = ({ navigation }) => {
  
  // Handle exit functionality
  const handleExit = () => {
    Alert.alert(
      "Exit App",
      "Are you sure you want to exit?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes", onPress: () => {
            // If on Android, exit the app
            BackHandler.exitApp();
          }
        }
      ]
    );
  };

  useEffect(() => {
    const backAction = () => {
      handleExit();  // Trigger exit on back press
      return true;    // Prevent the default back button behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress", backAction
    );

    // Clean up the event listener on unmount
    return () => backHandler.remove();

  }, []);

  return (
    <ImageBackground 
      source={require('../../assets/biniBanner.jpg')}  // Correct relative path for local image
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to Marlyn Music Player</Text>
        
        {/* "Go to Music Player" Button */}
        <View style={styles.buttonContainer}>
          <Button 
            title="Go to Music Player"
            onPress={() => navigation.navigate('Player')}  // Navigate to the Player screen
            color="#4CAF50"  // Custom button color
          />
        </View>

        {/* "Exit App" Button */}
        <View style={styles.buttonContainer}>
          <Button 
            title="Exit App"
            onPress={handleExit}  // Trigger exit when pressed
            color="#F44336"  // Exit button color
          />
        </View>
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
    padding: 40,
    width: '85%',  // Adjust card width for better proportion
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,  // For Android shadow effect
  },
  title: {
    fontSize: 28,  // Increased font size for better readability
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,  // Increased margin for better spacing
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,  // Added margin between buttons for spacing
  },
});

export default HomeScreen;
