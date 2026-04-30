import React, { useEffect, useState } from "react";
import { useGLTF, useEnvironment, MeshRefractionMaterial } from "@react-three/drei";
import { Color, Euler, Quaternion, Vector3 } from "three";

const Pave = ({ modelPath   }) => {
  const { scene } = useGLTF(modelPath || "/assets/band/Band - W.glb");
  const envMap = useEnvironment({ files: "/assets/hdr/diamond (1).hdr" });

  const [diamonds, setDiamonds] = useState([]);
  // console.log("Model Path:", modelPath);
  useEffect(() => {
    const cloned = scene.clone(true);
    const temp = [];
    

    cloned.traverse((child) => {
      if (child.isMesh && child.name.toLowerCase().includes("diamond")) {
        child.updateMatrixWorld(true);

        const worldPos = new Vector3();
        const worldScale = new Vector3();
        const worldQuat = new Quaternion(); // 👈 NEW

        child.getWorldPosition(worldPos);
        child.getWorldScale(worldScale);
        child.getWorldQuaternion(worldQuat); // 👈 FIX

        temp.push({
          geometry: child.geometry,
          position: worldPos,
          rotation: child.rotation.clone(),
          rotation: new Euler().setFromQuaternion(worldQuat), // 👈 FIX
          scale: worldScale, // ✅ FIX
        });
      }
    });

    setDiamonds(temp);
  }, [scene]);
  const isHalo = modelPath?.toLowerCase().includes("halo");

  return (
    <>
      {diamonds.map((d, idx) => (
        <mesh
          key={idx}
          geometry={d.geometry}
          position={d.position}
  //         position={[
  //   d.position.x,
  //   d.position.y + 0.03,
  //   isHalo
  //     ? d.position.z + (d.position.z > 0 ? -0.07 : 0.07)
  //     : d.position.z
  // ]}
          rotation={d.rotation}
          scale={d.scale}
        >
          <MeshRefractionMaterial
            envMap={envMap}
           color={[1.5, 1.5, 1.5]} 
            envMapIntensity={2.2}
            thickness={2.5}
            ior={2.0}
            chromaticAberration={0.0}
            fresnel={1.0}
            fastChroma={true}
            backside
            bounces={4}
            reflectivity={1.1}
            gamma={0.95}
            aberrationStrength={0.005} // adjust rainbow effect 
          />
        </mesh>
      ))}
    </>
  );
};

export default Pave;