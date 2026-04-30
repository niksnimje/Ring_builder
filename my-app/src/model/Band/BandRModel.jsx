import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Box3, Vector3, Color } from "three";

const BandRModel = ({
  modelPath,
  color = "#D3AF37",
  scale = 1,
  onLoaded,
  sharedMetalProps,
}) => {
  const { scene } = useGLTF(modelPath || "/assets/band/Band - W.glb");
  const [clonedScene, setClonedScene] = useState(null);
  
  // New target color store 
  const targetColor = useRef(new Color(color));

  useEffect(() => {
    const cloned = scene.clone(true);
    setClonedScene(cloned);
  }, [scene]);

  // 'color' prop change, targetColor update
  useEffect(() => {
    targetColor.current.set(color);
  }, [color]);

  useEffect(() => {
    if (!clonedScene) return;

    const box = new Box3().setFromObject(clonedScene);
    const size = new Vector3();
    box.getSize(size);
    onLoaded?.(size.y);

    clonedScene.traverse((child) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();
        if (!name.includes("diamond")) {
          child.material = child.material.clone();
          Object.assign(child.material, sharedMetalProps || {});
        } else {
          child.visible = false;
        }
      }
    });
  }, [clonedScene, onLoaded, sharedMetalProps]);

  // --- SMOOTH COLOR TRANSITION LOGIC ---
  useFrame((state, delta) => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      if (child.isMesh && !child.name.toLowerCase().includes("diamond")) {
        // 'lerp' function current color target color  move 
        // 0.1 = 'smoothness' if (0.05) then slow fill.
        child.material.color.lerp(targetColor.current, 0.07);
      }
    });
  });

  return (
    <>
      {clonedScene && (
        <primitive object={clonedScene} scale={[1, 1, 0.7]} />
      )}
    </>
  );
};

export default BandRModel;