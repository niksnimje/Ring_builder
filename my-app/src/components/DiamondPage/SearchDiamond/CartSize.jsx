import React from 'react';
import { Slider, TextField } from '@mui/material';
import ColorRange from './ColorRange';

export default function CartSize({
    caratRange, setCaratRange, priceRange, setPriceRange, handleColorClick,
    total_priceRange, setTotal_PriceRange, colorRange = [], setColorRange,
    cutRange, setCutRange, clarityrange, setClarityRange, report, setReport,
    ratioRange, setRatioRange, tableRange, setTableRange, depthRange, setDepthRange,
    fluorRange, setFluorRange, polishRange, setPolishRange, symmetryRange, setSymmetryRange, color_Range, setColor_Range
}) {

    const validateAndSetRange = (setter, range, newMin, newMax, minLimit, maxLimit) => {
        const validMin = Math.max(minLimit, Math.min(newMin, newMax));
        const validMax = Math.min(maxLimit, Math.max(newMin, newMax));
        setter([validMin, validMax]);
    };

    const handleCaratChange = (event, newValue) => {
        validateAndSetRange(setCaratRange, caratRange, newValue[0], newValue[1], 1, 23);
    };

    const handleTotalPriceChange = (event, newValue) => {
        validateAndSetRange(setTotal_PriceRange, total_priceRange, newValue[0], newValue[1], 0, 50000);
    };

    const handleInputChange = (setter, range, index, newValue, minLimit, maxLimit) => {
        const newRange = [...range];
        newRange[index] = newValue;
        validateAndSetRange(setter, newRange, newRange[0], newRange[1], minLimit, maxLimit);
    };

    return (
        <div className='p-4'>
            <div className='mt-4'>
                <h2 className="font-semibold">WEIGHT SIZE</h2>
                <div className="flex justify-between mt-2">
                    <TextField
                        label="Min Carat"
                        value={caratRange[0]}
                        onChange={(e) => handleInputChange(setCaratRange, caratRange, 0, parseFloat(e.target.value), 1, caratRange[1])}
                        size="small"
                        type="number"
                        inputProps={{ min: 0.5, max: caratRange[1], step: 0.1 }}
                    />
                    <TextField
                        label="Max Carat"
                        value={caratRange[1]}
                        onChange={(e) => handleInputChange(setCaratRange, caratRange, 1, parseFloat(e.target.value), caratRange[0], 23)}
                        size="small"
                        type="number"
                        inputProps={{ min: caratRange[0], max: 23, step: 0.1 }}
                    />
                </div>

                <Slider
                    value={caratRange}
                    onChange={handleCaratChange}
                    valueLabelDisplay="auto"
                    min={1}
                    max={23}
                    step={0.01}
                    sx={{
                        color: '#3f51b5',
                        '& .MuiSlider-thumb': {
                            height: 18,
                            width: 18,
                            backgroundColor: '#fff',
                            border: '2px solid #3f51b5',
                            '&:focus, &:hover, &.Mui-active': {
                                boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                            },
                        },
                        '& .MuiSlider-track': {
                            height: 4,
                            backgroundColor: '#BCABA1',
                        },
                        '& .MuiSlider-rail': {
                            height: 4,
                            backgroundColor: '#bfbfbf',
                        },
                    }}
                />
            </div>


            <div className='mt-4'>
                <h2 className="font-semibold">TOTAL PRICE</h2>
                <div className="flex justify-between mt-2">
                    <TextField
                        label="Min Total Price"
                        value={total_priceRange[0]}
                        onChange={(e) => handleInputChange(setTotal_PriceRange, total_priceRange, 0, parseFloat(e.target.value), 0, total_priceRange[1])}
                        size="small"
                        type="number"
                        inputProps={{ min: 0, max: total_priceRange[1], step: 1 }}
                    />
                    <TextField
                        label="Max Total Price"
                        value={total_priceRange[1]}
                        onChange={(e) => handleInputChange(setTotal_PriceRange, total_priceRange, 1, parseFloat(e.target.value), total_priceRange[0], 50000)}
                        size="small"
                        type="number"
                        inputProps={{ min: total_priceRange[0], max: 50000, step: 1 }}
                    />
                </div>
                <Slider
                    value={total_priceRange}
                    onChange={handleTotalPriceChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={50000}
                    step={1}
                    sx={{
                        color: '#3f51b5',
                        '& .MuiSlider-thumb': {
                            height: 18,
                            width: 18,
                            backgroundColor: '#fff',
                            border: '2px solid #3f51b5',
                            '&:focus, &:hover, &.Mui-active': {
                                boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                            },
                        },
                        '& .MuiSlider-track': {
                            height: 4,
                            backgroundColor: '#BCABA1',
                        },
                        '& .MuiSlider-rail': {
                            height: 4,
                            backgroundColor: '#bfbfbf',
                        },
                    }}
                />
            </div>

            <ColorRange
                colorRange={colorRange}
                setColorRange={setColorRange}
                color_Range={color_Range}
                setColor_Range={setColor_Range}
                cutRange={cutRange}
                setCutRange={setCutRange}
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
    );
}
