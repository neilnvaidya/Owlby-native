import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import ConnectionTest from './components/ConnectionTest';

export default function TestScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Connection Test',
          headerStyle: {
            backgroundColor: '#3498db',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <ConnectionTest />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 