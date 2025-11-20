/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export const Effects: React.FC = () => {
  return (
    <EffectComposer disableNormalPass multisampling={0}>
      {/* Enhanced bloom for glowing character on dark background */}
      <Bloom
        luminanceThreshold={0.5}
        mipmapBlur
        intensity={1.8}
        radius={0.8}
        levels={8}
      />
      <Noise opacity={0.03} blendFunction={BlendFunction.OVERLAY} />
      <Vignette eskil={false} offset={0.15} darkness={0.6} />
    </EffectComposer>
  );
};
