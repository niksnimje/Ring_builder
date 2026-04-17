// FINAL DiamondModel.jsx — to match commercial diamond sparkle
import React, { useEffect, useRef, useState } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { Box3, Vector3 } from 'three';
import { useEnvironment, MeshRefractionMaterial } from "@react-three/drei";

const DiamondModel = ({
  modelPath = '/assets/diamond/Diamond - White.glb',
  scale = 0.2,
  position = [0, 0, 0],
  shouldRender = true,
}) => {
  const { scene } = useGLTF(modelPath);
  const sparkleMap = useTexture('/assets/hdr/matcaps2.png');
  const diamondRef = useRef();
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const [geometries, setGeometries] = useState([]);
  const envMap = useEnvironment({ files: "/assets/hdr/diamond (1).hdr" });



  useEffect(() => {
    if (!scene || !shouldRender) return;

    scene.traverse((child) => {
      
      if (child.isMesh) {
        child.geometry.computeVertexNormals();
        child.castShadow = true;
        child.receiveShadow = true;
        child.layers.set(1);
      }
    });

    const meshGeometries = [];
    scene.traverse((child) => {
      if (child.isMesh && child.geometry) {
        meshGeometries.push(child.geometry);
      }
    });
    setGeometries(meshGeometries);

    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    box.getSize(size);
    const yOffset = (size.y / 2) * scale;
    setAdjustedPosition([position[0], position[1] + yOffset, position[2]]);
  }, [scene, scale, position, shouldRender]);

  if (!shouldRender) return null;

  return (
    <group
      ref={diamondRef}
      scale={scale}
      position={adjustedPosition}
      rotation={[Math.PI / -2, 0, 0]}
    >
      {geometries.map((geometry, i) => (
        <mesh key={i} geometry={geometry} layers={1} renderOrder={50}>
          <meshStandardMaterial
            envMap={sparkleMap}
            envMapIntensity={0.4}
            metalness={1}
            roughness={0.02}
            color="#ffffff"
          />
        </mesh>
      ))}
    </group>
  );
};

export default DiamondModel;
