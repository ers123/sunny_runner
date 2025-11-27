/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment } from './components/World/Environment';
import { Player } from './components/World/Player';
import { LevelManager } from './components/World/LevelManager';
import { Effects } from './components/World/Effects';
import { HUD } from './components/UI/HUD';
import { MainMenu } from './components/UI/MainMenu';
import { useStore } from './store';
import { GameStatus } from './types';
import { ScreenShake } from './components/UI/ScreenShake';
import { AchievementTrigger } from './components/World/AchievementTrigger';

// Dynamic Camera Controller
const CameraController = () => {
  const { camera, size } = useThree();
  const { laneCount } = useStore();
  
  useFrame((state, delta) => {
    // Determine if screen is narrow (mobile portrait)
    const aspect = size.width / size.height;
    const isMobile = aspect < 1.2; // Threshold for "mobile-like" narrowness or square-ish displays

    // Calculate expansion factors
    // Mobile requires backing up significantly more because vertical FOV is fixed in Three.js,
    // meaning horizontal view shrinks as aspect ratio drops.
    // We use more aggressive multipliers for mobile to keep outer lanes in frame.
    const heightFactor = isMobile ? 2.0 : 0.5;
    const distFactor = isMobile ? 4.5 : 1.0;

    // Base (3 lanes): y=5.5, z=8
    // Calculate target based on how many extra lanes we have relative to the start
    const extraLanes = Math.max(0, laneCount - 3);

    const targetY = 5.5 + (extraLanes * heightFactor);
    const targetZ = 8.0 + (extraLanes * distFactor);

    const targetPos = new THREE.Vector3(0, targetY, targetZ);
    
    // Smoothly interpolate camera position
    camera.position.lerp(targetPos, delta * 2.0);
    
    // Look further down the track to see the end of lanes
    // Adjust look target slightly based on height to maintain angle
    camera.lookAt(0, 0, -30); 
  });
  
  return null;
};

function Scene() {
  return (
    <>
        <Environment />
        <ScreenShake />
        <group>
            {/* Attach a userData to identify player group for LevelManager collision logic */}
            <group userData={{ isPlayer: true }} name="PlayerGroup">
                 <Player />
            </group>
            <LevelManager />
        </group>
        <Effects />
    </>
  );
}

function App() {
  const status = useStore((state) => state.status);

  return (
    <div className="relative w-screen h-screen bg-gradient-to-b from-pink-200 via-purple-200 to-blue-200 overflow-hidden select-none">
      {/* 3D Canvas - Background Layer */}
      {status !== GameStatus.MENU && (
        <div className="absolute inset-0 w-full h-full">
          <Canvas
            shadows
            dpr={[1, 1.5]}
            gl={{ antialias: false, stencil: false, depth: true, powerPreference: "high-performance" }}
            camera={{ position: [0, 5.5, 8], fov: 60 }}
          >
            <CameraController />
            <Suspense fallback={null}>
                <Scene />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* HUD Overlay - Over Canvas */}
      {status !== GameStatus.MENU && (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <HUD />
          <AchievementTrigger />
        </div>
      )}

      {/* Main Menu - Full Screen Overlay */}
      {status === GameStatus.MENU && (
        <div className="absolute inset-0 w-full h-full">
          <MainMenu />
        </div>
      )}
    </div>
  );
}

export default App;
