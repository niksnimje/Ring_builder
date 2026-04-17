import React, { useEffect, useState } from 'react';
import CartSize from './CartSize'
import DiamondTable from '../DiamondData/DiamondTable';

export default function SearchDiamond() {
    const [selectedShapes, setSelectedShapes] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [caratRange, setCaratRange] = useState([0, 23]);
    const [priceRange, setPriceRange] = useState([50, 50000]);
    const [total_priceRange, setTotal_PriceRange] = useState([50, 50000]);
    const [colorRange, setColorRange] = useState([]);
    const [color_Range, setColor_Range] = useState([0, 80]);
    const [cutRange, setCutRange] = useState([0, 50]);
    const [clarityrange, setClarityRange] = useState([0, 120]);
    const [report, setReport] = useState({
        IGI: false,
        GIA: false,
    });
    const [ratioRange, setRatioRange] = useState([0, 2.27]);
    const [tableRange, setTableRange] = useState([0, 100]);
    const [depthRange, setDepthRange] = useState([0, 100]);
    const [fluorRange, setFluorRange] = useState([0, 80]);
    const [polishRange, setPolishRange] = useState([0, 50]);
    const [symmetryRange, setSymmetryRange] = useState([0, 50]);
    const [diamondData, setDiamondData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const searchDiamond = [
        { img: "diamondimg/Round.png", Shape: "Round" },
        { img: "diamondimg/Oval.png", Shape: "Oval" },
        { img: "diamondimg/Emerald.png", Shape: "Emerald" },
        { img: "diamondimg/Radiant.png", Shape: "Radiant" },
        { img: "diamondimg/Cushion.png", Shape: "Cushion" },
        { img: "diamondimg/Marquise.png", Shape: "Marquise" },
        { img: "diamondimg/Pear.png", Shape: "Pear" },
        { img: "diamondimg/Heart.png", Shape: "Heart" },
        { img: "diamondimg/Princess.png", Shape: "Princess" },
        { img: "diamondimg/Ascher.png", Shape: "Asscher" },
        { img: "diamondimg/Briolette.png", Shape: "Briolette" },
        { img: "diamondimg/Bugget.png", Shape: "Bugget" },
        { img: "diamondimg/Bullet Cut.png", Shape: "Bullet Cut" },
        { img: "diamondimg/Antique Cushion.png", Shape: "Antique Cushion" },
        { img: "diamondimg/Calf.png", Shape: "Calf" },
        { img: "diamondimg/Circular Brilliant.png", Shape: "Circular Brilliant" },
        { img: "diamondimg/European Cut.png", Shape: "European Cut" },
        { img: "diamondimg/Half Moon.png", Shape: "Half Moon" },
        { img: "diamondimg/Hexagonal.png", Shape: "Hexagonal" },
        { img: "diamondimg/Kite.png", Shape: "Kite" },
        { img: "diamondimg/Lozenge.png", Shape: "Lozenge" },
        { img: "diamondimg/Octagonal.png", Shape: "Octagonal" },
        { img: "diamondimg/Old Mine Cut.png", Shape: "Old Mine Cut" },
        { img: "diamondimg/Pentagonal.png", Shape: "Pentagonal" },
        { img: "diamondimg/Rose.png", Shape: "Rose" },
        { img: "diamondimg/Shield.png", Shape: "Shield" },
        { img: "diamondimg/SQ. Emerald.png", Shape: "SQ. Emerald" },
        { img: "diamondimg/SQ. Radiant.png", Shape: "SQ. Radiant" },
        { img: "diamondimg/Squre Diamond.png", Shape: "Squre Diamond" },
    ];

    const selectedColors = colorRange || [];

    const handleColorClick = (color) => {
        if (selectedColors.includes(color)) {
            setColorRange(selectedColors.filter((c) => c !== color));
        } else {
            setColorRange([...selectedColors, color]);
        }
    };

    useEffect(() => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(() => {
            fetchDiamondData(currentPage, selectedShapes, caratRange, ratioRange, colorRange, tableRange, depthRange, total_priceRange, cutRange, clarityrange, fluorRange, polishRange, symmetryRange, report, color_Range);
        }, 1000);

        setDebounceTimeout(timeout);

        return () => clearTimeout(timeout);
    }, [currentPage, selectedShapes, caratRange, ratioRange, tableRange, colorRange, depthRange, total_priceRange, cutRange, clarityrange, fluorRange, polishRange, symmetryRange, report, color_Range]);

    const fetchDiamondData = async (page, shapes) => {
        // try {
        //     setIsLoading(true);
        //     const shapeQuery = shapes.length > 0 ? shapes.join(",") : "";
        //     const fancy_colorQuery = selectedColors.length > 0 ? selectedColors.join(",") : "";

        //     const reportFilter = [];
        //     if (report.IGI) reportFilter.push("IGI");
        //     if (report.GIA) reportFilter.push("GIA");
        //     const reportQuery = reportFilter.join(",");

        //     const [minWeight, maxWeight] = caratRange;
        //     const [minTotalPrice, maxTotalPrice] = total_priceRange;
        //     const [minRatio, maxRatio] = ratioRange;
        //     const [minTable, maxTable] = tableRange;
        //     const [minDepth, maxDepth] = depthRange;
        //     // const colorOption = [
        //     //     { grade: "G", value: 5 },
        //     //     { grade: "E", value: 15 },
        //     //     { grade: "D", value: 25 },
        //     //     { grade: "I", value: 35 },
        //     //     { grade: "H", value: 45 },
        //     //     { grade: "F", value: 55 },
        //     //     { grade: "J", value: 65 },
        //     //     { grade: "K", value: 75 },
        //     // ];
        //     // const colorQuery = colorOption
        //     //     .filter(option => option.value <= color_Range[1] && option.value >= color_Range[0])
        //     //     .map(option => option.grade)
        //     //     .join(",");

        //     const cutOptions = [
        //         { grade: "VG", value: 5 },
        //         { grade: "ID", value: 15 },
        //         { grade: "EX", value: 25 },
        //         { grade: "G", value: 35 },
        //         { grade: " ", value: 45 },
        //     ];
        //     const cutQuery = cutOptions
        //         .filter(option => option.value <= cutRange[1] && option.value >= cutRange[0])
        //         .map(option => option.grade)
        //         .join(",");

        //     const clarityOption = [
        //         { grade: "VS2", value: 5 },
        //         { grade: "VS1", value: 15 },
        //         { grade: "VVS2", value: 25 },
        //         { grade: "VVS1", value: 35 },
        //         { grade: "I1", value: 45 },
        //         { grade: "SI1", value: 55 },
        //         { grade: "SI2", value: 65 },
        //         { grade: "I3", value: 75 },
        //         { grade: "I2", value: 85 },
        //         { grade: "FL", value: 95 },
        //         { grade: "IF", value: 105 },
        //         { grade: " ", value: 115 },
        //     ];
        //     const clarityQuery = clarityOption
        //         .filter(option => option.value <= clarityrange[1] && option.value >= clarityrange[0])
        //         .map(option => option.grade)
        //         .join(",");

        //     const fluorOption = [
        //         { grade: "VST", value: 5 },
        //         { grade: "STG", value: 15 },
        //         { grade: "MED", value: 25 },
        //         { grade: "FNT", value: 35 },
        //         { grade: "VSL", value: 45 },
        //         { grade: "SLT", value: 55 },
        //         { grade: "NON", value: 65 },
        //         { grade: " ", value: 75 },
        //     ];
        //     const fluorQuery = fluorOption
        //         .filter(option => option.value <= fluorRange[1] && option.value >= fluorRange[0])
        //         .map(option => option.grade)
        //         .join(",");

        //     const polishOption = [
        //         { grade: "EX", value: 5 },
        //         { grade: "VG", value: 15 },
        //         { grade: "G", value: 25 },
        //         { grade: "GOOD", value: 35 },
        //         { grade: " ", value: 45 },
        //     ];
        //     const polishQuery = polishOption
        //         .filter(option => option.value <= polishRange[1] && option.value >= polishRange[0])
        //         .map(option => option.grade)
        //         .join(",");

        //     const symmetryOption = [
        //         { grade: "VG", value: 5 },
        //         { grade: "EX", value: 15 },
        //         { grade: "G", value: 25 },
        //         { grade: "F", value: 35 },
        //         { grade: " ", value: 45 },
        //     ];
        //     const symmetryQuery = symmetryOption
        //         .filter(option => option.value <= symmetryRange[1] && option.value >= symmetryRange[0])
        //         .map(option => option.grade)
        //         .join(",");

        //     const response = await fetch(`${process.env.REACT_APP_DEV_URL}/users/diamond-data-get?page=${page}&shape=${shapeQuery}&weight=${minWeight}-${maxWeight}&total_price=${minTotalPrice}-${maxTotalPrice}&ratio=${minRatio}-${maxRatio}&table=${minTable}-${maxTable}&depth=${minDepth}-${maxDepth}&fancy_color=${fancy_colorQuery}&cut=${cutQuery}&report=${reportQuery}&clarity=${clarityQuery}&fluor=${fluorQuery}&polish=${polishQuery}&symmetry=${symmetryQuery}`);

        //     if (response.ok) {
        //         const diaData = await response.json();
        //         setDiamondData(diaData.data);
        //     } else {
        //         console.error("Failed to fetch diamond data:", response.statusText);
        //     }
        // } catch (error) {
        //     console.log("Not Found Diamond Fetch Data:", error);
        // } finally {
        //     setIsLoading(false);
        // }
    };

    const handleShapeClick = (shape) => {
        setSelectedShapes((prevSelected) =>
            prevSelected.includes(shape)
                ? prevSelected.filter((selected) => selected !== shape)
                : [...prevSelected, shape]
        );
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleShowMore = () => {
        setShowAll(true);
    };
    const handleShowLess = () => {
        setShowAll(false);
    };

    const displayedDiamonds = showAll ? searchDiamond : searchDiamond.slice(0, 8);
    return (
        <section className="container mx-auto mb-5 pt-6">
            <div className="flex flex-col lg:flex-row lg:justify-around">
                <div className="lg:w-[20%] w-full lg:mb-0 mb-5 shadow-2xl">
                    <h2 className="font-semibold text-center text-2xl px-4">SHAPE</h2>
                    <div className="grid grid-cols-4 gap-2 p-4">
                        {displayedDiamonds.map((diamond, index) => (
                            <div
                                key={index}
                                className={`flex flex-col items-center p-2 border-2 rounded-md cursor-pointer ${selectedShapes.includes(diamond.Shape)
                                    ? 'border-[#BCABA1]'
                                    : 'border-transparent'
                                    } hover:border-[#BCABA1]`}
                                onClick={() => handleShapeClick(diamond.Shape)}
                            >
                                <img className="w-12 h-12" src={diamond.img} alt={diamond.Shape} />
                                <span
                                    className={`mt-1 text-center text-sm transition-all duration-300 ${selectedShapes.includes(diamond.Shape)
                                        ? 'text-[#BCABA1]'
                                        : 'opacity-0 invisible'
                                        } hover:text-[#BCABA1] hover:opacity-100 hover:visible`}
                                >
                                    {diamond.Shape}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center p-4">
                        {showAll ? (
                            <button className="px-4 py-2 bg-gray-300 rounded-md" onClick={handleShowLess}>
                                Back
                            </button>
                        ) : (
                            <button className="px-4 py-2 bg-gray-300 rounded-md" onClick={handleShowMore}>
                                View All
                            </button>
                        )}
                    </div>
                    <CartSize
                        caratRange={caratRange}
                        setCaratRange={setCaratRange}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        total_priceRange={total_priceRange}
                        setTotal_PriceRange={setTotal_PriceRange}
                        colorRange={colorRange}
                        setColorRange={setColorRange}
                        cutRange={cutRange}
                        setCutRange={setCutRange}
                        color_Range={color_Range}
                        setColor_Range={setColor_Range}
                        clarityrange={clarityrange}
                        setClarityRange={setClarityRange}
                        report={report}
                        setReport={setReport}
                        ratioRange={ratioRange}
                        setRatioRange={setRatioRange}
                        tableRange={tableRange}
                        setTableRange={setTableRange}
                        depthRange={depthRange}
                        setDepthRange={setDepthRange}
                        fluorRange={fluorRange}
                        setFluorRange={setFluorRange}
                        polishRange={polishRange}
                        setPolishRange={setPolishRange}
                        symmetryRange={symmetryRange}
                        setSymmetryRange={setSymmetryRange}
                        handleColorClick={handleColorClick}
                    />
                </div>
                {/* {isLoading ? (
                    <div className="lg:w-[75%] w-full">
                        <div className="loader"></div>
                    </div>
                ) : ( */}
                <div className="lg:w-[75%] w-full">
                    <DiamondTable
                        diamondData={diamondData}
                        setDiamondData={setDiamondData}
                        fetchDiamondData={fetchDiamondData}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
                {/* )} */}
            </div>
        </section>
    );
}
