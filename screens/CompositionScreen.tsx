import { ComponentInstance } from '@uniformdev/canvas';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CompositionRenderer } from '../components/CompositionRenderer';
import { getUniformConfig } from '../lib/uniformConfig';
import { UniformService } from '../services/uniformService';

const uniformService = new UniformService(getUniformConfig());

export function CompositionScreen() {
  const params = useLocalSearchParams<{
    path?: string | string[];
    compositionId?: string;
    preview?: string;
  }>();
  const [composition, setComposition] = useState<ComponentInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isInitialMount = useRef(true);
  const previousParamsRef = useRef<string>('');

  const loadComposition = useCallback(async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      let comp: ComponentInstance | null = null;

      if (params.compositionId) {
        comp = await uniformService.fetchCompositionById(
          params.compositionId,
          { preview: params.preview === 'true', forceRefresh: forceRefresh }
        );
      } else {
        // Handle path as array or string from Expo Router
        // For catch-all routes, path can be an array of segments
        const pathArray = Array.isArray(params.path)
          ? params.path
          : typeof params.path === 'string'
          ? params.path.split('/').filter(Boolean)
          : [];
        const isPreview = params.preview === 'true';
        
        console.log('[CompositionScreen] Loading composition:', {
          pathArray: pathArray,
          params: params,
          isPreview: isPreview,
          forceRefresh: forceRefresh,
        });
        
        comp = await uniformService.fetchCompositionByRoute(pathArray, { 
          preview: isPreview,
          forceRefresh: forceRefresh 
        });
      }

      if (comp) {
        setComposition(comp);
      } else {
        const pathDisplay = Array.isArray(params.path)
          ? params.path.join('/')
          : params.path || 'root';
        setError(`Composition not found for path: /${pathDisplay}. Make sure the composition exists in Uniform and is published.`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load composition';
      console.error('[CompositionScreen] Error loading composition:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [params.compositionId, params.path, params.preview]);

  // Load composition when params change
  useEffect(() => {
    const currentParams = JSON.stringify({ path: params.path, compositionId: params.compositionId });
    
    // Only load if params actually changed
    if (currentParams !== previousParamsRef.current) {
      previousParamsRef.current = currentParams;
      loadComposition(false);
      // Mark initial mount as complete after a short delay
      const timer = setTimeout(() => {
        isInitialMount.current = false;
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [JSON.stringify(params.path), params.compositionId, loadComposition]);

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
});