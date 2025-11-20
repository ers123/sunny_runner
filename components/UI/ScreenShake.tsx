/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

let shakeIntensity = 0;
let shakeDuration = 0;

// Global function to trigger screen shake
export const triggerScreenShake = (intensity: number = 0.1, duration: number = 0.3) => {
  shakeIntensity = intensity;
  shakeDuration = duration;
};

export const ScreenShake = () => {
  const { camera } = useThree();
  const originalPosition = useRef({ x: 0, y: 5.5, z: 8 });

  useFrame((state, delta) => {
    if (shakeDuration > 0) {
      // Apply shake
      const offsetX = (Math.random() - 0.5) * shakeIntensity;
      const offsetY = (Math.random() - 0.5) * shakeIntensity;

      camera.position.x = originalPosition.current.x + offsetX;
      camera.position.y += offsetY;

      // Decrease shake
      shakeDuration -= delta;
      shakeIntensity *= 0.9;
    } else {
      // Reset to normal position (lerp back smoothly)
      if (shakeDuration < 0) {
        shakeDuration = 0;
        shakeIntensity = 0;
      }
    }
  });

  return null;
};
