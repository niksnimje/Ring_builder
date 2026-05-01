
import { MeshRefractionMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react'
import { Color, Box3, Vector3 } from 'three';

const AnimatedDiamond = ({ geometry, matrix, isTop, targetColor, sideGemColor, envMap }) => {
  const meshRef = useRef();

  const normalizeColor = (c) => {
    if (!c) return [1.5, 1.5, 1.5];
    if (Array.isArray(c)) return c; // already array — seedha use karo, no multiply
    const threeColor = new Color(c);
    return [threeColor.r, threeColor.g, threeColor.b]; // ✅ * 2 hataya
  };

  const resolvedInitial = normalizeColor(isTop ? targetColor : sideGemColor);

  const currentColor = useRef([...resolvedInitial]);
  const [displayColor, setDisplayColor] = useState([...resolvedInitial]);
  const targetRef = useRef([...resolvedInitial]);

  useEffect(() => {
    targetRef.current = normalizeColor(isTop ? targetColor : sideGemColor);
  }, [targetColor, sideGemColor, isTop]);

  useFrame((_, delta) => {
    const target = targetRef.current;
    const current = currentColor.current;

    const speed = 4.0;
    const lerpFactor = 1 - Math.exp(-speed * delta);

    const newR = current[0] + (target[0] - current[0]) * lerpFactor;
    const newG = current[1] + (target[1] - current[1]) * lerpFactor;
    const newB = current[2] + (target[2] - current[2]) * lerpFactor;

    const changed =
      Math.abs(newR - current[0]) > 0.001 ||
      Math.abs(newG - current[1]) > 0.001 ||
      Math.abs(newB - current[2]) > 0.001;

    if (changed) {
      currentColor.current = [newR, newG, newB];
      setDisplayColor([newR, newG, newB]);
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} matrix={matrix} matrixAutoUpdate={false}>
      <MeshRefractionMaterial
        envMap={envMap}
        ior={2.4}
        fresnel={0.5}
        color={displayColor}
        aberrationStrength={isTop ? 0.002 : 0.005}
        bounces={isTop ? 4 : 2}
        toneMapped={false}
        fastChroma={true}
      />
    </mesh>
  );
};

export default AnimatedDiamond;
