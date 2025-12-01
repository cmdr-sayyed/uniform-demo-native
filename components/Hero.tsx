import { ComponentInstance, flattenValues } from '@uniformdev/canvas';
import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View
} from 'react-native';

interface HeroProps {
  component: ComponentInstance;
  context?: any;
  getParameter?: (paramId: string) => any;
}

function Hero({ component, context, getParameter }: HeroProps) {
  // Extract parameter values
  // console.log('Hero component', component);
  const title = getParameter?.('title') || '';
  const imageParam = getParameter?.('heroImage');

  // Get image URL from parameter (typed as an asset with a url field)
  const heroImage = flattenValues(imageParam?.[0] ?? {}) as { url?: string };
  const heroImageUrl = heroImage?.url ?? '';

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: heroImageUrl }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        
        <View style={styles.overlay} />
        
       
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 148,
  },
  backgroundImage: {
    width: '100%',
    minHeight: 148,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 50, 0.6)', // Dark blue semi-transparent overlay
  },
  content: {
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});

export default Hero;