import React, { useEffect, useState, useRef } from "react";
import { useGLTF, useEnvironment, MeshRefractionMaterial } from "@react-three/drei";
import { Color, Box3, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import AnimatedDiamond from "./AnimatedDiamond";
import * as THREE from "three";
import FadeWrapper from "../../utils/FadeWrapper";

const ProngModel = ({
  modelPath,
  fadeTrigger,
  color = "#fefbf2",
  scale = 0.24,
  position = [0, 0, 0],
  sharedMetalProps,
  setProngDiamondName,
  gemColor,
  sideGemColor = [1.5, 1.5, 1.5],
  onProngClick
}) => {
  const { scene } = useGLTF(modelPath);
  const envMap = useEnvironment({
    files: "/assets/hdr/env_gem_Test.exr",
    // files: "/assets/hdr/env_gem_002_30251392af (2).exr",
    // files: "/assets/hdr/env_metal_014_66e705951c.exr",
    // files: "/assets/hdr/env_gem_raff.exr",

  });

  useEffect(() => {
    if (envMap) envMap.intensity = 0.0;
  }, [envMap]);

  const [diamonds, setDiamonds] = useState([]);
  const [clonedScene, setClonedScene] = useState(null);

  useEffect(() => {
    if (!scene) return;

    const cloned = scene.clone(true);
    cloned.updateMatrixWorld(true);

    const tempDiamonds = [];

    cloned.traverse((child) => {
  if (child.isMesh) {
    const name = child.name.toLowerCase();
    
    // console.log("Mesh Name:", name);

    const isDiamond = name.includes("diamond") || 
                      name.includes("gem") || 
                      name.includes("octonus"); 

    if (isDiamond) {
      child.visible = false;
      child.updateWorldMatrix(true, false);

      const box = new Box3().setFromObject(child);
      const size = new Vector3();
      box.getSize(size);
      const volume = size.x * size.y * size.z;

      tempDiamonds.push({
        geometry: child.geometry,
        matrix: child.matrixWorld.clone(),
        volume: volume,
        name: child.name
      });
    } else {
      child.material = child.material.clone();
      child.material.color = new Color(color);
      Object.assign(child.material, sharedMetalProps || {});
    }
  }
});

    tempDiamonds.sort((a, b) => b.volume - a.volume);

    const finalDiamonds = tempDiamonds.map((d, index) => ({
      ...d,
      isTop: index === 0
    }));

    if (finalDiamonds.length > 0) {
      setProngDiamondName(finalDiamonds[0].name);
    }

    setDiamonds(finalDiamonds);
    setClonedScene(cloned);
  }, [scene, color, sharedMetalProps, setProngDiamondName]);

  return (
     <FadeWrapper trigger={fadeTrigger}>
    <group scale={scale} position={position}  
    onClick={(e) => {
    e.stopPropagation();

    if (onProngClick) {
      // world position 
      const worldPos = new THREE.Vector3();
      e.eventObject.getWorldPosition(worldPos);

      onProngClick(worldPos);
    }
  }}>
      {clonedScene && <primitive object={clonedScene} />}

      {diamonds.map((d, i) => (
        <AnimatedDiamond
          key={i}
          geometry={d.geometry}
          matrix={d.matrix}
          isTop={d.isTop}
          targetColor={gemColor}
          sideGemColor={sideGemColor}
          envMap={envMap}
          
        />
      ))}
    </group>
    </FadeWrapper>
  );
};

export default ProngModel;