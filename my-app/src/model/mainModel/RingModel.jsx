// RingModel.jsx — supports MeshRefraction diamond rendering
import React, { useState, useEffect, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import BandRModel from "../Band/BandRModel";
import ProngModel from "../Prong/ProngModel";
import DiamondModel from "../Diamond/DiamondModel";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../Context/TheamContext";
import Pave from "../Band/Pave";
// import { EffectComposer, Bloom } from '@react-three/postprocessing';

const RotatingRing = ({ children, isRotating = true }) => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (isRotating && groupRef.current) {
      // Slow rotation on Y axis - adjust speed as needed
      groupRef.current.rotation.y += 0.005; // 0.005 is slow, increase for faster rotation
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

const RingModel = ({
  selectedShank,
  selectedProng,
  selectedDiamond,
  bandColor,
  bandScale,
  prongColor,
  prongScale,
  bandHeight,
  diamondScale,
  prongOffsetY,
  diamondBaseY,
  sharedMetalProps,
  setBandHeight,
  diamondWeight
}) => {
  const [adjustedProngOffsetY, setAdjustedProngOffsetY] = useState(prongOffsetY);
  const [adjustedProngScale, setAdjustedProngScale] = useState(prongScale);
  const [prongDiamondName, setProngDiamondName] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const ringGroupRef = useRef();

  // Fullscreen functions
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) { // Safari
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) { // IE/Edge
        containerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { // Safari
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (selectedProng) {
      const prongName = selectedProng.name.toLowerCase();
      if (prongName.includes("halo") && !prongName.includes("hidden")) {
        setAdjustedProngOffsetY(prongOffsetY / 1.13);
        setAdjustedProngScale(prongScale * 1.23);
      } else {
        setAdjustedProngOffsetY(prongOffsetY);
        setAdjustedProngScale(prongScale);
      }
    }
  }, [selectedProng, prongOffsetY, prongScale]);

  const getProngModelPath = () => {
    const shankName = selectedShank?.name;
    const prongName = selectedProng?.name;
    const shape = selectedDiamond?.name;
    const weightKey = diamondWeight?.value?.toString();

    if (selectedProng?.shapeMap && shape) {
      const shapeEntry = selectedProng.shapeMap[shape];

      if (shapeEntry) {
        if (shankName === "Pave" && shapeEntry.Pave) {
          if (weightKey && shapeEntry.Pave[weightKey]) {
            return shapeEntry.Pave[weightKey];
          }
          return shapeEntry.Pave.default;
        }

        if (weightKey && shapeEntry[weightKey]) {
          return shapeEntry[weightKey];
        }

        return shapeEntry.default;
      }
    }

    return selectedProng?.path || selectedProng?.defaultPath;
  };

  const handleNextClick = () => navigate("/diamond");

  const prongIncludesBand = getProngModelPath().toLowerCase().includes("with_band");
  const { themeClass } = useTheme();


  const [isMobileView, setIsMobileView] = useState(false);

useEffect(() => {
  const checkScreen = () => {
    setIsMobileView(window.innerWidth < 1024); // lg breakpoint
  };

  checkScreen();
  window.addEventListener("resize", checkScreen);

  return () => window.removeEventListener("resize", checkScreen);
}, []);

  return (

    <div
      ref={containerRef}
      // className={`w-full h-[600px] transition-all duration-700 ease-in-out ${themeClass} relative `}
      // className={`w-full h-[600px] transition-all duration-700 ease-in-out  relative ` }
      className={`w-full h-full transition-all duration-700 ease-in-out ${themeClass} relative`}
      style={{
  width: isFullscreen ? '100vw' : '100%',
  height: isFullscreen
    ? '100vh'
    : isMobileView
      ? '100%'   // mobile
      : '80vh',  // desktop
  position: isFullscreen ? 'fixed' : 'relative',
  top: isFullscreen ? 0 : 'auto',
  left: isFullscreen ? 0 : 'auto',
  zIndex: isFullscreen ? 9999 : 'auto',
}}
    >
      <Canvas
        onCreated={({ gl }) => {
          gl.physicallyCorrectLights = true;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        shadows
      >
        <Environment files="/assets/hdr/env_metal_updated.hdr" background={false} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={2} castShadow />

        {/* Wrap all models in RotatingRing for auto-rotation */}
        <RotatingRing isRotating={autoRotate}>
          {!prongIncludesBand && selectedShank && (
            <group>
              <BandRModel
                modelPath={selectedShank.path}
                onLoaded={setBandHeight}
                color={bandColor}
                scale={bandScale || 1}
                sharedMetalProps={sharedMetalProps}
              />

              <Pave modelPath={selectedShank.path} />
            </group>
          )}

          <Suspense fallback={null}>
            {selectedProng && (
              <group ref={ringGroupRef}>
                <ProngModel
                  key={getProngModelPath()}
                  modelPath={getProngModelPath()}
                  color={prongColor}
                  scale={adjustedProngScale}
                  position={[0, adjustedProngOffsetY, 0]}
                  sharedMetalProps={{ roughness: 0.2, metalness: 1, reflectivity: 1 }}
                  setProngDiamondName={setProngDiamondName}
                  ringGroupRef={ringGroupRef}
                  diamondWeight={diamondWeight}
                />
              </group>
            )}
          </Suspense>

          <Suspense fallback={null}>
            {!(selectedShank?.name === "Halo" && selectedProng?.name === "Halo") && selectedDiamond && (
              <DiamondModel
                modelPath={selectedDiamond.path}
                scale={diamondScale}
                position={[0, diamondBaseY, 0]}
                shouldRender={!prongDiamondName}
              />
            )}
          </Suspense>
        </RotatingRing>

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate={true}
          minDistance={3}
          maxDistance={6}
          enableDamping={true} //  movement smooth
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Fullscreen Button at Bottom Right */}
      <button
        onClick={toggleFullscreen}
        className="absolute bottom-4 right-4 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? (
          // Exit Fullscreen Icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Enter Fullscreen Icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        )}
      </button>

      {/* <div className="flex justify-between items-center p-4 bg-[#373D73] text-white w-full relative"> */}
      {/* <div className="fixed bottom-0 left-0 w-full flex justify-between items-center p-3 bg-[#373D73] text-white z-50 lg:relative"> */}
      {!isFullscreen && (
  <div className="fixed bottom-0 left-0 w-full flex justify-between items-center p-3 bg-[#373D73] text-white z-50 lg:relative">
        {/* Center text - RING BUILDER */}
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-10 hidden lg:block">
          <p className="text-sm md:text-lg lg:text-2xl font-bold tracking-wider">RING BUILDER</p>
        </div>
        {/* for logo 
  <div className="absolute left-1/2 transform -translate-x-1/2">
  <img src="/path-to-your-logo.png" alt="Ring Builder" className="h-6 md:h-8 lg:h-10" />
</div> */}

        {/* Left side - Price info */}
        <div className="flex flex-col">
          <p className="text-sm md:text-lg lg:text-xl font-bold">Engagement Ring: $1,005.00</p>
          <p className="text-sm md:text-lg lg:text-xl font-bold">Band: $595.00</p>
          <p className="text-sm md:text-lg lg:text-2xl font-bold">TOTAL: $1,600.00</p>
        </div>

        {/* Right side - Next button */}
        <button
          className="bg-white text-black px-3 py-2 lg:px-6 lg:py-3 w-32 rounded shadow hover:bg-transparent hover:border hover:text-white transition-all ease-in duration-1"
          onClick={handleNextClick}
        >
          Next
        </button>
      </div>
      )}
    </div>
  );
};

export default RingModel;