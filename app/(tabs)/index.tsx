import { CompositionRenderer } from '@/components/CompositionRenderer';
import { getUniformConfig } from '@/lib/uniformConfig';
import { UniformService } from '@/services/uniformService';
import { ComponentInstance } from '@uniformdev/canvas';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const uniformService = new UniformService(getUniformConfig());

export default function HomeScreen() {
  const [composition, setComposition] = useState<ComponentInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const routes = await uniformService.fetchRoutes();
      console.log('Uniform routes', routes);
    })();
  }, []);

  useEffect(() => {
    loadComposition();
  }, []);

  const loadComposition = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the root composition (path: [])
      const comp = await uniformService.fetchCompositionByRoute([]);

      if (comp) {
        setComposition(comp);
      } else {
        setError('Composition not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load composition');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1f1b16" />
      </View>
    );
  }

  if (error || !composition) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || 'Composition not found'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CompositionRenderer composition={composition} />
      <TouchableOpacity
        style={styles.navButton}
        onPress={() =>
          router.push({
            pathname: '/composition/[...path]',
            params: { path: ['about'], preview: 'true' },
          })
        }>
        <Text style={styles.navButtonText}>Go to About</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#d32f2f',
    fontSize: 16,
  },
  navButton: {
    margin: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#1f1b16',
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
