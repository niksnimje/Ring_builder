// RingModel.jsx - Complete working version with canvas cursor grabbing behavior
import React, { useState, useEffect, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import BandRModel from "../Band/BandRModel";
import ProngModel from "../Prong/ProngModel";
import DiamondModel from "../Diamond/DiamondModel";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../Context/ThemeContext";
import Pave from "../Band/Pave";
import { Settings, RefreshCcw, RotateCw, Maximize, Minimize, X } from "lucide-react";

const RotatingRing = ({ children, isRotating = true }) => {
  const groupRef = useRef();

  useFrame(() => {
    if (isRotating && groupRef.current) {
      groupRef.current.rotation.y += 0.005;
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
  prongOffsetZ,
  diamondBaseY,
  sharedMetalProps,
  setBandHeight,
  diamondWeight
}) => {
  const [prongDiamondName, setProngDiamondName] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const containerRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const controlsRef = useRef();
  const navigate = useNavigate();
  const ringGroupRef = useRef();
  const { themeClass } = useTheme();
  const [isMobileView, setIsMobileView] = useState(false);
  const [gemColor, setGemColor] = useState([1.8, 1.8, 1.8]); // Default White/Diamond
  const [showGems, setShowGems] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // gem colors
  const gems = [
    { name: "Diamond", color: [1.5, 1.5, 1.5], bg: "/assets/GemBtn-BG/white.png", isImage: true },
    { name: "Ruby", color: "#e1405c", bg: "/assets/GemBtn-BG/rubby.png", isImage: true },
    { name: "Sapphire Blue", color: "#89b0cb",  bg: "/assets/GemBtn-BG/sapphire.png", isImage: true  },
    { name: "Green Emerald", color: "#22dfa3",  bg: "/assets/GemBtn-BG/gem-emerald.png"  },
    { name: "Orange Stone", color: "#ffa500", bg: "/assets/GemBtn-BG/orenge.png" },
    { name: "Green Stone", color: "#90ee90", bg: "/assets/GemBtn-BG/Green-Stone.png" },
    { name: "Yellow Stone", color: "#ffeb3b", bg: "/assets/GemBtn-BG/Yellow-Stone.png" },
    { name: "Pink Stone", color: "#ffb6c1", bg: "/assets/GemBtn-BG/Pink-Stone.png" },
    { name: "Vivid Blue", color: "#4169e1", bg: "/assets/GemBtn-BG/Blue-Stone.png" }
  ];

  // Canvas cursor grabbing behavior
  useEffect(() => {
    const canvasElement = canvasContainerRef.current?.querySelector('canvas');
    if (!canvasElement) return;

    const handleMouseEnter = () => {
      if (!isDragging) {
        canvasElement.style.cursor = 'grab';
      }
    };

    const handleMouseLeave = () => {
      if (!isDragging) {
        canvasElement.style.cursor = 'default';
      }
    };

    const handleMouseDown = () => {
      setIsDragging(true);
      canvasElement.style.cursor = 'grabbing';
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      canvasElement.style.cursor = 'grab';
    };

    // Add event listeners
    canvasElement.addEventListener('mouseenter', handleMouseEnter);
    canvasElement.addEventListener('mouseleave', handleMouseLeave);
    canvasElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvasElement.removeEventListener('mouseenter', handleMouseEnter);
      canvasElement.removeEventListener('mouseleave', handleMouseLeave);
      canvasElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Screen size check
  useEffect(() => {
    const checkScreen = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Fullscreen functions
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Reset View Logic
  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  // Key press listener for 'F' key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === "f") {
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fullscreen change listener
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
  const prongIncludesBand = getProngModelPath()?.toLowerCase().includes("with_band");

  return (
    <div
      ref={containerRef}
      className={`w-full h-full transition-all duration-700 ease-in-out ${themeClass} relative`}
      style={{
        width: isFullscreen ? '100vw' : '100%',
        height: isFullscreen
          ? '100vh'
          : isMobileView
            ? '100%'
            : '80vh',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 9999 : 'auto',
      }}
    >
      <div 
        ref={canvasContainerRef} 
        className="w-full h-full"
        style={{ cursor: 'default' }}
      >
        <Canvas
          camera={{ position: [0, 0, 22], fov: 15 }}
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

          <RotatingRing isRotating={autoRotate}>
            {!prongIncludesBand && selectedShank && (
              <group>
                <BandRModel
                  modelPath={selectedShank.path}
                  onLoaded={setBandHeight}
                  color={bandColor}
                  scale={bandScale || 1}
                  sharedMetalProps={sharedMetalProps}
                  selectedProngName={selectedProng?.name}
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
                    scale={prongScale}
                    position={[0, prongOffsetY, prongOffsetZ || 0]}
                    sharedMetalProps={{ roughness: 0.2, metalness: 1, reflectivity: 1 }}
                    setProngDiamondName={setProngDiamondName}
                    ringGroupRef={ringGroupRef}
                    diamondWeight={diamondWeight}
                    gemColor={gemColor}
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
            ref={controlsRef}
            enableZoom={true}
            enablePan={false}
            autoRotate={autoRotate}
            autoRotateSpeed={1.5}
            minDistance={8}
            maxDistance={20}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Canvas>
      </div>

      {/* Settings Menu Container */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end gap-3">

        <div className="flex items-end gap-3">
          <div className={`flex gap-3 transition-all duration-500 transform ${showSettings ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none"}`}>
            {gems.map((gem) => (
              <div key={gem.name} className="relative group flex flex-col items-center">
                <button
                  onClick={() => setGemColor(gem.color)}
                  className="hover:scale-110 transition-transform duration-300"
                >
                  <div
                    className="w-10 h-10 rounded-full shadow-md border border-gray-200"
                    style={{ 
                      background: `url(${gem.bg})` ,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                </button>

                <div className="absolute bottom-full mb-2 px-2 py-1 text-xs text-white bg-black rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap pointer-events-none">
                  {gem.name}
                </div>
              </div>
            ))}
          </div>

          {/* Main Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 z-30 ${showSettings ? "bg-red-500 text-white rotate-90" : "bg-black text-white"}`}
          >
            {showSettings ? <X size={18} /> : <Settings size={18} />}
          </button>
        </div>

        {/* --- Existing: Bottom to Top Buttons --- */}
        <div className={`absolute bottom-full right-0 mb-3 flex flex-col gap-3 transition-all duration-500 transform ${showSettings ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}>

          {/* Reset View Button */}
          <div className="relative group">
            <button
              onClick={resetView}
              className="p-3 bg-white/80 hover:bg-white backdrop-blur-md rounded-full shadow-lg transition-transform hover:scale-110"
            >
              <RefreshCcw size={20} />
            </button>

            <div className="
    absolute right-full mr-3 top-1/2 -translate-y-1/2
    px-2 py-1 text-xs text-white bg-black rounded-full
    opacity-0 group-hover:opacity-100
    translate-x-2 group-hover:translate-x-0
    transition-all duration-300
    whitespace-nowrap pointer-events-none
  ">
              Reset View
            </div>
          </div>

          {/* Auto Rotate Toggle */}
          <div className="relative group">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-3 backdrop-blur-md rounded-full shadow-lg transition-all hover:scale-110 ${autoRotate ? "bg-blue-500 text-white" : "bg-white/80 text-black"
                }`}
            >
              <RotateCw size={20} />
            </button>

            <div className="
    absolute right-full mr-3 top-1/2 -translate-y-1/2
    px-2 py-1 text-xs text-white bg-black rounded-full
    opacity-0 group-hover:opacity-100
    translate-x-2 group-hover:translate-x-0
    transition-all duration-300
    whitespace-nowrap pointer-events-none
  ">
              Auto Rotate
            </div>
          </div>

          {/* Fullscreen Button */}
          <div className="relative group">
            <button
              onClick={toggleFullscreen}
              className="p-3 bg-white/80 hover:bg-white backdrop-blur-md rounded-full shadow-lg transition-transform hover:scale-110"
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>

            <div className="
    absolute right-full mr-3 top-1/2 -translate-y-1/2
    px-2 py-1 text-xs text-white bg-black rounded-full
    opacity-0 group-hover:opacity-100
    translate-x-2 group-hover:translate-x-0
    transition-all duration-300
    whitespace-nowrap pointer-events-none
  ">
              {isFullscreen ? "Exit Full Screen" : "Full Screen"}
            </div>
          </div>
        </div>
      </div>

      {/* Price Section - Fixed from First Code */}
      {!isFullscreen && (
        <div className="fixed bottom-0 left-0 w-full flex justify-between items-center p-3 bg-[#373D73] text-white z-50 lg:relative">

          {/* Left side - Complete Price Info */}
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

      {/* Tooltip for fullscreen button when not in settings menu */}
      {!showSettings && (
        <div className="absolute bottom-24 right-6 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
          {isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
        </div>
      )}
    </div>
  );
};

export default RingModel;