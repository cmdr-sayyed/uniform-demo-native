import Constants from 'expo-constants';

import { UniformConfig } from '@/services/uniformService';

type UniformExtraConfig = {
  uniformApiKey?: string;
  uniformProjectId?: string;
  uniformApiHost?: string;
};

/**
 * Reads Uniform credentials from Expo config (works on native + web) and
 * falls back to EXPO_PUBLIC_* env vars when running outside Expo.
 */
export function getUniformConfig(): UniformConfig {
  const extra =
    (Constants.expoConfig?.extra as UniformExtraConfig | undefined) ??
    (Constants.manifest?.extra as UniformExtraConfig | undefined) ??
    {};

  const apiKey = extra.uniformApiKey || process.env.EXPO_PUBLIC_UNIFORM_API_KEY || '';
  const projectId =
    extra.uniformProjectId || process.env.EXPO_PUBLIC_UNIFORM_PROJECT_ID || '';
  const apiHost = extra.uniformApiHost || process.env.EXPO_PUBLIC_UNIFORM_API_HOST;

  if (!apiKey || !projectId) {
    console.warn(
      'Uniform credentials are missing. Update app.json extra or EXPO_PUBLIC_UNIFORM_* env vars.'
    );
  }

  return {
    apiKey,
    projectId,
    apiHost,
  };
}

