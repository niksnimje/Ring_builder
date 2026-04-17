import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useEnvironment, MeshRefractionMaterial } from "@react-three/drei";
import { Color } from "three";

const ProngModel = ({
  modelPath,
  color = "#fefbf2",
  scale = 0.24,
  position = [0, 0, 0],
  sharedMetalProps,
  setProngDiamondName,
}) => {
  const { scene } = useGLTF(modelPath);
  const envMap = useEnvironment({
    files: "/assets/hdr/diamond (1).hdr",
  });

  useEffect(() => {
    if (envMap) {
      envMap.intensity = 2.0; // brightness inner diamond 
    }
  }, [envMap]);

  const [clonedScene, setClonedScene] = useState(null);
  const [diamonds, setDiamonds] = useState([]);
  const prongRef = useRef();

  useEffect(() => {
    setProngDiamondName(false);
    setClonedScene(null);
    setDiamonds([]);
  }, [modelPath, setProngDiamondName]);

  useEffect(() => {
    if (!scene) return;

    const cloned = scene.clone(true);
    cloned.updateMatrixWorld(true);

    const diamondList = [];

    cloned.traverse((child) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();

        if (name.includes("diamond")) {
          setProngDiamondName(child.name);

          // hide original
          child.visible = false;

          // store FULL WORLD TRANSFORM (important 🔥)
          child.updateWorldMatrix(true, false);

          diamondList.push({
            geometry: child.geometry,
            matrix: child.matrixWorld.clone(),
          });
        } else {
          child.material = child.material.clone();
          child.material.color = new Color(color);
          Object.assign(child.material, sharedMetalProps || {});
        }
      }
    });

    setDiamonds(diamondList);
    setClonedScene(cloned);
  }, [scene, color, sharedMetalProps, setProngDiamondName]);


  return (
    <>
      {clonedScene && (
        <group ref={prongRef} scale={scale} position={position}>
          <primitive object={clonedScene} />

          {/* ✅ PERFECT POSITION DIAMONDS */}
          {diamonds.map((d, i) => (
            <mesh
              key={i}
              geometry={d.geometry}
              matrix={d.matrix}
              matrixAutoUpdate={false} // VERY IMPORTANT
            >
              {/* normal color of diamond */}

              {/* <meshStandardMaterial
                color="#ffffff"
                roughness={0.3}
                metalness={0}
              /> */}

              <MeshRefractionMaterial
                envMap={envMap}
                ior={2.42}
                fresnel={0.4}           
                bounces={4}
                aberrationStrength={0.014} // adjust rainbow effect 
                color={[1.8, 1.8, 1.8]} // adjust brightness 
                toneMapped={false}
                fastChroma={true}
              />


            </mesh>
          ))}
        </group>
      )}
    </>
  );
};

export default ProngModel;