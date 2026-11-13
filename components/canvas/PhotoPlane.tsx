'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Image as DreiImage } from '@react-three/drei';
import * as THREE from 'three';
import { damp3, damp } from 'maath/easing';
import { Photo, PhotoCategory } from '@/types/photo';

interface PhotoPlaneProps {
  photo: Photo;
  index: number;
  basePosition: [number, number, number];
  category: PhotoCategory | 'all';
  isFocused: boolean;
  isAnyFocused: boolean;
  onSelect: (photo: Photo) => void;
  onHoverChange: (isHovered: boolean) => void;
  scrollVelocity: number;
}

export default function PhotoPlane({
  photo,
  basePosition,
  category,
  isFocused,
  isAnyFocused,
  onSelect,
  onHoverChange,
  scrollVelocity,
}: PhotoPlaneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const imageRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const { viewport, camera } = useThree();

  // Aspect ratio preservation
  const aspect = useMemo(() => {
    if (photo.width && photo.height) {
      return photo.width / photo.height;
    }
    return 1.4; // Default landscape
  }, [photo.width, photo.height]);

  // Base sizing tailored to viewport
  const baseWidth = useMemo(() => {
    return viewport.width < 5 ? 2.2 : 3.0;
  }, [viewport.width]);

  const baseHeight = baseWidth / aspect;

  const isCategoryMatch = category === 'all' || photo.category === category;

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const group = groupRef.current;
    const targetPos = new THREE.Vector3(...basePosition);
    let targetScale = 1;
    let targetOpacity = 1;
    let targetRotX = 0;
    let targetRotY = 0;
    let targetRotZ = 0;

    if (isFocused) {
      // Lightbox Active: Interpolate directly in front of camera
      const cameraDir = new THREE.Vector3();
      camera.getWorldDirection(cameraDir);
      
      const focusDistance = 3.6;
      targetPos.copy(camera.position).add(cameraDir.multiplyScalar(focusDistance));

      // Calculate scale to fill ~75% of viewport
      const fitHeight = (viewport.height * 0.72) / baseHeight;
      const fitWidth = (viewport.width * 0.75) / baseWidth;
      targetScale = Math.min(fitHeight, fitWidth, 1.4);
      targetOpacity = 1;
      targetRotX = 0;
      targetRotY = 0;
      targetRotZ = 0;
    } else if (isAnyFocused) {
      // Another photo is in focus -> push this one back and fade into fog
      targetPos.z -= 6;
      targetOpacity = 0.04;
      targetScale = 0.85;
    } else if (!isCategoryMatch) {
      // Category filtered out -> fly back into fog
      targetPos.z -= 12;
      targetPos.y -= 1.5;
      targetOpacity = 0;
      targetScale = 0.6;
    } else {
      // Normal corridor state
      if (hovered) {
        targetPos.z += 0.55;
        targetPos.y += 0.1;
        targetScale = 1.05;
      }

      // Add gentle velocity-based pitch & subtle organic roll
      targetRotX = scrollVelocity * 0.08;
      targetRotY = (basePosition[0] > 0 ? -0.06 : 0.06) + (hovered ? 0 : 0);
      targetRotZ = (basePosition[0] > 0 ? 0.015 : -0.015);
    }

    // Smooth physics damping
    damp3(group.position, targetPos, 0.28, delta);
    damp(group.scale, 'x', targetScale, 0.25, delta);
    damp(group.scale, 'y', targetScale, 0.25, delta);
    damp(group.scale, 'z', targetScale, 0.25, delta);
    damp(group.rotation, 'x', targetRotX, 0.3, delta);
    damp(group.rotation, 'y', targetRotY, 0.3, delta);
    damp(group.rotation, 'z', targetRotZ, 0.3, delta);

    if (imageRef.current) {
      const targetZoom = hovered && !isFocused ? 1.04 : 1.0;
      damp(imageRef.current, 'zoom', targetZoom, 0.25, delta);
      if (imageRef.current.material) {
        damp(imageRef.current.material, 'opacity', targetOpacity, 0.3, delta);
        imageRef.current.material.transparent = true;
      }
    }
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    if (!isCategoryMatch || isAnyFocused) return;
    setHovered(true);
    onHoverChange(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHoverChange(false);
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (!isCategoryMatch) return;
    onSelect(photo);
  };

  return (
    <group ref={groupRef} position={basePosition}>
      <DreiImage
        ref={imageRef}
        url={photo.image_url}
        scale={[baseWidth, baseHeight]}
        radius={0.03}
        transparent
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
    </group>
  );
}
