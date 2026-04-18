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

// Define shankProngMap
const shankProngMap = {
  Pave: ["Classic Hidden Halo", "Pave Hidden Halo"],
  Solitaire: ["Classic Prong"],
  'Solitaire Bezel': ["Solitaire Bezel"]
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
const defaultBandColor = "#ffcb7d";
const defaultProngColor = "#ffcb7d";

// Premium Accordion Component
const PremiumAccordion = ({ title, icon, children, isOpen, onToggle }) => {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full px-4 sm:px-6 py-3 sm:py-4 lg:px-6 lg:py-3 flex justify-between items-center bg-white transition-all duration-200 group"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-medium text-gray-800 text-base sm:text-lg group-hover:text-gray-900">
            {title}
          </span>
        </div>
        <svg
          className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Metal Color Button Component
const MetalColorButton = ({ color, label, isSelected, onClick }) => {
  const getTextColor = (bgColor) => {
    const darkColors = ["#c0c0c0", "#a4a4a4", "#B0C4DE", "#E6C27A"];
    return darkColors.includes(bgColor) ? "#333" : "#fff";
  };

  return (
    <button
      onClick={onClick}
      className={`w-full relative  py-2.5 sm:py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${isSelected
        ? 'ring ring-green-500  shadow-lg scale-105'
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // if (isMobile) {
  //   return (
  //     <div className="border-b border-gray-200 px-4 pt-3">
  //       <select
  //         value={activeTab}
  //         onChange={(e) => setActiveTab(e.target.value)}
  //         className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-800"
  //       >
  //         <option value="metal">Metal</option>
  //         <option value="diamonds">Diamonds</option>
  //         <option value="theme">Theme</option>
  //       </select>
  //     </div>
  //   );
  // }

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

export default function HomePage() {
  // States
  const [selectedShank, setSelectedShank] = useState(defaultShank);
  const [selectedProng, setSelectedProng] = useState(defaultProng);
  const [selectedDiamond, setSelectedDiamond] = useState(defaultDiamond);
  const [selectedDiamondWeight, setSelectedDiamondWeight] = useState(defaultDiamondWeight);
  const [bandHeight, setBandHeight] = useState(0.3);
  const [bandColor, setBandColor] = useState(defaultBandColor);
  const [prongColor, setProngColor] = useState(defaultProngColor);
  const [activeTab, setActiveTab] = useState("metal");


  // Accordion states
  const [openAccordions, setOpenAccordions] = useState({
    headBandColor: true,
    centerStones: false,
    selectStones: true,
    diamondType: false,
    headBandType: true
  });



  const toggleAccordion = (key) => {
    setOpenAccordions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const bandScale = 1;
  const prongScale = 0.3;
  const prongHeight = 0.5;
  const diamondScale = 0.08;

  const sharedMetalProps = {
    metalness: 1,
    roughness: 0.1,
    reflectivity: 0.8,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
  };

  const prongOffsetY = bandHeight / 1.8;
  const diamondBaseY = bandHeight / 2.3 + prongHeight;

  const changeShank = (shank) => setSelectedShank(shank);
  const changeBandColor = (color) => setBandColor(color);
  const changeProngColor = (color) => setProngColor(color);
  const changeDiamondWeight = (weight) => setSelectedDiamondWeight(weight);

  const visibleProngs = selectedShank?.name && shankProngMap[selectedShank.name]
    ? prongOptions.filter((p) => shankProngMap[selectedShank.name].includes(p.name))
    : prongOptions;

  const finalSelectedProng = (() => {
    if (!selectedProng) return null;
    const diamondShape = selectedDiamond?.name;
    const shapeEntry = selectedProng.shapeMap?.[diamondShape];
    const resolvedPath = shapeEntry || selectedProng.defaultPath || selectedProng.path;
    return {
      ...selectedProng,
      path: resolvedPath,
    };
  })();

  const metalOptions = [
    ["#FFCC00", "14K YG"],
    ["#c0c0c0", "14K WG"],
    ["#FAC000", "18K YG"],
    ["#f7c5ad", "14K RG"],
    ["#a4a4a4", "18K WG"],
    ["#B0C4DE", "PT"],
    ["#f1a886", "18K RG"],
    ["#E6C27A", "Mixed"],
    ["#E7CC95", "Mixed3"],
    ["#F2E5C4", "Mixed333"],
    ["#D4AF37", "Mixed23"],
    ["#ffcb7d", "gold"],
    ["#DCAE96", "Rose"],
    ["#d59c72", "Rosey"],
    ["#E0E0E0", "Silver"],
  ];

  const stoneOptions = ["One Stone", "Two Stone", "Three Stone"];
  const { setThemeClass, themeClass } = useTheme();
  const themes = [
    "bg-gradient-to-tr from-slate-900 via-[#1e293b] to-slate-800",
    "bg-gradient-to-br from-[#064e3b] via-[#022c22] to-[#011c15]",
    "bg-[radial-gradient(circle,_#1e3a8a_0%,_#172554_40%,_#020617_100%)]",
    "bg-[radial-gradient(circle,_#4b5563_0%,_#1f2937_50%,_#111827_100%)]",
    "bg-gradient-to-tr from-[#042f2e] via-[#064e4b] to-[#022c22]",
    "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900",
    "bg-gradient-to-b from-gray-100 via-gray-200 to-gray-500",
    "bg-[radial-gradient(circle_at_50%_40%,#6d28d9_0%,#1e1b4b_50%,#020617_100%)]",
    // 🔥 Matte Black + Soft Light (best contrast)
    "bg-[radial-gradient(circle_at_50%_30%,#2a2a2a_0%,#000000_80%)]",
    // --- Dark & Royal Themes ---
    "bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#0f172a_40%,_#020617_100%)]", // Midnight Blue
    "bg-[radial-gradient(circle,_#422006_0%,_#1c1917_60%,_#0c0a09_100%)]",          // Deep Espresso/Bronze
    // --- Aesthetic Gradients ---
    "bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#111827]",                   // Anthracite Grey
    "bg-[radial-gradient(circle,_#2d1b69_0%,_#1e1b4b_50%,_#020617_100%)]",

    // Deep Blue & Royal
    "bg-gradient-to-br from-[#0a192f] via-[#0d2847] to-[#0a192f]",

    "bg-gradient-to-tr from-[#0a1f0a] via-[#1a3a1a] to-[#0a1f0a]",
    "bg-gradient-to-br from-[#1a0a2e] via-[#2a1a4e] to-[#1a0a2e]",
    "bg-[radial-gradient(circle_at_center,_#2a1a4e_0%,_#0a0515_100%)]",
    // Warm Sand & Gold
    "bg-gradient-to-br from-[#2a2218] via-[#3d3224] to-[#1a1510]",
  ];




  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header - Responsive */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3 sm:py-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Ring Builder</h1>
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
              prongOffsetY={prongOffsetY}
              diamondBaseY={diamondBaseY}
              sharedMetalProps={sharedMetalProps}
              setBandHeight={setBandHeight}
              bandHeight={bandHeight}
              diamondWeight={{
                weight: `${selectedDiamondWeight.toFixed(2)} ct`,
                value: selectedDiamondWeight,
              }}
            />
          </div>
        </div>

        {/* Right Panel - Controls */}

        <div className="flex w-full lg:w-[30%] xl:w-[25%] 2xl:w-[20%] bg-transparent flex-col h-[50vh] lg:h-full">
          {/* Tabs */}
          <ResponsiveTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto pb-20">
            <div className="p-3 sm:p-4 md:p-6">
              {/* Metal Tab */}
              {activeTab === "metal" && (
                <>
                  <PremiumAccordion
                    title="Head & Band Color"
                    icon="🎨"
                    isOpen={openAccordions.headBandColor}
                    onToggle={() => toggleAccordion('headBandColor')}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-white mt-2 mb-2 block">
                          Select Metal Type
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-1.5 sm:gap-2">
                          {metalOptions.map(([color, label]) => (
                            <MetalColorButton
                              key={label}
                              color={color}
                              label={label}
                              isSelected={bandColor === color}
                              onClick={() => changeBandColor(color)}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-white mb-2 block">
                          Head Metal Color
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-1.5 sm:gap-2">
                          {metalOptions.map(([color, label]) => (
                            <MetalColorButton
                              key={label}
                              color={color}
                              label={label}
                              isSelected={prongColor === color}
                              onClick={() => changeProngColor(color)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </PremiumAccordion>

                  <PremiumAccordion
                    title="Select Head Type"
                    icon="🎨"
                    isOpen={openAccordions.headBandType}
                    onToggle={() => toggleAccordion('headBandType')}
                  >
                    <div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                        {visibleProngs.map((p) => (
                          <button
                            key={p.name}
                            onClick={() => setSelectedProng(p)}
                            className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg  transition-all text-sm sm:text-base ${selectedProng?.name === p.name
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </PremiumAccordion>
                </>
              )}

              {/* Diamonds Tab */}
              {activeTab === "diamonds" && (
                <>

                  <PremiumAccordion
                    title="Select Your Stones"
                    icon="✨"
                    isOpen={openAccordions.selectStones}
                    onToggle={() => toggleAccordion('selectStones')}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-white mb-2 block">
                          Center Stone Shape
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2 sm:gap-3">
                          {diamondOptions.map((d) => (
                            <button
                              key={d.name}
                              onClick={() => setSelectedDiamond(d)}
                              className={`p-2 rounded-lg transition-all text-center ${selectedDiamond?.name === d.name
                                ? "bg-blue-600 shadow-lg scale-105 text-white"
                                : "bg-gray-50 hover:bg-gray-100 "
                                }`}
                            >
                              <img src={d.image_icon} alt={d.name} width={40} height={40} className="mx-auto w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                              <span className="text-sm mt-1 block">{d.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

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
                    </div>
                  </PremiumAccordion>


                  <PremiumAccordion
                    title="Center Stones"
                    icon="💎"
                    isOpen={openAccordions.centerStones}
                    onToggle={() => toggleAccordion('centerStones')}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-white mb-2 block">
                          Shank Type
                        </label>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
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
                  </PremiumAccordion>
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
                            ?  // 🔥 ACTIVE STYLE
                            "ring-4 ring-white shadow-[0_0_20px_rgba(255,255,255,0.6)]"
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