import React, { useState } from 'react';
import Ratio from './Ratio';

export default function Report({ report, setReport, ratioRange, setRatioRange, tableRange, setTableRange, depthRange, setDepthRange, fluorRange, setFluorRange, polishRange, setPolishRange, symmetryRange, setSymmetryRange }) {

  // Handle checkbox change and update state
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setReport((prevReport) => ({
      ...prevReport,
      [name]: checked,
    }));
  };

  return (
    <div className='font-semibold mb-4'>
      <h2>Lab</h2>
      <div className="flex items-center space-x-4 mt-2">
        <div className="flex items-center">
          <input
            type='checkbox'
            className="form-checkbox w-6 h-6 bg-#BCABA1"
            name="IGI"
            checked={report.IGI}
            onChange={handleCheckboxChange}
          />
          <label className="ml-2">IGI</label>
        </div>

        <div className="flex items-center">
          <input
            type='checkbox'
            className="form-checkbox w-6 h-6 bg-#BCABA1"
            name="GIA"
            checked={report.GIA}
            onChange={handleCheckboxChange}
          />
          <label className="ml-2">GIA</label>
        </div>
      </div>

      <Ratio
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
    </div>
  );
}
