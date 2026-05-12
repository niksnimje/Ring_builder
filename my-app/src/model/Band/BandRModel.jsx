import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Box3, Vector3, Color } from "three";
import FadeWrapper from "../../utils/FadeWrapper"; // ✅ ADD

const BandRModel = ({
  modelPath,
  color = "#D3AF37",
  scale = 1,
  onLoaded,
  sharedMetalProps,
  diamondWeight,
  // ringScale
}) => {
  const { scene } = useGLTF(modelPath || "/assets/band/Band - W.glb");

  const [clonedScene, setClonedScene] = useState(null);

  // 🎯 target color (smooth transition)
  const targetColor = useRef(new Color(color));

  // ✅ 1. CLONE ONLY WHEN MODEL CHANGE
  useEffect(() => {
    if (!scene) return;

    const cloned = scene.clone(true);

    cloned.traverse((child) => {
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

    setClonedScene(cloned);
  }, [scene]); // 🔥 IMPORTANT: ONLY scene

  // ✅ 2. HEIGHT CALCULATION
  useEffect(() => {
    if (!clonedScene) return;

    const box = new Box3().setFromObject(clonedScene);
    const size = new Vector3();
    box.getSize(size);

    onLoaded?.(size.y);
  }, [clonedScene, onLoaded]);

  // ✅ 3. COLOR CHANGE (NO FADE)
  useEffect(() => {
    targetColor.current.set(color);
  }, [color]);

  // ✅ 4. SMOOTH COLOR LERP
  useFrame(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      if (child.isMesh && !child.name.toLowerCase().includes("diamond")) {
        child.material.color.lerp(targetColor.current, 0.4); // 0.02 = slow , 0.1 = fast
      }
    });
  });



  // ✅ 5. FADE ONLY ON MODEL CHANGE
  return (
    <>
      <FadeWrapper trigger={modelPath} speed={0.03}>
        {clonedScene && (
          <primitive object={clonedScene}
            scale={[1, 1, 0.7]}
          />
        )}
      </FadeWrapper>
    </>
  );
};

export default BandRModel;
