import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";

const BandRModel = ({
  modelPath,
  color = "#D3AF37",
  scale = 1,
  onLoaded,
  sharedMetalProps,
}) => {
  const { scene } = useGLTF(modelPath || "/assets/band/Band - W.glb");

  const [clonedScene, setClonedScene] = useState(null);
  const bandRef = useRef();

  useEffect(() => {
    const cloned = scene.clone(true);
    setClonedScene(cloned);
  }, [scene]);

  useEffect(() => {
    if (!clonedScene) return;

    const box = new Box3().setFromObject(clonedScene);
    const size = new Vector3();
    box.getSize(size);
    onLoaded?.(size.y);

    clonedScene.traverse((child) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();

        // ❌ diamond logic removed
        if (!name.includes("diamond")) {
          child.material = child.material.clone();
          child.material.color.set(color);
          Object.assign(child.material, sharedMetalProps || {});
        } else {
          // hide diamonds from band
          child.visible = false;
        }
      }
    });
  }, [clonedScene, color, onLoaded, sharedMetalProps]);

  return (
    <>
      {clonedScene && (
        <primitive object={clonedScene} scale={[1,1,0.7]} ref={bandRef} />
      )}
    </>
  );
};

export default BandRModel;