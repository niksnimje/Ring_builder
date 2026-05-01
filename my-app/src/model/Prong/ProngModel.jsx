
import React, { useEffect, useState } from "react";
import { useGLTF, useEnvironment, MeshRefractionMaterial } from "@react-three/drei";
import { Color, Box3, Vector3 } from "three";
// import FadeWrapper from "../../utils/FadeWrapper";

const ProngModel = ({
  modelPath,
  color = "#fefbf2",
  scale = 0.24,
  position = [0, 0, 0],
  sharedMetalProps,
  setProngDiamondName,
  gemColor,
  sideGemColor = [1.5, 1.5, 1.5]
}) => {
  const { scene } = useGLTF(modelPath);
  const envMap = useEnvironment({
    files: "/assets/hdr/env_gem_Test.exr",
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

        if (name.includes("diamond") || name.includes("gem")) {
          child.visible = false;
          child.updateWorldMatrix(true, false);

          // --- SIZE CALCULATION LOGIC ---
          // Bounding box mesh to get size (x, y, z)
          const box = new Box3().setFromObject(child);
          const size = new Vector3();
          box.getSize(size);
          
          // Volume calculate  (x * y * z)
          const volume = size.x * size.y * size.z;

          tempDiamonds.push({
            geometry: child.geometry,
            matrix: child.matrixWorld.clone(),
            volume: volume, //  base on filter
            name: child.name
          });
        } else {
          // Metal handling
          child.material = child.material.clone();
          child.material.color = new Color(color);
          Object.assign(child.material, sharedMetalProps || {});
        }
      }
    });

    // 2. Sorting: big volume diamond on top
    tempDiamonds.sort((a, b) => b.volume - a.volume);

    // 3. first diamond (index 0) MAIN diamond
    const finalDiamonds = tempDiamonds.map((d, index) => ({
      ...d,
      isTop: index === 0 
    }));

    // Update parent state if needed
    if (finalDiamonds.length > 0) {
      setProngDiamondName(finalDiamonds[0].name);
    }

    setDiamonds(finalDiamonds);
    setClonedScene(cloned);
  }, [scene, color, sharedMetalProps, setProngDiamondName]);

  return (
        // <FadeWrapper trigger={`${modelPath}-${color}-${JSON.stringify(gemColor)}`} active={true}>
    <group scale={scale} position={position}>
      {clonedScene && <primitive object={clonedScene} />}

      {diamonds.map((d, i) => (
        <mesh key={i} geometry={d.geometry} matrix={d.matrix} matrixAutoUpdate={false}>
          <MeshRefractionMaterial
            envMap={envMap}
            ior={2.4}
            fresnel={0.5}
            color={d.isTop ? (gemColor || [1.5, 1.5, 1.5]) : sideGemColor}
            aberrationStrength={d.isTop ? 0.002 : 0.005} // rainbow effect
            bounces={d.isTop ? 4 : 2}
            toneMapped={false}
            fastChroma={true}
          />
        </mesh>
      ))}
    </group>
    // </FadeWrapper>
  );
};

export default ProngModel;