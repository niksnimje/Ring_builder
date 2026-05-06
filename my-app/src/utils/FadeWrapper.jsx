import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";

const FadeWrapper = ({ children, trigger, speed = 0.09, active = true }) => {
  const groupRef = useRef();
  const opacityRef = useRef(0);

  // 'trigger' prop change (like color or modelPath), animation reset 
  useEffect(() => {
    if (active) {
      opacityRef.current = 0;
    }
  }, [trigger, active]);

  useFrame(() => {
    if (!active || !groupRef.current) return;

    if (opacityRef.current < 1) {
      // Smoothly 0 to 1 
      opacityRef.current = MathUtils.lerp(opacityRef.current, 1, speed);

      groupRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          // Transparency enable 
          if (!child.material.transparent) child.material.transparent = true;
          child.material.opacity = opacityRef.current;
        }
      });
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

export default FadeWrapper;




