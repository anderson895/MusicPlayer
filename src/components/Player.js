import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ImageBackground } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

const Player = ({ navigation }) => {
  const songs = [
    { title: 'Karera.', uri: require('../../assets/songs/Karera.mp3') },
    { title: 'Cherry On Top', uri: require('../../assets/songs/CherryOnTop.mp3') },
    { title: 'Pantropiko', uri: require('../../assets/songs/Pantropiko.mp3') },
    { title: 'Da Coconut Nut', uri: require('../../assets/songs/DaCoconutNut.mp3') },
  ];

  const soundRef = useRef();  // Using ref to store the sound object
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const loadSound = async (index) => {
    setIsLoading(true);
    try {
      console.log('Loading song:', songs[index].uri);
      const { sound, status } = await Audio.Sound.createAsync(songs[index].uri);
      soundRef.current = sound; // Storing sound in ref
      setDuration(status.durationMillis);
      setPosition(0);
      setIsLoading(false);
      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

      if (isPlaying) {
        await sound.playAsync();
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error loading song:', error);
      Alert.alert('Error', 'Failed to load song');
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
    }
  };

  useEffect(() => {
    loadSound(currentSongIndex);

    // Cleanup the sound when leaving the screen
    const unsubscribe = navigation.addListener('blur', async () => {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync(); // Unload the audio
      }
    });

    return () => {
      unsubscribe();
      if (soundRef.current) {
        soundRef.current.unloadAsync(); // Cleanup if the component unmounts
      }
    };
  }, [currentSongIndex, navigation]);

  const togglePlayback = async () => {
    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const nextSong = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
    }
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    setIsPlaying(false);  // Stop playback until the next song loads
    setTimeout(() => {
      loadSound(nextIndex); // Load the next song correctly
      setIsPlaying(true);
    }, 500);
  };

  const prevSong = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
    }
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIndex);
    setIsPlaying(false);
    setTimeout(() => {
      loadSound(prevIndex); // Load the previous song correctly
      setIsPlaying(true);
    }, 500);
  };

  const seekToPosition = async (value) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(value);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/biniBanner.jpg')}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{songs[currentSongIndex].title}</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#197f14" />
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
        <Slider
          style={styles.slider}
          value={position}
          minimumValue={0}
          maximumValue={duration}
          onValueChange={seekToPosition}
          minimumTrackTintColor="#197f14"
          maximumTrackTintColor="#000000"
          thumbTintColor="#197f14"
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
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    color: '#333',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
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
  slider: {
    width: '100%',
  },
});

export default Player;
