import { ComponentInstance } from '@uniformdev/canvas';
import React from 'react';
import { Text, View } from 'react-native';

// Import your React Native components
// import { Footer } from './';
import { Container } from './Container';
import Hero from './Hero';
// import { ProductCard } from './ProductCard';

export interface ResolvedComponent {
  component: React.ComponentType<any>;
  props?: any;
}

/**
 * Maps Uniform component types to React Native components
 */
export function resolveComponent(
  component: ComponentInstance
): ResolvedComponent {
  const componentType = component.type;

  switch (componentType) {
    case 'page':
      return { component: Container };
    
    case 'hero':
      return { component: Hero };
    
    // case 'header':
    //   return { component: Header };
    
    // case 'footer':
    //   return { component: Footer };
    
    // case 'productCard':
    //   return { component: ProductCard };
    
    default:
      // Fallback component for unknown types
      return {
        component: ({ component }: { component: ComponentInstance }) => (
          <View style={{ padding: 20, backgroundColor: '#f0f0f0' }}>
            <Text style={{ color: '#999' }}>
              Unknown component type: {componentType}
            </Text>
          </View>
        ),
      };
  }
}