import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

const Player = () => {
  const songs = [
    { title: 'Karera.', uri: require('../../assets/songs/Karera.mp3') },
    { title: 'Cherry On Top', uri: require('../../assets/songs/CherryOnTop.mp3') },
    { title: 'Pantropiko', uri: require('../../assets/songs/Pantropiko.mp3') },
    { title: 'Da Coconut Nut', uri: require('../../assets/songs/DaCoconutNut.mp3') },
  ];

  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);  // Current position in the song
  const [duration, setDuration] = useState(0);  // Total song duration

  const loadSound = async (index) => {
    setIsLoading(true);
    try {
      console.log('Loading song:', songs[index].uri);
      const { sound, status } = await Audio.Sound.createAsync(songs[index].uri);
      setSound(sound);
      setDuration(status.durationMillis);
      setPosition(0);  // Reset position on new song load
      setIsLoading(false);
      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

      // Auto-play when the next song is loaded
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
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [currentSongIndex]);

  const togglePlayback = async () => {
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const nextSong = async () => {
    if (sound) {
      await sound.stopAsync();
    }
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    setIsPlaying(false);  // Stop playback until the next song loads
    setTimeout(() => {
      loadSound(nextIndex); // Load the next song correctly
      setIsPlaying(true);  // Set playback to true once the song is loaded
    }, 500);
  };

  const prevSong = async () => {
    if (sound) {
      await sound.stopAsync();
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
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  return (
    <View style={styles.container}>
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
  slider: {
    width: '80%',
    marginTop: 20,
  },
});

export default Player;
