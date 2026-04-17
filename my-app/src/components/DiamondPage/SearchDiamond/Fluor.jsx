import React, { useState } from 'react';
import Slider from '@mui/material/Slider';

export default function Fluor({ fluorRange, setFluorRange, polishRange, setPolishRange, symmetryRange, setSymmetryRange }) {

    const handleFluorChange = (event, newValue) => {
        setFluorRange(newValue);
    };

    const handlePolishChange = (event, newValue) => {
        setPolishRange(newValue);
    };


    const handleSymmetryChange = (event, newValue) => {
        setSymmetryRange(newValue);
    };



    return (
        <div className="mt-4 space-y-6">
            <div>
                <h2 className="font-semibold mb-4">Fluorescence Intensity</h2>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                    {["VST", "STG", "MED", "FNT", "VSL", "SLT", "NON", "Other"].map((label, index) => (
                        <span key={index}>{label}</span>
                    ))}
                </div>
                <Slider
                    value={fluorRange}
                    onChange={handleFluorChange}
                    getAriaLabel={() => 'Fluor Range'}
                    min={0}
                    max={80}
                    step={10}
                    marks
                    sx={{
                        color: '#3f51b5',
                        '& .MuiSlider-thumb': {
                            height: 18,
                            width: 18,
                            backgroundColor: '#fff',
                            border: '2px solid currentColor',
                            '&:focus, &:hover, &.Mui-active': {
                                boxShadow: 'inherit',
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
                <h2 className="font-semibold mb-4">Polish</h2>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                    {["EX", "VG", "G", "GOOD", "Other"].map((label, index) => (
                        <span key={index}>{label}</span>
                    ))}
                </div>
                <Slider
                    value={polishRange}
                    onChange={handlePolishChange}
                    getAriaLabel={() => 'Fluor Range'}
                    min={0}
                    max={50}
                    step={10}
                    marks
                    sx={{
                        color: '#3f51b5',
                        '& .MuiSlider-thumb': {
                            height: 18,
                            width: 18,
                            backgroundColor: '#fff',
                            border: '2px solid currentColor',
                            '&:focus, &:hover, &.Mui-active': {
                                boxShadow: 'inherit',
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
                <h2 className="font-semibold mb-4">Symmetry</h2>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                    {["VG", "EX", "G", "F", "Other"].map((label, index) => (
                        <span key={index}>{label}</span>
                    ))}
                </div>
                <Slider
                    value={symmetryRange}
                    onChange={handleSymmetryChange}
                    getAriaLabel={() => 'Fluor Range'}
                    min={0}
                    max={50}
                    step={10}
                    marks
                    sx={{
                        color: '#3f51b5',
                        '& .MuiSlider-thumb': {
                            height: 18,
                            width: 18,
                            backgroundColor: '#fff',
                            border: '2px solid currentColor',
                            '&:focus, &:hover, &.Mui-active': {
                                boxShadow: 'inherit',
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

        </div>
    );
}
