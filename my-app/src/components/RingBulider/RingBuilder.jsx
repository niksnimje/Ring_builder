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
          onClick={() => setActiveTab("color")}
          className={`flex-1 sm:flex-none pb-2 text-sm sm:text-lg font-medium transition-colors ${activeTab === "color"
            ? "text-white border-b-2 border-white"
            : "text-gray-400"
            }`}
        >
          Color
        </button>

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
  const [activeTab, setActiveTab] = useState("color");
  const location = useLocation();
  const [isMixMode, setIsMixMode] = useState(false);
  const [gemColor, setGemColor] = useState([1.5, 1.5, 1.5]);

  const handleGemColorChange = (color) => {
    setGemColor(color);
  };

  const [showMixPanel, setShowMixPanel] = useState(false);

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
  { weight: 1.0, scale: 0.25 },
  { weight: 2.0, scale: 0.29 },
  { weight: 3.0, scale: 0.33 },
  { weight: 4.0, scale: 0.36 },
  { weight: 5.0, scale: 0.39 },
];

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
    // console.log(shank.name)

    // const allowedProngs = shankProngMap[shank.name] || [];

    // const validProng = prongOptions.find(p =>
    //   allowedProngs.includes(p.name)
    // );

    // if (validProng) {
    //   setSelectedProng(validProng);
    // }

    // if (shank.name === "Solitaire Bezel") {
    //   // 👉  → Head bhi Bezel
    //   const bezelProng = prongOptions.find(
    //     (p) => p.name === "Solitaire Bezel"
    //   );

    //   if (bezelProng) {
    //     setSelectedProng(bezelProng);
    //   }
    // } else {
    //   // 👉  → default head
    //   const defaultProng = prongOptions.find(
    //     (p) => p.name === "Classic Prong"
    //   );

    //   if (defaultProng) {
    //     setSelectedProng(defaultProng);
    //   }
    // }
  };

  const changeProng = (prong) => {
    setSelectedProng(prong);
    // console.log(prong.name)

    // if (prong.name === "Solitaire Bezel") {
    //   const bezelShank = shankOptions.find(s => s.name === "Solitaire Bezel");
    //   if (bezelShank) {
    //     setSelectedShank(bezelShank);
    //   }
    // }

    // if (prong.name === "Solitaire Bezel") {
    //   // ✅ Bezel case → bezel band
    //   const bezelShank = shankOptions.find(
    //     (s) => s.name === "Solitaire Bezel"
    //   );

    //   if (bezelShank) {
    //     setSelectedShank(bezelShank);
    //   }
    // } else {
    //   // ✅ All other cases → default Solitaire band
    //   const defaultShank = shankOptions.find(
    //     (s) => s.name === "Solitaire"
    //   );

    //   if (defaultShank) {
    //     setSelectedShank(defaultShank);
    //   }
    // }
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

  const metalOptions = [
    ["#B8B4B9", "14K White Gold"],
    ["#E0E0E0", "18K White Gold"],
    ["#E6BE5A", "14K Yellow"],
    ["#DDB140", "18K Yellow"],
    ["#f1a886", "14K RG"],
    ["#d99982", "18K RG"],
    ["#B0C4DE", "PT"],
    // ["#f7c5ad", "14K RG"],
    // ["#ffcb7d", "gold"],
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
      {/* Header - Responsive */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3 sm:py-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800"> <Link to={"/ai"}>Ring Builder</Link></h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-gradient-to-tr from-slate-900 via-[#1e293b] to-slate-800">
        {/* Left Panel - Ring Model */}
        <div className="flex w-full lg:w-[70%] xl:w-[75%] 2xl:w-[80%] h-[35vh] sm:h-[40vh] lg:h-full items-center justify-center">
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
        <div className="flex w-full lg:w-[30%] xl:w-[25%] 2xl:w-[20%] bg-transparent flex-col h-[50vh] lg:h-full">
          {/* Tabs */}
          <ResponsiveTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto pb-20">
            <div className="p-3 sm:p-4 md:p-6">
              {/* color */}

              {activeTab === "color" && (
                <>
                  {!isMixMode ? (
                    // ✅ NORMAL UI
                    <>
                      <div>
                        <label className="text-sm font-medium text-white mb-2 block">
                          Select Metal Color
                        </label>

                        <div className="grid grid-cols-2 gap-2">
                          {metalOptions.map(([color, label]) => (
                            <MetalColorButton
                              key={label}
                              color={color}
                              label={label}
                              isSelected={bandColor === color && prongColor === color}
                              onClick={() => handleColorChange(color)}
                            />
                          ))}

                          <button
                            onClick={() => {
                              setTempBandColor(bandColor);
                              setTempProngColor(prongColor);
                              setIsMixMode(true);
                            }}
                            className="w-full py-2 bg-purple-600 text-white rounded-lg"
                          >
                            Mix Colors
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    // 🔥 MIX MODE UI (INLINE — NOT MODAL)
                    <>
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <button onClick={() => setIsMixMode(false)} className="text-white bg-black p-2">← Back</button>
                        <h2 className="text-lg font-semibold text-white">Mixed Metal</h2>
                        <div />
                      </div>

                      {/* Head Color */}
                      <div>
                        <label className="text-base mb-2 block text-white">
                          Head Metal Color
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {metalOptions.map(([color, label]) => (
                            <MetalColorButton
                              key={label}
                              color={color}
                              label={label}
                              isSelected={tempProngColor === color}
                              onClick={() => {
                                setTempProngColor(color);
                                setProngColor(color); // 🔥 LIVE UPDATE
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Band Color */}
                      <div className="mt-4">
                        <label className="text-base mb-2 block text-white">
                          Band Metal Color
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {metalOptions.map(([color, label]) => (
                            <MetalColorButton
                              key={label}
                              color={color}
                              label={label}
                              isSelected={tempBandColor === color}
                              onClick={() => {
                                setTempBandColor(color);
                                setBandColor(color); // 🔥 LIVE UPDATE
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Apply */}
                      <button
                        onClick={() => setIsMixMode(false)}
                        className="w-full mt-6 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-indigo-500 to-purple-600"
                      >
                        Apply & Return
                      </button>
                    </>
                  )}
                </>
              )}


              {/* Metal Tab */}
              {activeTab === "metal" && (
                <>

                  {/* <PremiumAccordion
                    title="Select Head Type"
                    icon="🎨"
                    isOpen={openAccordions.headBandType}
                    onToggle={() => toggleAccordion('headBandType')}
                  > */}
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      Select Head Type
                    </label>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                      {visibleProngs.map((p) => (
                        <button
                          key={p.name}
                          onClick={() => changeProng(p)}
                          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all text-sm sm:text-base ${selectedProng?.name === p.name
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* </PremiumAccordion> */}



                  <div className="space-y-4 mt-3 md:mt-3 lg:mt-5">
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">
                        Shank Type
                      </label>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-start">
                        {shankOptions.map((p) => (
                          <button
                            key={p.name}
                            onClick={() => changeShank(p)}
                            className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all text-sm sm:text-base ${selectedShank?.name === p.name
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>


                </>
              )}
              {/* Diamonds Tab */}
              {activeTab === "diamonds" && (
                <>

                  <div className="space-y-4">
                    {/* Carat Weight */}
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">
                        Carat Weight
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
                        {diamondWeightOptions.map((d) => (
                          <button
                            key={d.weight}
                            onClick={() => changeDiamondWeight(d.value)}
                            className={`px-2 sm:px-4 py-3 sm:py-2 rounded-lg transition-all text-sm sm:text-base ${selectedDiamondWeight === d.value
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                          >
                            {d.weight}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Center Stone Shape + Load More / Show Less Button */}
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">
                        Center Stone Shape
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2 sm:gap-3">
                        {visibleDiamonds.map((d) => (
                          <button
                            key={d.name}
                            onClick={() => setSelectedDiamond(d)}
                            className={`p-2 rounded-lg transition-all text-center ${selectedDiamond?.name === d.name
                              ? "bg-blue-600 shadow-lg scale-105 text-white"
                              : "bg-gray-50 hover:bg-gray-100"
                              }`}
                          >
                            <img
                              src={d.image_icon}
                              alt={d.name}
                              width={40}
                              height={40}
                              className="mx-auto w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                            />
                            <span className="text-sm mt-1 block">{d.name}</span>
                          </button>
                        ))}
                      </div>

                      {/* Toggle Button - Load More / Show Less */}
                      {diamondOptions.length > 10 && (
                        <div className="mt-6 flex justify-center">
                          <button
                            onClick={handleToggleDiamonds}
                            className={`px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm sm:text-base font-medium ${showAllDiamonds
                              ? "bg-gray-600 text-white hover:bg-gray-700"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                          >
                            {showAllDiamonds ? (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                                Show Less
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                Load More
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>



                </>
              )}

              {/* Theme Tab */}
              {activeTab === "theme" && (
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {themes.map((theme, i) => {
                    const isActive = themeClass === theme;
                    return (
                      <button
                        key={i}
                        onClick={() => setThemeClass(theme)}
                        style={{ background: theme.includes('bg-') ? undefined : theme }}
                        className={`
                          h-16 sm:h-16 rounded-lg transition-all duration-300
                          ${theme}
                          ${isActive
                            ? "ring-4 ring-white shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                            : "hover:scale-105 opacity-80 hover:opacity-100"
                          }
                        `}
                      >
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Leva />
    </div>
  );
}