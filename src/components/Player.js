import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';

const Player = () => {
  const songs = [
    { title: 'Song 1', uri: require('../../assets/songs/song1.mp3') },
    { title: 'Song 2', uri: require('../../assets/songs/song2.mp3') },
    { title: 'Song 3', uri: require('../../assets/songs/song3.mp3') },
  ];

  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Load the sound when the component is mounted
  const loadSound = async (index) => {
    setIsLoading(true);  // Start loading state
    try {
      console.log('Loading song:', songs[index].uri);  // Log the song URI
      const { sound } = await Audio.Sound.createAsync(songs[index].uri);
      setSound(sound);
      setIsLoading(false); // Stop loading state after sound is loaded
    } catch (error) {
      setIsLoading(false);  // Stop loading state if error occurs
      console.error('Error loading song:', error);  // Log the error
      Alert.alert('Error', 'Failed to load song');
    }
  };

  useEffect(() => {
    loadSound(currentSongIndex);

    // Unload the sound when switching songs or when the component unmounts
    return () => {
      if (sound) {
        sound.unloadAsync();  // Unload the sound to free memory
      }
    };
  }, [currentSongIndex]);

  // Play or pause the sound
  const togglePlayback = async () => {
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  // Skip to the next song
  const nextSong = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    setIsPlaying(false);  // Stop the current song before loading the next one
  };

  // Skip to the previous song
  const prevSong = () => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIndex);
    setIsPlaying(false);  // Stop the current song before loading the previous one
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{songs[currentSongIndex].title}</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#197f14" />  // Loading spinner
      ) : (
        <View style={styles.controls}>
          <TouchableOpacity onPress={prevSong} style={styles.button} disabled={isLoading}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePlayback} style={styles.button} disabled={isLoading}>
            <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={nextSong} style={styles.button} disabled={isLoading}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '80%',
  },
  button: {
    backgroundColor: '#197f14',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Player;
