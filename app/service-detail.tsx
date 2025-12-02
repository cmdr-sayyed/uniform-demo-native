import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ServiceDetailScreen() {
  const params = useLocalSearchParams<{ id?: string; label?: string }>();

  const label = params.label || params.id || 'Service';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{label}</Text>
      <Text style={styles.subtitle}>
        This is a placeholder page for the "{label}" service. You can customize this
        screen with real content or navigation as needed.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    color: '#004B69',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});


