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
import { calculatePrice } from "../../utils/calculatePrice";
import Loader from "../../Common/Loader";
import NumberFlow, { continuous } from '@number-flow/react'


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
  diamondWeight,
  onGemColorChange
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
  const [gemColor, setGemColor] = useState([1.5, 1.5, 1.5]); // Default White/Diamond
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const userAutoRotatePref = useRef(true);

  const initialCameraPos = useRef(new THREE.Vector3());
  const initialTarget = useRef(new THREE.Vector3());

  // gem colors
  const gems = [
    { name: "Diamond", color: [1.5, 1.5, 1.5], bg: "/assets/GemBtn-BG/white.png" }, // [1.5, 1.5, 1.5]
    { name: "Ruby", color: "#e1405c", bg: "/assets/GemBtn-BG/rubby.png" }, // [1.8, 0.2, 0.4]
    { name: "Sapphire Blue", color: "#89b0cb", bg: "/assets/GemBtn-BG/sapphire.png" }, // [0.2, 0.4, 1.8]
    { name: "Green Emerald", color: "#22dfa3", bg: "/assets/GemBtn-BG/gem-emerald.png" }, // [0.2, 1.8, 0.4]
    { name: "Orange Stone", color: "#ffa500", bg: "/assets/GemBtn-BG/orenge.png" }, // [1.8, 0.9, 0.2]
    { name: "Green Stone", color: "#90ee90", bg: "/assets/GemBtn-BG/Green-Stone.png" }, // [0.2, 1.8, 0.9]
    { name: "Yellow Stone", color: "#ffeb3b", bg: "/assets/GemBtn-BG/Yellow-Stone.png" }, // [1.8, 1.8, 0.2]
    { name: "Pink Stone", color: "#ffb6c1", bg: "/assets/GemBtn-BG/Pink-Stone.png" },// [1.8, 0.2, 1.8]
    { name: "Vivid Blue", color: "#4169e1", bg: "/assets/GemBtn-BG/Blue-Stone.png" }// [0.2, 0.9, 1.8]
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
    // const prongName = selectedProng?.name;
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

  const handleNextClick = () => navigate("/");
  const prongIncludesBand = getProngModelPath()?.toLowerCase().includes("with_band");


  // prong auto focus logic

  useEffect(() => {
    if (controlsRef.current) {
      initialTarget.current.copy(controlsRef.current.target);
    }
  }, []);

  const focusOnProng = (targetPosition) => {
    if (!controlsRef.current) return;

    const controls = controlsRef.current;
    const camera = controls.object;

    // 🔁 RESET VIEW (Zoom Out)
    if (isFocused) {
      let progress = 0;
      const startPos = camera.position.clone();
      const startTarget = controls.target.clone();

      const animate = () => {
        progress += 0.03;
        const t = progress * progress * (3 - 2 * progress);
        camera.position.lerpVectors(startPos, initialCameraPos.current, t);
        controls.target.lerpVectors(startTarget, initialTarget.current, t);
        controls.update();

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
      setIsFocused(false);

      // Zoom out check - restore auto-rotate if user had it on before
      if (userAutoRotatePref.current) {
        setAutoRotate(true);
      }
      return;
    }

    // 👉 ZOOM IN

    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();

    const direction = new THREE.Vector3()
      .subVectors(camera.position, controls.target)
      .normalize();

    const offset = direction.multiplyScalar(5);
    const endPos = targetPosition.clone().add(offset);
    const endTarget = targetPosition.clone();

    let progress = 0;

    const animate = () => {
      progress += 0.03;
      const t = progress * progress * (3 - 2 * progress);
      camera.position.lerpVectors(startPos, endPos, t);
      controls.target.lerpVectors(startTarget, endTarget, t);
      controls.update();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
    setIsFocused(true);

    //  Zoom in check 
    if (userAutoRotatePref.current) {
      setAutoRotate(true);
    } else {
      setAutoRotate(false);
    }
  };




  // calculate price
  const priceData = calculatePrice({
    selectedShank,
    selectedProng,
    selectedDiamond,
    diamondWeight,
    selectedMetalColor: bandColor,
  });


  return (

    <>
    
      <div
      ref={containerRef}
      className={`w-full h-full transition-all duration-700 ease-in-out  ${themeClass} ${!isFullscreen ? "rounded-[32px] border border-[#e7e1d8] shadow-xl " : ""} relative`}
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
          // onCreated={({ gl }) => {
          //   gl.physicallyCorrectLights = true;
          //   gl.toneMapping = THREE.ACESFilmicToneMapping;
          //   gl.outputColorSpace = THREE.SRGBColorSpace;
          // }}
          onCreated={({ camera }) => {
            initialCameraPos.current.copy(camera.position);
          }}
        // shadows
        >
          <Environment files="/assets/hdr/env_metal_updated.hdr" background={false} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={2} castShadow />

          <RotatingRing isRotating={autoRotate} >
            {!prongIncludesBand && selectedShank && (
              <Suspense fallback={<Loader />}>
                <group>
                  <BandRModel
                    modelPath={selectedShank.path}
                    onLoaded={setBandHeight}
                    color={bandColor}
                    scale={bandScale || 1}
                    sharedMetalProps={sharedMetalProps}
                    selectedProngName={selectedProng?.name}
                    diamondWeight={diamondWeight}
                  />
                  <Pave
                    modelPath={selectedShank.path}
                    gemColor={gemColor}
                    diamondWeight={diamondWeight}
                  />
                </group>
              </Suspense>
            )}

            <Suspense fallback={<Loader />}>
              {selectedProng && (
                <group ref={ringGroupRef}>
                  <ProngModel
                    key={getProngModelPath()}
                    modelPath={getProngModelPath()}
                    fadeTrigger={`${getProngModelPath()}_${selectedDiamond?.name}`}
                    color={prongColor}
                    scale={prongScale}
                    position={[0, prongOffsetY, prongOffsetZ || 0]}
                    sharedMetalProps={{ roughness: 0.2, metalness: 1, reflectivity: 1 }}
                    setProngDiamondName={setProngDiamondName}
                    ringGroupRef={ringGroupRef}
                    diamondWeight={diamondWeight}
                    gemColor={gemColor}
                    onProngClick={focusOnProng}
                  />
                </group>
              )}
            </Suspense>
            

            <Suspense fallback={<Loader />}>
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
            minDistance={5} // zoom in minimum value is give close look at diamond
            maxDistance={25} // zoom out maximum value is give full look at ring
            enableDamping={true}
            dampingFactor={0.05}
          // target={[0, 0.5, 0]} 
          />
        </Canvas>
      </div>

      {/* Settings Menu Container */}
      <div className="absolute bottom-6 right-2 md:right-6 lg:right-6 z-20 flex flex-col items-end gap-3">
        {/* color gem row */}
        <div className="flex items-end gap-2 lg:gap-3">
          <div className={`flex gap-2 lg:gap-3 transition-all duration-500 transform ${showSettings ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none"}`}>
            {gems.map((gem) => (
              <div key={gem.name} className="relative group flex flex-col items-center">
                <button
                  onClick={() => {
                    setGemColor(gem.color);
                    onGemColorChange(gem.color);
                  }}
                  className="hover:scale-110 transition-transform duration-300"
                >
                  <div
                    className="w-7 h-7 lg:w-10 lg:h-10  rounded-full shadow-md border border-gray-200"
                    style={{
                      background: `url(${gem.bg})`,
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
            className={`p-2 sm:p-3 lg:p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 z-30 ${showSettings ? "bg-red-500 text-white rotate-90" : "bg-black text-white"}`}
          >
            {showSettings ? <X size={18} /> : <Settings size={18} />}
          </button>
        </div>

        {/* --- Existing: Bottom to Top Buttons --- */}
        <div className={`absolute bottom-full right-0 mb-2 lg:mb-3 flex flex-col gap-2 lg:gap-3 transition-all duration-500 transform ${showSettings ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}>

          {/* Reset View Button */}
          <div className="relative group">
            <button
              onClick={resetView}
              className="p-2 sm:p-2.5 lg:p-3 bg-white/80 hover:bg-white backdrop-blur-md rounded-full shadow-lg transition-transform hover:scale-110"
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
              onClick={() => {
                const newState = !autoRotate;
                setAutoRotate(newState);
                userAutoRotatePref.current = newState;
              }}
              className={`p-2 sm:p-2.5 lg:p-3 backdrop-blur-md rounded-full shadow-lg transition-all hover:scale-110 ${autoRotate ? "bg-blue-500 text-white" : "bg-white/80 text-black"
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
              className="p-2 sm:p-2.5 lg:p-3 bg-white/80 hover:bg-white backdrop-blur-md rounded-full shadow-lg transition-transform hover:scale-110"
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
  {/* Price Section - Full Mobile Responsive and Fluid Layout */}
{!isFullscreen && (
  <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200/60 p-3 px-4 md:p-4 md:px-6 z-50 flex flex-col md:flex-row justify-evenly items-stretch md:items-center gap-3 md:gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.04)] lg:relative rounded-b-3xl">

    {/* Left side - Price Breakdown */}
    <div className="flex items-center gap-3 md:gap-6 w-full md:w-auto overflow-hidden">
      
      {/* Price Breakdown Title Header (Hidden on extra small mobile to save space) */}
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <div className="text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calculator">
            <rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-gray-800 tracking-wide ">Price Breakdown</span>
          <div className="w-8 h-[1px] bg-gray-300 mt-0.5" />
        </div>
      </div>

      {/* Items List - Horizontal Scrollable on Mobile, Normal on Desktop */}
      <div className="flex items-center gap-3 overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-none w-full py-1 pr-2 text-xs md:text-sm">
        
        {/* Diamond */}
        <div className="inline-block min-w-[65px] text-center md:text-left shrink-0">
          <p className="text-gray-400 text-[10px] md:text-base font-medium mb-0.5">Diamond</p>
          <p className="text-gray-800 font-bold">
            <span className="text-gray-600 font-semibold mr-0.5">₹</span>
            <NumberFlow className="text-[10px] md:text-base" plugins={[continuous]} value={priceData.diamondPrice || 0} />
          </p>
        </div>
        
        <span className="text-gray-300 font-light text-xs shrink-0">+</span>

        {/* Band */}
        <div className="inline-block min-w-[60px] text-center md:text-left shrink-0">
          <p className="text-gray-400 text-[10px] md:text-base font-medium mb-0.5">Band</p>
          <p className="text-gray-800 font-bold">
            <span className="text-gray-600 font-semibold mr-0.5">₹</span>
            <NumberFlow className="text-[10px] md:text-base" plugins={[continuous]} value={priceData.shankPrice || 0} />
          </p>
        </div>

        <span className="text-gray-300 font-light text-xs shrink-0">+</span>

        {/* Setting */}
        <div className="inline-block min-w-[60px] text-center md:text-left shrink-0">
          <p className="text-gray-400 text-[10px] md:text-base font-medium mb-0.5">Setting</p>
          <p className="text-gray-800 font-bold">
            <span className="text-gray-600 font-semibold mr-0.5">₹</span>
            <NumberFlow className="text-[10px] md:text-base" plugins={[continuous]} value={priceData.prongPrice || 0} />
          </p>
        </div>

        <span className="text-gray-300 font-light text-xs shrink-0">+</span>

        {/* Color */}
        <div className="inline-block min-w-[60px] text-center md:text-left shrink-0">
          <p className="text-gray-400 text-[10px] md:text-base font-medium mb-0.5">Color</p>
          <p className="text-gray-800 font-bold">
            <span className="text-gray-600 font-semibold mr-0.5">₹</span>
            <NumberFlow className="text-[10px] md:text-base" plugins={[continuous]} value={priceData.metalColorPrice || 0} />
          </p>
        </div>

      </div>
    </div>

    {/* Vertical Divider (Desktop Only) */}
    <div className="hidden md:block w-[1px] h-10 bg-gray-200" />

    {/* Right side - Total Price Info & Next Button aligned perfectly */}
    <div className="flex flex-row items-center justify-between md:justify-end gap-4 md:gap-6 w-full md:w-auto border-t border-gray-100 pt-2 md:pt-0 md:border-none shrink-0">
      
      {/* Total Section */}
      <div className="flex flex-col justify-center m-auto">
        <span className="text-[10px] md:text-xs font-medium text-gray-400 tracking-wide uppercase">Total Price</span>
        <p className="text-lg md:text-2xl font-bold text-primaryGold tracking-tight mt-0.5 flex items-center">
          <span className="text-primaryGold mr-1 text-base md:text-xl font-semibold">₹</span>
          <NumberFlow plugins={[continuous]} value={priceData.totalPrice || 0} />
        </p>
      </div>

    
    </div>
      {/* Premium Next Step Button */}
      <button
        onClick={handleNextClick}
        className="
          flex items-center justify-center gap-1.5 md:gap-2
          bg-gradient-to-r from-[#fbf4ec] to-[#f3e5d3] 
          text-[#6b512e] font-bold text-xs md:text-base
          px-4 py-2.5 md:px-8 md:py-3.5 rounded-xl md:rounded-2xl border border-[#c59d5f]/40
          shadow-[0_4px_15px_rgba(197,157,95,0.1)]
          hover:scale-[1.02] active:scale-[0.98]
          transition-all duration-300 min-w-[110px] md:min-w-[160px]
        "
      >
        <span>Next Step</span>
        <svg 
          className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
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
    </>
    
  );
};

export default RingModel;