import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import Report from './Report';

export default function ColorRange({ color_Range, setColor_Range, handleColorClick, colorRange = [], setColorRange, cutRange, setCutRange, clarityrange, setClarityRange, report, setReport, ratioRange, setRatioRange, tableRange, setTableRange, depthRange, setDepthRange, fluorRange, setFluorRange, polishRange, setPolishRange, symmetryRange, setSymmetryRange }) {

  const [showFilterAll, setShowFilterAll] = useState(false);
  const selectedColors = colorRange || [];

  const handleCutChange = (event, newValue) => {
    setCutRange(newValue);
  };

  const handleClarityChange = (event, newValue) => {
    setClarityRange(newValue);
  };


  const handleColorChange = (event, newValue) => {
    console.log(event, newValue);

    setColor_Range(newValue);
  };


  const handleShowMoreFilter = () => {
    setShowFilterAll(true);
  };

  const handleShowLessFilter = () => {
    setShowFilterAll(false);
  };

  return (
    <div className="w-full mx-auto">
      <div>
        <h2 className='font-semibold mb-4'>Fancy Color</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {["Pink", "Orange", "Brown", "Blue", "Yellow", "Green", "Orange-Pink", "Pink-Brown"].map((color) => (
            <button
              key={color}
              className={`text-gray-500 py-1 px-3 rounded-md transition duration-300 
                ${selectedColors.includes(color) ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => handleColorClick(color)}
            >
              {color}
            </button>
          ))}
        </div>

      </div>

      {showFilterAll && (
        <>
          <h2 className='font-semibold mb-4'>Color</h2>
          <div className="flex items-center justify-between mb-2">
            {["G", "E", "D", "I", "H", "F", "J", "K"].map((v) => (
              <span key={v} className="text-gray-500">{v}</span>
            ))}
          </div>

          <div>
            <Slider
              value={color_Range}
              onChange={handleColorChange}
              getAriaLabel={() => 'Color Range'}
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
                  backgroundColor: "#BCABA1",
                },
                '& .MuiSlider-rail': {
                  height: 4,
                  backgroundColor: '#bfbfbf',
                },
              }}
            />
          </div>

          <div>
            <h2 className='font-semibold mb-4'>Cut Grade</h2>
            <div className="flex items-center justify-between mb-2">
              {["VG", "ID", "EX", "G", "Other"].map((v) => (
                <span key={v} className="text-gray-500">{v}</span>
              ))}
            </div>
            <Slider
              value={cutRange}
              onChange={handleCutChange}
              getAriaLabel={() => 'Cut Range'}
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
                  backgroundColor: "#BCABA1",
                },
                '& .MuiSlider-rail': {
                  height: 4,
                  backgroundColor: '#bfbfbf',
                },
              }}
            />
          </div>

          <div>
            <h2 className='font-semibold mb-4'>Clarity</h2>
            <div className="flex items-center justify-between mb-2">
              {["VS2", "VS1", "VVS2", "VVS1", "I1", "SI1", "SI2", "I3", "I2", "FL", "IF", "Other"].map((v) => (
                <span key={v} className="text-gray-500">{v}</span>
              ))}
            </div>
            <Slider
              value={clarityrange}
              onChange={handleClarityChange}
              getAriaLabel={() => 'Clarity Range'}
              min={0}
              max={120}
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
                  backgroundColor: "#BCABA1",
                },
                '& .MuiSlider-rail': {
                  height: 4,
                  backgroundColor: '#bfbfbf',
                },
              }}
            />
          </div>
        </>
      )}

      {showFilterAll && (
        <Report
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
        />
      )}

      <div className='flex justify-center p-4'>
        {showFilterAll ? (
          <button className='px-4 py-2 bg-gray-300 rounded-md' onClick={handleShowLessFilter}>
            Less Filter
          </button>
        ) : (
          <button className='px-4 py-2 bg-gray-300 rounded-md' onClick={handleShowMoreFilter}>
            More Filter
          </button>
        )}
      </div>
    </div>
  );
}
