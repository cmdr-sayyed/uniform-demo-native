import { ComponentInstance } from '@uniformdev/canvas';
import React from 'react';
import { resolveComponent } from './resolver';

interface CompositionRendererProps {
  composition: ComponentInstance;
  context?: any;
}

/**
 * Recursively renders a Uniform composition tree
 */
export function CompositionRenderer({
  composition,
  context,
}: CompositionRendererProps) {
  if (!composition) {
    return null;
  }

  const { component: Component, props } = resolveComponent(composition);

  // Extract parameters from component
  const parameters = composition.parameters || {};
  
  // Extract slots from component
  const slots = composition.slots || {};

  // Convert parameters to a flat object for easier access
  const componentProps = {
    component: composition,
    context: context || {},
    parameters,
    slots,
    // Helper function to get parameter value
    getParameter: (paramId: string) => {
      return parameters[paramId]?.value;
    },
    // Helper function to get slot components
    getSlot: (slotName: string) => {
      return slots[slotName] || [];
    },
  };

  return <Component {...componentProps} {...props} />;
}