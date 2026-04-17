import React, { useState } from 'react';
import { Slider, TextField } from '@mui/material';
import Fluor from './Fluor';

export default function Ratio({ ratioRange, setRatioRange, tableRange, setTableRange, depthRange, setDepthRange, fluorRange, setFluorRange, polishRange, setPolishRange, symmetryRange, setSymmetryRange }) {

    const handleRatioChange = (event, newValue) => {
        setRatioRange(newValue);
    };

    const handleMinRatioChange = (event) => {
        const newMin = Math.min(Number(event.target.value), ratioRange[1]);
        setRatioRange([newMin, ratioRange[1]]);
    };

    const handleMaxRatioChange = (event) => {
        const newMax = Math.max(Number(event.target.value), ratioRange[0]);
        setRatioRange([ratioRange[0], newMax]);
    };

    const handleTableChange = (event, newValue) => {
        setTableRange(newValue);
    };

    const handleMinTableChange = (event) => {
        const newMin = Math.min(Number(event.target.value), tableRange[1]);
        setTableRange([newMin, tableRange[1]]);
    };

    const handleMaxTableChange = (event) => {
        const newMax = Math.max(Number(event.target.value), tableRange[0]);
        setTableRange([tableRange[0], newMax]);
    };

    const handleDepthChange = (event, newValue) => {
        setDepthRange(newValue);
    };

    const handleMinDepthChange = (event) => {
        const newMin = Math.min(Number(event.target.value), depthRange[1]);
        setDepthRange([newMin, depthRange[1]]);
    };

    const handleMaxDepthChange = (event) => {
        const newMax = Math.max(Number(event.target.value), depthRange[0]);
        setDepthRange([depthRange[0], newMax]);
    };
    return (
        <div className="mt-4 space-y-6">
            <div>
                <h2 className="font-semibold mb-4">L:W Ratio</h2>
                <div className="flex justify-between mt-2">
                    <TextField
                        label="Min Ratio"
                        value={ratioRange[0]}
                        onChange={handleMinRatioChange}
                        size="small"
                        type="number"
                        inputProps={{ min: 0, max: ratioRange[1], step: 0.01 }}
                    />
                    <TextField
                        label="Max Ratio"
                        value={ratioRange[1]}
                        onChange={handleMaxRatioChange}
                        size="small"
                        type="number"
                        inputProps={{ min: ratioRange[0], max: 2.27, step: 0.01 }}
                    />
                </div>
                <Slider
                    value={ratioRange}
                    onChange={handleRatioChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={2.27}
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

            <div>
                <h2 className="font-semibold mb-4">TABLE %</h2>
                <div className="flex justify-between mt-2">
                    <TextField
                        label="Min Table"
                        value={tableRange[0]}
                        onChange={handleMinTableChange}
                        size="small"
                        type="number"
                        inputProps={{ min: 0, max: tableRange[1], step: 0.01 }}
                    />
                    <TextField
                        label="Max Table"
                        value={tableRange[1]}
                        onChange={handleMaxTableChange}
                        size="small"
                        type="number"
                        inputProps={{ min: tableRange[0], max: 100, step: 0.01 }}
                    />
                </div>
                <Slider
                    value={tableRange}
                    onChange={handleTableChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={100}
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

            <div>
                <h2 className="font-semibold mb-4">Depth %</h2>
                <div className="flex justify-between mt-2">
                    <TextField
                        label="Min Depth"
                        value={depthRange[0]}
                        onChange={handleMinDepthChange}
                        size="small"
                        type="number"
                        inputProps={{ min: 0, max: depthRange[1], step: 0.01 }}
                    />
                    <TextField
                        label="Max Depth"
                        value={depthRange[1]}
                        onChange={handleMaxDepthChange}
                        size="small"
                        type="number"
                        inputProps={{ min: depthRange[0], max: 100, step: 0.01 }}
                    />
                </div>
                <Slider
                    value={depthRange}
                    onChange={handleDepthChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={100}
                    step={0.01}
                    sx={{
                        color: '#3f51b5',
                        '& .MuiSlider-thumb': {
                            height: 18,
                            width: 18,
                            backgroundColor: '#fff',
                            border: '2px solid #3f51b5', '&:focus, &:hover, &.Mui-active': { boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)', },
                        },
                        '& .MuiSlider-track': { height: 4, backgroundColor: '#BCABA1', },
                        '& .MuiSlider-rail': { height: 4, backgroundColor: '#bfbfbf', },
                    }}
                />
            </div>

            <Fluor
                fluorRange={fluorRange}
                setFluorRange={setFluorRange}
                polishRange={polishRange}
                setPolishRange={setPolishRange}
                symmetryRange={symmetryRange}
                setSymmetryRange={setSymmetryRange}
            />
        </div>
    );
}