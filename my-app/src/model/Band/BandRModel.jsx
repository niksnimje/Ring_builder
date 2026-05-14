import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Box3, Vector3, Color } from "three";
import FadeWrapper from "../../utils/FadeWrapper"; 


const BandRModel = ({
  modelPath,
  color = "#D3AF37",
  scale = 1,
  onLoaded,
  sharedMetalProps,
  diamondWeight,
}) => {
  const { scene } = useGLTF(modelPath || "/assets/band/Band - W.glb");
  const [clonedScene, setClonedScene] = useState(null);
  const targetColor = useRef(new Color(color));
  const isInitialized = useRef(false);

  // Clone scene
  useEffect(() => {
    if (!scene) return;
    const cloned = scene.clone(true);
    cloned.traverse((child) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();
        if (!name.includes("diamond")) {
          child.material = child.material.clone();
          // ✅ SET INITIAL COLOR IMMEDIATELY
          child.material.color.set(color);
          Object.assign(child.material, sharedMetalProps || {});
        } else {
          child.visible = false;
        }
      }
    });
    setClonedScene(cloned);
    isInitialized.current = false;
  }, [scene, sharedMetalProps]);

  // Track color changes
  useEffect(() => {
    targetColor.current.set(color);
  }, [color]);

  // Smooth animation with proper initialization
  useFrame(() => {
    if (!clonedScene) return;
    
    clonedScene.traverse((child) => {
      if (child.isMesh && !child.name.toLowerCase().includes("diamond")) {
        if (!isInitialized.current) {
          // ✅ Force immediate color on first frame
          child.material.color.set(targetColor.current);
        } else {
          // ✅ Smooth lerp with lower factor
          child.material.color.lerp(targetColor.current, 0.08);
        }
      }
    });
    
    if (!isInitialized.current) {
      isInitialized.current = true;
    }
  });

  return (
    <>
      <FadeWrapper trigger={modelPath} speed={0.03}>
        {clonedScene && (
          <primitive object={clonedScene} scale={[1, 1, 0.7]} />
        )}
      </FadeWrapper>
    </>
  );
};
export default BandRModel;
