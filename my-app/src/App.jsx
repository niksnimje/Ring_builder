import React from "react";
import HomePage from "./components/Home/HomePage";
import DiamondPage from "./components/DiamondPage/DiamondPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = () => {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/diamond" element={<DiamondPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
};

export default App;
