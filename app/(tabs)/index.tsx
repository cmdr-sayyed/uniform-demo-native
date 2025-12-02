import { CompositionRenderer } from '@/components/CompositionRenderer';
import { getUniformConfig } from '@/lib/uniformConfig';
import { UniformService } from '@/services/uniformService';
import { ComponentInstance } from '@uniformdev/canvas';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

const uniformService = new UniformService(getUniformConfig());

export default function HomeScreen() {
  const [composition, setComposition] = useState<ComponentInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    (async () => {
      const routes = await uniformService.fetchRoutes();
      console.log('Uniform routes', routes);
    })();
  }, []);

  const loadComposition = useCallback(async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Fetch the root composition (path: [])
      // forceRefresh ensures we get the latest published content from Uniform
      const comp = await uniformService.fetchCompositionByRoute([], { 
        preview: false,
        forceRefresh: forceRefresh 
      });

      if (comp) {
        setComposition(comp);
      } else {
        setError('Composition not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load composition');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Load composition on mount
  useEffect(() => {
    loadComposition(false);
    // Mark initial mount as complete after a short delay
    const timer = setTimeout(() => {
      isInitialMount.current = false;
    }, 1000);
    return () => clearTimeout(timer);
  }, [loadComposition]);

  // Refresh when screen comes into focus (user returns to this screen)
  // This ensures changes published in Uniform are visible when user navigates back
  useFocusEffect(
    useCallback(() => {
      // Only refresh if it's not the initial mount (avoid double fetch on mount)
      if (!isInitialMount.current) {
        loadComposition(true);
      }
    }, [loadComposition])
  );

  const onRefresh = useCallback(() => {
    loadComposition(true);
  }, [loadComposition]);

  if (loading && !composition) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1f1b16" />
      </View>
    );
  }

  if (error || !composition) {
    return (
      <ScrollView
        contentContainerStyle={styles.center}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.error}>{error || 'Composition not found'}</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <CompositionRenderer composition={composition} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
