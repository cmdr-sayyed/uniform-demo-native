import { ComponentInstance } from '@uniformdev/canvas';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  component: ComponentInstance;
  context?: any;
  getParameter?: (paramId: string) => any;
}

export function Header({ component, context, getParameter }: HeaderProps) {
  const brandName = getParameter?.('brandName') || 'Brand';
  const navPrimaryLabel = getParameter?.('navPrimaryLabel');
  const navPrimaryLink = getParameter?.('navPrimaryLink');

  const handleNavPress = (link: any) => {
    if (link?.path) {
      const pathArray = link.path.split('/').filter(Boolean);
      router.push({
        pathname: '/composition/[...path]',
        params: { path: pathArray },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>{brandName}</Text>
      
      {navPrimaryLabel && navPrimaryLink && (
        <TouchableOpacity
          onPress={() => handleNavPress(navPrimaryLink)}
        >
          <Text style={styles.navItem}>{navPrimaryLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ede3d9',
  },
  brand: {
    fontSize: 18,
    fontWeight: '600',
    color: '#15120f',
  },
  navItem: {
    fontSize: 14,
    color: '#4b443c',
    textTransform: 'uppercase',
  },
});