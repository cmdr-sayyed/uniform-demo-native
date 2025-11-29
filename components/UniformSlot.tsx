import { ComponentInstance } from '@uniformdev/canvas';
import React from 'react';
import { CompositionRenderer } from './CompositionRenderer';

interface UniformSlotProps {
  slot: ComponentInstance[];
  context?: any;
  slotName?: string;
}

/**
 * Renders all components within a slot
 */
export function UniformSlot({
  slot,
  context,
  slotName,
}: UniformSlotProps) {
  if (!slot || slot.length === 0) {
    return null;
  }

  return (
    <>
      {slot.map((component, index) => (
        <CompositionRenderer
          key={component._id || `slot-${slotName}-${index}`}
          composition={component}
          context={context}
        />
      ))}
    </>
  );
}