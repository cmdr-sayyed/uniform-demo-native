// TestScreen.tsx
import React from 'react';
import { Button, View } from 'react-native';
import { getUniformConfig } from '../lib/uniformConfig';
import { UniformService } from '../services/uniformService';

const uniformService = new UniformService(getUniformConfig());

export function TestScreen() {
  const testFetch = async () => {
    const composition = await uniformService.fetchCompositionByRoute([]);
    console.log('Composition:', JSON.stringify(composition, null, 2));
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Button title="Test Fetch" onPress={testFetch} />
    </View>
  );
}