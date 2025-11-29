import { ComponentInstance } from '@uniformdev/canvas';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface HeroProps {
  component: ComponentInstance;
  context?: any;
  getParameter?: (paramId: string) => any;
}

export function Hero({ component, context, getParameter }: HeroProps) {
  // Extract parameter values
  const title = getParameter?.('title') || '';
  const description = getParameter?.('description') || '';
  const eyebrow = getParameter?.('eyebrow') || '';
  const primaryCta = getParameter?.('primaryCta') || '';
  const primaryCtaLink = getParameter?.('primaryCtaLink');
  const image = getParameter?.('image');

  const handlePress = () => {
    if (primaryCtaLink?.path) {
      // Handle navigation - adjust based on your navigation setup
      if (primaryCtaLink.type === 'url') {
        // Open external URL - you'll need Linking from react-native
        // Linking.openURL(primaryCtaLink.path);
      } else {
        // Navigate to internal route using Expo Router
        const pathArray = primaryCtaLink.path.split('/').filter(Boolean);
        router.push({
          pathname: '/composition/[...path]',
          params: { path: pathArray },
        });
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {eyebrow && (
          <Text style={styles.eyebrow}>{eyebrow}</Text>
        )}
        
        {title && (
          <Text style={styles.title}>{title}</Text>
        )}
        
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}

        {image?.url && (
          <Image
            source={{ uri: image.url }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        {primaryCta && (
          <TouchableOpacity
            style={styles.button}
            onPress={handlePress}
          >
            <Text style={styles.buttonText}>{primaryCta}</Text>
          </TouchableOpacity>
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f6f2',
  },
  content: {
    padding: 20,
  },
  eyebrow: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#a67a68',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#171410',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#5c5349',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1f1b16',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});