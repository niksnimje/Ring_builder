
import { MeshRefractionMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react'
import { Color } from 'three';

const AnimatedDiamond = ({ geometry, matrix, isTop, targetColor, sideGemColor, envMap }) => {
  const meshRef = useRef();

  const normalizeColor = (c) => {
    if (!c) return [1.5, 1.5, 1.5];
    if (Array.isArray(c)) return c; 
    const threeColor = new Color(c);
    return [threeColor.r, threeColor.g, threeColor.b]; 
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
        ior={2.4} //  index of refraction for diamond
        fresnel={0.5}
        color={displayColor}
        aberrationStrength={isTop ? 0.003 : 0.005} // rainbow effect
        toneMapped={true} // for glow effect
        fastChroma={true} // performance boost for chromatic aberration
        envMapIntensity={isTop ? 2.5 : 1.3}
        bounces={isTop ? 3 : 0.2}
        thickness={isTop ? 0.25 : 0.08} // material depth
      />
    </mesh>
  );
};

export default AnimatedDiamond;
