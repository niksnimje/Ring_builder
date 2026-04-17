import React from "react";
import { useEnvironment, MeshRefractionMaterial } from "@react-three/drei";
import { Color } from "three";

const DiamondMesh = ({ geometry, position, rotation, scale }) => {
  const envMap = useEnvironment({ files: "/assets/hdr/diamond (1).hdr" });

  console.log("geometry, position, rotation, scale",geometry, position, rotation, scale)

  // 🔒 Prevent crash if envMap is not yet ready
  if (!envMap) return null;

  return (
    <mesh
      geometry={geometry}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    >
      <MeshRefractionMaterial
        envMap={envMap}
        color={new Color("#ffffff")}
        thickness={3}
        ior={2.417}
        chromaticAberration={0.03}
        backside
        envMapIntensity={3.5}
        fresnel={1}
        fastChroma
        bounces={6}
      />
    </mesh>
  );
};

export default DiamondMesh;
