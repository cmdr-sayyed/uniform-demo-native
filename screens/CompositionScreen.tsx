import { ComponentInstance } from '@uniformdev/canvas';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComposition();
  }, [JSON.stringify(params.path), params.compositionId]);

  const loadComposition = async () => {
    try {
      setLoading(true);
      setError(null);

      let comp: ComponentInstance | null = null;

      if (params.compositionId) {
        comp = await uniformService.fetchCompositionById(
          params.compositionId
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
        });
        
        comp = await uniformService.fetchCompositionByRoute(pathArray, { preview: isPreview });
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
});