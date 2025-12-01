import { ComponentInstance } from '@uniformdev/canvas';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { UniformSlot } from './UniformSlot';

interface ContainerProps {
  component: ComponentInstance;
  context?: any;
  slots?: Record<string, ComponentInstance[]>;
}

export function Container({ component, context, slots }: ContainerProps) {

  const contentSlot = slots?.content || [];

  return (
    <View style={styles.container}>
      <UniformSlot slot={contentSlot} context={context} slotName="content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});