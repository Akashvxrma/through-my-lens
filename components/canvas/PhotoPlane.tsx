'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Image as DreiImage } from '@react-three/drei';
import * as THREE from 'three';
import { damp3, damp } from 'maath/easing';
import { Photo, PhotoCategory } from '@/types/photo';
import { getOptimizedImageUrl } from '@/lib/utils/image-optimization';

interface PhotoPlaneProps {
  photo: Photo;
  index: number;
  basePosition: [number, number, number];
  category: PhotoCategory | 'all';
  isFocused: boolean;
  isAnyFocused: boolean;
  onSelect: (photo: Photo) => void;
  scrollVelocity: number;
}

function PhotoPlaneComponent({
  photo,
  basePosition,
  category,
  isFocused,
  isAnyFocused,
  onSelect,
  scrollVelocity,
}: PhotoPlaneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const imageRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const { viewport, camera } = useThree();

  // Aspect ratio calculation
  const aspect = useMemo(() => {
    if (photo.width && photo.height) {
      return photo.width / photo.height;
    }
    return 1.4;
  }, [photo.width, photo.height]);

  const baseWidth = useMemo(() => {
    return viewport.width < 5 ? 2.2 : 3.0;
  }, [viewport.width]);

  const baseHeight = baseWidth / aspect;

  const isCategoryMatch = category === 'all' || photo.category === category;

  // Dual-Resolution Texture Pipeline:
  // Corridor uses lightweight WebP; Focus Mode upgrades to raw high-res texture
  const activeImageUrl = useMemo(() => {
    if (isFocused) {
      return photo.image_url;
    }
    return photo.thumbnail_url || getOptimizedImageUrl(photo.image_url, { width: 850, quality: 78 });
  }, [photo.image_url, photo.thumbnail_url, isFocused]);

  // Texture configuration & GPU memory cleanup on unmount
  useEffect(() => {
    return () => {
      if (imageRef.current?.material) {
        if (imageRef.current.material.map) {
          imageRef.current.material.map.dispose();
        }
        imageRef.current.material.dispose();
      }
    };
  }, []);

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

      const fitHeight = (viewport.height * 0.72) / baseHeight;
      const fitWidth = (viewport.width * 0.75) / baseWidth;
      targetScale = Math.min(fitHeight, fitWidth, 1.4);
      targetOpacity = 1;
    } else if (isAnyFocused) {
      // Another photo is in focus -> push back and fade
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

      targetRotX = scrollVelocity * 0.08;
      targetRotY = basePosition[0] > 0 ? -0.06 : 0.06;
      targetRotZ = basePosition[0] > 0 ? 0.015 : -0.015;
    }

    // Performance Culling:
    // Determine distance relative to camera Z
    const distZ = group.position.z - camera.position.z;
    const isOutOfView =
      !isFocused &&
      (distZ > 2.5 || distZ < -26 || (!isCategoryMatch && group.scale.x < 0.65));

    if (isOutOfView) {
      if (group.visible) group.visible = false;
      return; // Skip draw calls, matrix calculations, and damping for unseen planes!
    } else {
      if (!group.visible) group.visible = true;
    }

    // Smooth physics damping (delta compensated)
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
        
        // Ensure lightweight anisotropy for 60fps performance
        if (imageRef.current.material.map && !imageRef.current.material.map._configured) {
          imageRef.current.material.map.anisotropy = isFocused ? 2 : 1;
          imageRef.current.material.map.minFilter = THREE.LinearMipmapLinearFilter;
          imageRef.current.material.map.magFilter = THREE.LinearFilter;
          imageRef.current.material.map._configured = true;
        }
      }
    }
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    if (!isCategoryMatch || isAnyFocused) return;
    setHovered(true);
    // Non-blocking custom event to decouple React state re-renders
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('photo-hover', { detail: true }));
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('photo-hover', { detail: false }));
    }
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
        url={activeImageUrl}
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

export default React.memo(PhotoPlaneComponent);
