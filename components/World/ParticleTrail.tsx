/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store';

interface ParticleTrailProps {
  position: THREE.Vector3;
  isJumping: boolean;
  isImmortalityActive: boolean;
}

export const ParticleTrail: React.FC<ParticleTrailProps> = ({ position, isJumping, isImmortalityActive }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const speed = useStore(state => state.speed);

  const particleCount = 50;

  // Particle system with positions and velocities
  const { positions, velocities, lifetimes } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    const life = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;

      vel[i * 3] = (Math.random() - 0.5) * 0.5;
      vel[i * 3 + 1] = Math.random() * 0.5;
      vel[i * 3 + 2] = Math.random() * 2;

      life[i] = Math.random();
    }

    return { positions: pos, velocities: vel, lifetimes: life };
  }, []);

  useFrame((state, delta) => {
    if (!particlesRef.current || speed === 0) return;

    const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      // Decrease lifetime
      lifetimes[i] -= delta * 2;

      // Reset particle if dead
      if (lifetimes[i] <= 0) {
        // Spawn at character position
        posArray[i * 3] = position.x + (Math.random() - 0.5) * 0.3;
        posArray[i * 3 + 1] = position.y + Math.random() * 0.5;
        posArray[i * 3 + 2] = position.z;
        lifetimes[i] = 1.0;
      } else {
        // Move particle
        posArray[i * 3] += velocities[i * 3] * delta;
        posArray[i * 3 + 1] += velocities[i * 3 + 1] * delta - 2 * delta; // Gravity
        posArray[i * 3 + 2] += velocities[i * 3 + 2] * delta;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  // Color based on state
  const particleColor = isImmortalityActive ? '#FFD700' : '#FF69B4';

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color={particleColor}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
