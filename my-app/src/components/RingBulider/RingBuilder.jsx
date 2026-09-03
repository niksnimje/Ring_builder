import React, { useState, useEffect } from "react";
import { Leva } from "leva";
import RingModel from "../../model/mainModel/RingModel";
import {
  diamondOptions,
  diamondWeightOptions,
  prongOptions,
  shankOptions,
} from "../datapath/DataPath";
import { useTheme } from "../../Context/ThemeContext";
import { Link, useLocation } from "react-router-dom";
import { inputChecker } from "../../utils/inputChecker";
// import { RingWizard } from "./RingWizard";

import {
  Gem,
  CircleDot,
  Diamond,
  Palette,
  SquaresExclude,
} from "lucide-react";
// import { GiDiamondRing  } from "react-icons/ri";
import { GiDiamondRing } from "react-icons/gi";


// Define shankProngMap
const shankProngMap = {
  Pave: ["Classic Hidden Halo", "Pave Hidden Halo"],
  'Solitaire Bezel': ["Solitaire Bezel", ""],
  Solitaire: ["Classic Prong", "Solitaire Bezel", "Classic Hidden Halo", "Pave Hidden Halo", "Double Prong", "Six Prong", "Bezel", "Half Bezel", "3 Stones", "3 Stones Halo", "5 Stones", "Hidden Halo", "Semi Hidden Halo", "Shank", "7 Stones", "Special", "Solitaire", "Solitaire Diamond Shank", "Split Shank", "Halo", "Toi et Moi"]
};

// Determine Default Values
const defaultShank = shankOptions.length > 0 ? shankOptions[0] : null;
const allowedProngNamesForDefaultShank = defaultShank && shankProngMap[defaultShank.name]
  ? shankProngMap[defaultShank.name]
  : prongOptions.map(p => p.name);
const defaultProng = prongOptions.find(p =>
  allowedProngNamesForDefaultShank.includes(p.name)
) || null;
const defaultDiamond = diamondOptions.length > 0 ? diamondOptions[0] : null;
const defaultDiamondWeight = diamondWeightOptions.find(opt => opt.weight === '1.0 ct')?.value || (diamondWeightOptions.length > 0 ? diamondWeightOptions[0].value : 0);
const defaultBandColor = "#E6BE5A";
const defaultProngColor = "#E6BE5A";

// Metal Color Button Component
const MetalColorButton = ({ color, label, isSelected, onClick }) => {
  const getTextColor = (bgColor) => {
    const darkColors = ["#c0c0c0", "#a4a4a4", "#B0C4DE", "#E6C27A", "#E0E0E0", "#B8B4B9"];
    return darkColors.includes(bgColor) ? "#333" : "#fff";
  };

  return (
    <button
      onClick={onClick}
      className={`w-full relative py-2.5 sm:py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-sm ${isSelected
        ? 'ring ring-green-500 shadow-lg scale-105'
        : 'hover:scale-105 hover:shadow-md'
        }`}
      style={{
        backgroundColor: color,
        color: getTextColor(color)
      }}
    >
      {label}
      {isSelected && (
        <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-600 rounded-full animate-pulse"></span>
      )}
    </button>
  );
};

// Responsive Tab Component
const ResponsiveTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200 px-3 sm:px-6 pt-3 sm:pt-4 sticky top-0 z-10 bg-[#1e293b]">
      <div className="flex justify-between sm:justify-start gap-2 sm:gap-6">
        <button
          onClick={() => setActiveTab("metal")}
          className={`flex-1 sm:flex-none pb-2 text-sm sm:text-lg font-medium transition-colors ${activeTab === "metal"
            ? "text-white border-b-2 border-white"
            : "text-gray-400"
            }`}
        >
          Metal 
        </button>

        <button
          onClick={() => setActiveTab("type")}
          className={`flex-1 sm:flex-none pb-2 text-sm sm:text-lg font-medium transition-colors ${activeTab === "type"
            ? "text-white border-b-2 border-white"
            : "text-gray-400"
            }`}
        >
          Type
        </button>

        <button
          onClick={() => setActiveTab("diamonds")}
          className={`flex-1 sm:flex-none pb-2 text-sm sm:text-lg font-medium transition-colors ${activeTab === "diamonds"
            ? "text-white border-b-2 border-white"
            : "text-gray-400"
            }`}
        >
          Diamonds
        </button>

        <button
          onClick={() => setActiveTab("theme")}
          className={`flex-1 sm:flex-none pb-2 text-sm sm:text-lg font-medium transition-colors ${activeTab === "theme"
            ? "text-white border-b-2 border-white"
            : "text-gray-400"
            }`}
        >
          Theme
        </button>
      </div>
    </div>
  );
};

export default function RingBuilder() {
  // States
  const [selectedShank, setSelectedShank] = useState(defaultShank);
  const [selectedProng, setSelectedProng] = useState(defaultProng);
  const [selectedDiamond, setSelectedDiamond] = useState(defaultDiamond);
  const [selectedDiamondWeight, setSelectedDiamondWeight] = useState(defaultDiamondWeight);
  const [bandHeight, setBandHeight] = useState(0.3);
  const [bandColor, setBandColor] = useState(defaultBandColor);
  const [prongColor, setProngColor] = useState(defaultProngColor);
  const [activeTab, setActiveTab] = useState("metal");
  const [showWizard, setShowWizard] = useState(true);
  const location = useLocation();
  const [isMixMode, setIsMixMode] = useState(false);
  const [gemColor, setGemColor] = useState([1.5, 1.5, 1.5]);
  const [showControls, setShowControls] = useState(true);

  const handleGemColorChange = (color) => {
    setGemColor(color);
  };

  const [showMixPanel, setShowMixPanel] = useState(false);

  const resolveStyleConfig = (style) => {
    const styleMap = {
      Solitaire: { shankName: "Solitaire", prongName: "Classic Prong" },
      "Pave": { shankName: "Pave", prongName: "Classic" },
      "Pave 2": { shankName: "Pave 2", prongName: "Classic" },
      "Unique 1": { shankName: "Unique 1", prongName: "Classic" },
      "Unique 2": { shankName: "Unique 2", prongName: "Classic" },
      "Unique 3": { shankName: "Unique 3", prongName: "Classic" },
      "Unique 4": { shankName: "Unique 4", prongName: "Classic" },
      "Unique 5": { shankName: "Unique 5", prongName: "Classic" },
      "Unique 6": { shankName: "Unique 6", prongName: "Classic" },
      "Start from scratch": { shankName: "Solitaire", prongName: "Classic Prong" },
    };

    return styleMap[style] || { shankName: "Solitaire", prongName: "Classic Prong" };
  };

  const handleWizardComplete = (config) => {
    setShowWizard(false);

    if (config.metal) {
      setBandColor(config.metal);
      setProngColor(config.metal);
    }

    if (config.shape) {
      const foundDiamond = diamondOptions.find((d) => d.name === config.shape);
      if (foundDiamond) {
        setSelectedDiamond(foundDiamond);
      }
    }

    if (config.weight) {
      setSelectedDiamondWeight(config.weight);
    }

    if (config.style) {
      const { shankName, prongName } = resolveStyleConfig(config.style);
      const foundShank = shankOptions.find((s) => s.name === shankName) || defaultShank;
      const foundProng = prongOptions.find((p) => p.name === prongName) || defaultProng;
      setSelectedShank(foundShank);
      setSelectedProng(foundProng);
    }
  };

  // temp state (important)
  const [tempBandColor, setTempBandColor] = useState(bandColor);
  const [tempProngColor, setTempProngColor] = useState(prongColor);

  const applyMixColors = () => {
    setBandColor(tempBandColor);
    setProngColor(tempProngColor);
    setShowMixPanel(false);
  };

  const handleColorChange = (color) => {
    if (isMixMode) {
      // mix mode 
      return;
    }

    // default mode - single click sets both colors
    setBandColor(color);
    setProngColor(color);
  };


  useEffect(() => {
    const text = location.state?.description;
    if (!text) return;

    const config = inputChecker(text);

    console.log("CONFIG:", config);

    // 🎨 COLOR
    if (config.bandColor) {
      setBandColor(config.bandColor);
      setProngColor(config.prongColor);
    }

    // 💎 SHAPE
    if (config.shape) {
      const foundDiamond = diamondOptions.find(
        (d) => d.name === config.shape
      );
      if (foundDiamond) {
        setSelectedDiamond(foundDiamond);
      }
    }

    // ⚙️ STYLE
    if (config.style) {
      const foundShank = shankOptions.find(
        (s) => s.name === config.style
      );
      if (foundShank) {
        setSelectedShank(foundShank);
      }
    }

    //  WEIGHT
    if (config.weight) {
      const matchedWeight = diamondWeightOptions.find(
        (opt) => opt.value === config.weight
      );
      if (matchedWeight) {
        setSelectedDiamondWeight(matchedWeight.value);
      }
    }

  }, [location.state]);


  // Load More state - simple show/hide all
  const [showAllDiamonds, setShowAllDiamonds] = useState(false);
  // Toggle handler - Load More / Show Less
  const handleToggleDiamonds = () => {
    setShowAllDiamonds(!showAllDiamonds);
  };

  // Get visible diamonds based on toggle state

  // Accordion states
  const [openAccordions, setOpenAccordions] = useState({
    headBandColor: true,
    selectStones: true,
    centerStones: false,
    headBandType: true
  });

  const toggleAccordion = (key) => {
    setOpenAccordions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Load more handler - show ALL diamonds in one click
  const handleLoadMore = () => {
    setShowAllDiamonds(true);
  };

  // Get visible diamonds based on load more state
  const visibleDiamonds = showAllDiamonds ? diamondOptions : diamondOptions.slice(0, 10);
  const hasMoreDiamonds = diamondOptions.length > 10 && !showAllDiamonds;

  const bandScale = 1;
  const prongHeight = 0.5;
  const diamondScale = 0.08;


  // prong wight to scale

  //   const prongScaleByWeight = [
  //   { weight: 1.0, scale: 0.23 },
  //   { weight: 2.0, scale: 0.25 },
  //   { weight: 3.0, scale: 0.28 },
  //   { weight: 4.0, scale: 0.29 },
  //   { weight: 5.0, scale: 0.3 },
  // ];

  // const offsetYByWeight = [
  //   { weight: 1.0, offsetY: 1.82 },
  //   { weight: 2.0, offsetY: 1.8 },
  //   { weight: 3.0, offsetY: 1.76 },
  //   { weight: 4.0, offsetY: 1.77 },
  //   { weight: 5.0, offsetY: 1.77 },
  // ];

  // __________________________________

  const prongScaleByWeight = [
    { weight: 1.0, scale: 0.23 },
    { weight: 2.0, scale: 0.29 },
    { weight: 3.0, scale: 0.33 },
    { weight: 4.0, scale: 0.36 },
    { weight: 5.0, scale: 0.39 },
  ];

  //   const prongScaleByWeight = [
  //   { weight: 1.0, scale: 0.25 },
  //   { weight: 2.0, scale: 0.32 },
  //   { weight: 3.0, scale: 0.36 },
  //   { weight: 4.0, scale: 0.39 },
  //   { weight: 5.0, scale: 0.43 },
  // ];

  // Weight-based offsetY mapping (smaller for larger weights)

  const offsetYByWeight = [
    { weight: 1.0, offsetY: 1.82 },
    { weight: 2.0, offsetY: 1.8 },
    { weight: 3.0, offsetY: 1.76 },
    { weight: 4.0, offsetY: 1.75 },
    { weight: 5.0, offsetY: 1.73 },
  ];



  const prongScale = prongScaleByWeight.find((entry) => entry.weight === selectedDiamondWeight)?.scale || 0.3;

  const sharedMetalProps = {
    metalness: 1,
    roughness: 0.1,
    reflectivity: 0.8,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
  };



  const diamondShape = selectedDiamond?.name;

  const shapeData = selectedProng?.shapeMap?.[diamondShape];

  // const currentYDivisor = shapeData?.offsetY || 1.72;
  // const adjustedProngOffsetZ = shapeData?.offsetZ || 0;
  // const adjustedProngOffsetY = bandHeight / currentYDivisor; 
  const currentShapeData = selectedProng?.shapeMap?.[selectedDiamond?.name];

  const isUniqueShank = selectedShank?.name === "Unique 1" || selectedShank?.name === "Unique 3";

  // Get weight-based offsetY, fallback to shape data or default
  const shapeSpecificOffset = currentShapeData?.weightOffsets?.[selectedDiamondWeight];
  const weightBasedOffsetY = offsetYByWeight.find((entry) => entry.weight === selectedDiamondWeight)?.offsetY;
  let currentYDivisor = shapeSpecificOffset || weightBasedOffsetY || currentShapeData?.offsetY || selectedProng?.offsetY || 1.75;

  if (selectedShank?.name === "Unique 1") {
    currentYDivisor = 1.85;
  } else if (selectedShank?.name === "Unique 3") {
    currentYDivisor = 1.95;
  }
  else if (selectedShank?.name === "Unique 12") {
    currentYDivisor = 1.85;
  }
  else if (selectedShank?.name === "Unique 14") {
    currentYDivisor = 1.87;
  }

  const adjustedProngOffsetY = bandHeight / currentYDivisor;
  const adjustedProngOffsetZ = currentShapeData?.offsetZ || selectedProng?.offsetZ || 0;


  const diamondBaseY = bandHeight / 2.3 + prongHeight;

  // const changeShank = (shank) => setSelectedShank(shank);
  const changeShank = (shank) => {
    setSelectedShank(shank);

  };

  const changeProng = (prong) => {
    setSelectedProng(prong);

  };

  const changeBandColor = (color) => setBandColor(color);
  const changeProngColor = (color) => setProngColor(color);
  const changeDiamondWeight = (weight) => setSelectedDiamondWeight(weight);


  // const visibleProngs = selectedShank?.name && shankProngMap[selectedShank.name]
  //   ? prongOptions.filter((p) => shankProngMap[selectedShank.name].includes(p.name))
  //   : prongOptions;

  const visibleProngs = prongOptions;

  const finalSelectedProng = (() => {
    if (!selectedProng) return null;
    const diamondShape = selectedDiamond?.name;
    const shapeEntry = selectedProng?.shapeMap?.[diamondShape];
    const resolvedPath = shapeEntry || selectedProng?.defaultPath || selectedProng?.path;

    return {
      ...selectedProng,
      path: resolvedPath,
      offsetY: shapeData?.offsetY,
      offsetZ: shapeData?.offsetZ,
    };
  })();

  // const metalOptions = [
  //   ["#B8B4B9", "14K White Gold"],
  //   ["#E0E0E0", "18K White Gold"],
  //   ["#E6BE5A", "14K Yellow"],
  //   ["#DDB140", "18K Yellow"],
  //   ["#f1a886", "14K RG"],
  //   ["#d99982", "18K RG"],
  //   ["#B0C4DE", "PT"],
  //   // ["#f7c5ad", "14K RG"],
  //   // ["#ffcb7d", "gold"],
  // ];

  // ✅ Best Structure: color + label + imagePath
// color = actual metal color used in your 3D model
// label = UI text
// image = background image path shown in the card

const metalOptions = [
  {
    color: "#B8B4B9",
    label: "14K White Gold",
    image: "/assets/Mattel-bg/silver-14k.png",
  },
  {
    color: "#E0E0E0",
    label: "18K White Gold",
    image: "/assets/Mattel-bg/silver-18k.png",
  },
  {
    color: "#E6BE5A",
    label: "14K Yellow Gold",
    image: "/assets/Mattel-bg/gold-14k.png",
  },
  {
    color: "#DDB140",
    label: "18K Yellow Gold",
    image: "/assets/Mattel-bg/gold-18k.png",
  },
  {
    color: "#f1a886",
    label: "14K Rose Gold",
    image: "/assets/Mattel-bg/rose-14k.png",
  },
  {
    color: "#d99982",
    label: "18K Rose Gold",
    image: "/assets/Mattel-bg/rose-18k.png",
  },
  {
    color: "#B0C4DE",
    label: "Platinum (PT)",
    image: "/assets/Mattel-bg/platinum.png",
  },
  {
    color: "mix",
    label: "Mix Metals",
    image: "/assets/Mattel-bg/mix.png",
  },
];


  const handleTwoTone = (type) => {
    if (type === "14K") {
      // Head (Prong) = White Gold
      setProngColor("#B8B4B9"); // 14K White

      // Band = Yellow Gold
      setBandColor("#E6BE5A"); // 14KY
    }

    if (type === "18K") {
      // Head (Prong) = White Gold
      setProngColor("#E0E0E0"); // 18K White

      // Band = Yellow Gold
      setBandColor("#DDB140"); // 18KY
    }
  };

  const { setThemeClass, themeClass } = useTheme();
  const themes = [
    "bg-gradient-to-tr from-slate-900 via-[#1e293b] to-slate-800",
    "bg-gradient-to-br from-[#064e3b] via-[#022c22] to-[#011c15]",
    "bg-[radial-gradient(circle,_#1e3a8a_0%,_#172554_40%,_#020617_100%)]",
    "bg-gradient-to-r from-[#f1eeee] via-[#ffffff] to-[#ede9e9]",
    "bg-[radial-gradient(circle,_#4b5563_0%,_#1f2937_50%,_#111827_100%)]",
    "bg-gradient-to-tr from-[#042f2e] via-[#064e4b] to-[#022c22]",
    "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900",
    "bg-gradient-to-b from-gray-100 via-gray-200 to-gray-500",
    "bg-white",
    "bg-[radial-gradient(circle_at_50%_40%,#6d28d9_0%,#1e1b4b_50%,#020617_100%)]",
    "bg-[radial-gradient(circle_at_50%_30%,#2a2a2a_0%,#000000_80%)]",
    "bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#0f172a_40%,_#020617_100%)]",
    "bg-[radial-gradient(circle,_#422006_0%,_#1c1917_60%,_#0c0a09_100%)]",
    "bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#111827]",
    "bg-[radial-gradient(circle,_#2d1b69_0%,_#1e1b4b_50%,_#020617_100%)]",
    "bg-gradient-to-br from-[#0a192f] via-[#0d2847] to-[#0a192f]",
    "bg-gradient-to-tr from-[#0a1f0a] via-[#1a3a1a] to-[#0a1f0a]",
    "bg-gradient-to-br from-[#1a0a2e] via-[#2a1a4e] to-[#1a0a2e]",
    "bg-[radial-gradient(circle_at_center,_#2a1a4e_0%,_#0a0515_100%)]",
    "bg-gradient-to-br from-[#2a2218] via-[#3d3224] to-[#1a1510]",
    
    
  ];



  const currentRingConfig = {
    shank: {
      name: selectedShank?.name || null,
    },

    prong: {
      name: selectedProng?.name || null,
      color: prongColor,
      position: {
        offsetY: adjustedProngOffsetY,
        offsetZ: adjustedProngOffsetZ,
      }
    },

    band: {
      color: bandColor,
      height: bandHeight,
    },

    diamond: {
      shape: selectedDiamond?.name || null,
      // weight: {
      //   label: `${selectedDiamondWeight.toFixed(2)} ct`,
      //   value: selectedDiamondWeight,
      // },
      weight: `${selectedDiamondWeight.toFixed(2)} ct`,
      scale: diamondScale,
    },

    gem: {
      color: gemColor
    },


    metal: {
      isTwoTone: bandColor !== prongColor,
    },

    meta: {
      isMixMode,
      theme: themeClass,
    }
  };

  useEffect(() => {
    // console.clear();
    console.log("💍 Ring JSON 👇");
    console.log(JSON.stringify(currentRingConfig, null, 2));
  }, [
    selectedShank,
    selectedProng,
    selectedDiamond,
    selectedDiamondWeight,
    bandColor,
    prongColor,
    bandHeight,
    isMixMode,
    themeClass,
    gemColor // 🔥 ADD THIS
  ]);


  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* {showWizard && <RingWizard onComplete={handleWizardComplete} />} */}
      {/* {showWizard && (
  <RingWizard
    onComplete={handleWizardComplete}
    onSkip={() => setShowWizard(false)}
  />
)} */}
      {/* Header - Responsive */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3 sm:py-4">
        <h1 className="text-xl sm:text-2xl font-bold  text-primaryGold"> <Link to={"/"}>Ring Builder</Link></h1>
      </header>

      {/* Main Content */}
      
      {/* <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-gradient-to-tr from-slate-900 via-[#1e293b] to-slate-800"> */}
        <div className="relative flex-1 flex flex-col lg:flex-row overflow-hidden bg-white">

        {/* Left Panel - Ring Model */}
        {/* <div className="flex w-full lg:w-[70%] xl:w-[75%] 2xl:w-[80%] h-[35vh] sm:h-[40vh] lg:h-full items-center justify-center"> */}
        <div
  className={`
    flex h-[35vh] sm:h-[40vh] lg:h-full items-center justify-center
    transition-all duration-500 ease-in-out
    w-full
    ${
      showControls
        ? "lg:w-[68%] xl:w-[73%] 2xl:w-[78%]"
        : "lg:w-full"
    }
  `}
>
          <div className="w-full h-full">
            <RingModel
              selectedProng={finalSelectedProng}
              selectedShank={selectedShank}
              selectedDiamond={selectedDiamond}
              bandColor={bandColor}
              bandScale={bandScale}
              prongColor={prongColor}
              prongScale={prongScale}
              prongHeight={prongHeight}
              diamondScale={diamondScale}
              prongOffsetY={adjustedProngOffsetY}
              prongOffsetZ={adjustedProngOffsetZ}
              diamondBaseY={diamondBaseY}
              sharedMetalProps={sharedMetalProps}
              setBandHeight={setBandHeight}
              bandHeight={bandHeight}
              onGemColorChange={handleGemColorChange}
              diamondWeight={{
                weight: `${selectedDiamondWeight.toFixed(2)} ct`,
                value: selectedDiamondWeight,
              }}
            />
            {/* <SingleModelDemo /> */}
          </div>
        </div>

        {/* Right Panel - Controls */}
{/* <div className="w-full lg:w-[32%] xl:w-[27%] 2xl:w-[22%] h-[55vh] lg:h-full relative overflow-hidden"> */}
<div
  className={`
    h-[55vh] lg:h-full relative overflow-visible
    transition-all duration-500 ease-in-out
    ${
      showControls
        ? "w-full lg:w-[32%] xl:w-[27%] 2xl:w-[22%]"
        : "w-full lg:w-[72px]"
    }
  `}
>
  {/* Toggle Button - Always Visible */}
  <button
    onClick={() => setShowControls(!showControls)}
    className="
      hidden lg:flex
      absolute top-4 -left-6 z-50
      items-center justify-center
      w-9 h-9 rounded-full
      bg-primaryGold backdrop-blur-xl
      border border-white/20
      text-white
      hover:bg-white/20
      hover:text-primaryGold
      transition-all duration-300
      shadow-2xl
    "
    title={showControls ? "Hide Controls" : "Show Controls"}
  >
    <svg
      className={`w-5 h-5 transition-transform duration-300 ${
        showControls ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19l-7-7 7-7"
      />
    </svg>
  </button>

  {/* ================= EXPANDED PANEL ================= */}
  {showControls ? (
    <div className="relative z-20 flex flex-col h-full backdrop-blur-xl border-l border-white/10">
      {/* Premium Tabs */}
      <div className="sticky top-0 z-20 backdrop-blur-xl border-b border-white/10 px-4 py-4">
        <div className="grid grid-cols-4 gap-2">
          {[
            { key: "metal", label: "Metal", icon: SquaresExclude },
            { key: "type", label: "Type", icon: GiDiamondRing  },
            { key: "diamonds", label: "Diamonds", icon: Gem },
            { key: "theme", label: "Theme", icon: Palette },
          ].map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex flex-col items-center justify-center gap-1
                  py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-300
                  ${
                    activeTab === tab.key
                      ? " text-primaryGold shadow-2xl scale-[1.03]  border border-black/20"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-primaryGold  border border-black/20"
                  }
                `}
              >
                <Icon
                  size={20}
                  strokeWidth={1.8}
                  className="mb-0.5"
                />
                <span className="text-xs font-medium">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
          <hr />
    {/* Scroll Area */}
    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-5 space-y-6 ">

      {/* ================= METAL TAB ================= */}
      {activeTab === "metal" && (
        <div className="space-y-5">

          {!isMixMode ? (
            <>
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-5 shadow-2xl">

                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-primaryGold text-lg font-semibold">
                      Select Metal Color
                    </h2>
                    <p className="text-primaryGold text-sm">
                      Select your premium metal tone
                    </p>
                  </div>
                </div>

            <div className="grid grid-cols-2 gap-3">
  {metalOptions.map(({ color, label, image }) => {
    const isMixCard = color === "mix";

    // const isSelected = isMixCard
    //   ? isMixMode
    //   : bandColor === color && prongColor === color;

      const isSelected = isMixCard
  ? bandColor !== prongColor || isMixMode
  : !isMixMode &&
    bandColor === color &&
    prongColor === color;

    return (
      <button
        key={label}
        onClick={() => {
          if (isMixCard) {
            // Mix panel open
            setTempBandColor(bandColor);
            setTempProngColor(prongColor);
            setIsMixMode(true);
          } else {
            // Normal metal selection
            setIsMixMode(false);
            handleColorChange(color);
          }
        }}
        className={`
          relative overflow-hidden rounded-lg border transition-all duration-300
          ${isSelected
            ? "border-[#c59d5f] scale-[1.03] shadow-[0_0_0_2px_rgba(197,157,95,0.25)]"
            : "border-gray-200 hover:border-[#d4b47a]"}
        `}
      >
        <div
          className="relative flex items-center justify-center px-3 py-5 min-h-[70px] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${image})`,
          }}
        >
          {/* <div className="absolute inset-0 bg-white/10 rounded-2xl" /> */}

          <span className="relative z-10 text-sm font-medium text-gray-800 text-center leading-snug">
            {label}
          </span>
        </div>

        {isSelected && (
          <div className="absolute top-2 right-2 z-20 w-5 h-5 rounded-full bg-green-400 flex items-center justify-center shadow-md">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </button>
    );
  })}
</div>

                
              </div>
            </>
          ) : (
            <>
  {/* MIX MODE */}
  <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-5 shadow-2xl">

    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={() => setIsMixMode(false)}
        className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#fbf4ec] to-[#f3e5d3] text-activeText hover:bg-white/20 transition"
      >
        ← Back
      </button>

      <h2 className="text-primaryGold text-lg font-semibold">
        Mixed Metal
      </h2>

      <div className="w-8" />
    </div>

    {/* ================= HEAD METAL ================= */}
    <div className="mb-6">
      <h3 className="text-primaryGold mb-3 font-medium">
        Head Metal
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {metalOptions
          .filter((metal) => metal.color !== "mix")
          .map(({ color, label, image }) => (
            <button
              key={`head-${label}`}
              onClick={() => {
                setTempProngColor(color);
                setProngColor(color); // Live Preview
              }}
              className={`
                relative overflow-hidden rounded-lg border transition-all duration-300
                ${tempProngColor === color
                  ? "border-primaryGold scale-[1.03] shadow-lg"
                  : "border-white/10 hover:border-white/30"}
              `}
            >
              <div
                className="relative flex items-center justify-center px-3 py-5 min-h-[70px] bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${image})`,
                }}
              >
                {/* <div className="absolute inset-0 bg-white/10 rounded-2xl" /> */}

                <span className="relative z-10 text-sm font-medium text-gray-800 text-center leading-snug">
                  {label}
                </span>
                {tempProngColor === color && (
  <div className="absolute top-2 right-2 z-20 w-5 h-5 rounded-full bg-green-400 flex items-center justify-center shadow-md">
    <svg
      className="w-3 h-3 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  </div>
)}
              </div>
            </button>
          ))}
      </div>
    </div>

    {/* ================= BAND METAL ================= */}
    <div>
      <h3 className="text-primaryGold mb-3 font-medium">
        Band Metal
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {metalOptions
          .filter((metal) => metal.color !== "mix")
          .map(({ color, label, image }) => (
            <button
              key={`band-${label}`}
              onClick={() => {
                setTempBandColor(color);
                setBandColor(color); // Live Preview
              }}
              className={`
                relative overflow-hidden rounded-lg border transition-all duration-300
                ${tempBandColor === color
                  ? "border-primaryGold scale-[1.03] shadow-lg"
                  : "border-white/10 hover:border-white/30"}
              `}
            >
              <div
                className="relative flex items-center justify-center px-3 py-5 min-h-[70px] bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${image})`,
                }}
              >
                {/* <div className="absolute inset-0 bg-white/10 rounded-2xl" /> */}

                <span className="relative z-10 text-sm font-medium text-gray-800 text-center leading-snug">
                  {label}
                </span>

               {tempBandColor === color && (
  <div className="absolute top-2 right-2 z-20 w-5 h-5 rounded-full bg-green-400 flex items-center justify-center shadow-md">
    <svg
      className="w-3 h-3 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  </div>
)}
                
              </div>
              
            </button>
          ))}
          
      </div>
    </div>

    {/* ================= APPLY BUTTON ================= */}
    <button
      onClick={() => {
        setBandColor(tempBandColor);
        setProngColor(tempProngColor);
        setIsMixMode(false);
      }}
      className="
        mt-6 w-full py-3 rounded-2xl
        bg-gradient-to-r from-emerald-500 to-cyan-500
        text-white font-semibold
        hover:scale-[1.02]
        transition-all duration-300
      "
    >
      Apply Changes
    </button>
  </div>
</>
          )}

        </div>
      )}

      {/* ================= TYPE TAB ================= */}
      {activeTab === "type" && (
  <div className="space-y-6 backdrop-blur-md p-5 shadow-2xl">

    {/* ================= HEAD TYPE ================= */}
    <div className="rounded-3xl border border-white/10 bg-white/5  ">
      <h2 className="text-primaryGold text-lg font-semibold mb-4">
        Head Type
      </h2>

      <div className="flex flex-wrap gap-2">
        {visibleProngs.map((p) => {
          const isSelected = selectedProng?.name === p.name;
          
          return (
            <button
              key={p.name}
              onClick={() => changeProng(p)}
              className={`
                relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 pr-10
                ${
                  isSelected
                    ? "bg-gradient-to-r from-[#fbf4ec] to-[#f3e5d3] text-activeText border border-[#c59d5f] shadow-md scale-[1.02]"
                    : "bg-white/10 text-black border border-gray-300 hover:bg-white/20 hover:text-activeText"
                }
              `}
            >
              <span>{p.name}</span>

              {/* Tick Mark Icon */}
              {isSelected && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primaryGold flex items-center justify-center shadow-sm">
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>

    {/* ================= SHANK TYPE ================= */}
    <div className="rounded-3xl border border-white/10 bg-white/5 ">
      <h2 className="text-primaryGold text-lg font-semibold mb-4">
        Shank Type
      </h2>

      <div className="flex flex-wrap gap-2">
        {shankOptions.map((p) => {
          const isSelected = selectedShank?.name === p.name;

          return (
            <button
              key={p.name}
              onClick={() => changeShank(p)}
              className={`
                relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 pr-10
                ${
                  isSelected
                    ? "bg-gradient-to-r from-[#fbf4ec] to-[#f3e5d3] text-[#8a6d3b] border border-[#c59d5f] shadow-md scale-[1.02]"
                    : "bg-white/10 text-black border border-gray-300 hover:bg-white/20 hover:text-[#8a6d3b]"
                }
              `}
            >
              <span>{p.name}</span>

              {/* Tick Mark Icon */}
              {isSelected && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primaryGold flex items-center justify-center shadow-sm">
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>

  </div>
)}

      
     {/* ================= DIAMONDS TAB ================= */}

  {activeTab === "diamonds" && (
  <div className="space-y-0 backdrop-blur-md  shadow-2xl">

    {/* ================= CARAT WEIGHT ================= */}
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-primaryGold text-lg font-semibold mb-4">
        Carat Weight
      </h2>

      <div className="grid grid-cols-3 gap-2">
        {diamondWeightOptions.map((d) => {
          const isSelected = selectedDiamondWeight === d.value;

          return (
            <button
              key={d.weight}
              onClick={() => changeDiamondWeight(d.value)}
              className={`
                relative py-3 px-2 rounded-xl text-sm font-medium transition-all duration-300
                ${
                  isSelected
                    ? "bg-gradient-to-r from-[#fbf4ec] to-[#f3e5d3] text-activeText border border-[#c59d5f] shadow-md scale-[1.02]"
                    : "bg-white/10 text-black border border-gray-300 hover:bg-white/20 hover:text-activeText"
                }
              `}
            >
              <span>{d.weight}</span>

              {/* Tick Mark Icon for Weight (Chota size aur subtle top-right position) */}
              {isSelected && (
                <div className="absolute right-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-primaryGold flex items-center justify-center shadow-sm">
                  <svg
                    className="w-2 h-2 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>

    {/* ================= DIAMOND SHAPE ================= */}
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-primaryGold text-lg font-semibold">
          Diamond Shape
        </h2>
        <div className="text-xs text-white/50">
          {diamondOptions.length} Styles
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {visibleDiamonds.map((d) => {
          const isSelected = selectedDiamond?.name === d.name;

          return (
            <button
              key={d.name}
              onClick={() => setSelectedDiamond(d)}
              className={`
                relative rounded-2xl border p-4 transition-all duration-300 text-center
                ${
                  isSelected
                    ? "bg-gradient-to-r from-[#fbf4ec] to-[#f3e5d3] border-[#c59d5f] shadow-md scale-[1.02]"
                    : "border-gray-300 bg-white/5 text-black hover:bg-white/10"
                }
              `}
            >
              <img
                src={d.image_icon}
                alt={d.name}
                className="w-12 h-12 mx-auto mb-2 relative z-10"
              />

              <span
                className={`
                  block text-sm font-medium relative z-10
                  ${isSelected ? "text-activeText" : "text-black hover:text-activeText"}
                `}
              >
                {d.name}
              </span>

              {/* Absolute Tick Mark Icon for Diamond Shape Card */}
              {isSelected && (
                <div className="absolute right-2 top-2 z-20 w-4 h-4 rounded-full bg-primaryGold flex items-center justify-center shadow-sm">
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {diamondOptions.length > 10 && (
        <button
          onClick={handleToggleDiamonds}
          className="
            mt-5 w-full py-3 rounded-2xl
            bg-white/10 text-white border border-transparent
            hover:bg-white/20
            transition-all
          "
        >
          {showAllDiamonds ? "Show Less" : "Load More"}
        </button>
      )}

    </div>
  </div>
)}

      {/* ================= THEME TAB ================= */}
      {activeTab === "theme" && (
  <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-5 shadow-2xl">

    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="text-primaryGold text-lg font-semibold">
          Scene Theme
        </h2>
        <p className="text-primaryGold text-sm">
          Luxury environment presets
        </p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      {themes.map((theme, i) => {
        const isActive = themeClass === theme;

        return (
          <button
            key={i}
            onClick={() => setThemeClass(theme)}
            className={`
              relative h-24 rounded-3xl overflow-hidden transition-all duration-300
              ${theme}
              ${
                isActive
                  ? "ring-2 ring-[#c59d5f] scale-[1.04] shadow-[0_0_25px_rgba(197,157,95,0.3)] opacity-100"
                  : "hover:scale-[1.03] opacity-75 hover:opacity-100 border border-white/10"
              }
            `}
          >
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black/5" />

            {/* Same Premium Gold Tick Mark Icon */}
            {isActive && (
              <div className="absolute right-3 top-3 z-20 w-5 h-5 rounded-full bg-[#c59d5f] flex items-center justify-center shadow-lg border border-white/20">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  </div>
)}

    </div>
  </div>
  
 ) : (
    /* ================= COLLAPSED ICON SIDEBAR ================= */
    <div className="hidden lg:flex relative z-20 h-full border-l border-white/10 backdrop-blur-xl bg-white">
      <div className="w-[72px] flex flex-col items-center py-20 gap-4">
        {[
          { key: "metal", icon: SquaresExclude },
          { key: "type", icon: GiDiamondRing },
          { key: "diamonds", icon: Gem },
          { key: "theme", icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setShowControls(true);
              }}
              className={`
                w-12 h-12 rounded-xl
                flex items-center justify-center
                transition-all duration-300
                ${
                  isActive
                    ? "bg-white text-primaryGold shadow-xl border border-black/20"
                    : "bg-white/5 text-gray-400  border border-black/20 hover:bg-white/10 hover:text-primaryGold"
                }
              `}
              title={tab.key}
            >
              <Icon size={20} strokeWidth={1.8} />
            </button>
          );
        })}
      </div>
    </div>
  )}
</div>


      </div>
      <Leva />
    </div>
  );
}