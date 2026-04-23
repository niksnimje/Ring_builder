// HomePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { translateToEnglish } from '../../utils/translate';

const HomePage = () => {
  const navigate = useNavigate();
  const [ringDescription, setRingDescription] = useState('');

 const handleCreateRing = async () => {
  if (ringDescription.trim()) {

    console.log("Original:", ringDescription);

    const translated = await translateToEnglish(ringDescription);

    console.log("Translated:", translated);

    navigate('/ring-builder', {
      state: {
        description: translated
      }
    });

  } else {
    alert('Please describe your dream ring!');
  }
};

  const handleTakeMeToDesigner = () => {
    navigate('/ring-builder');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-4xl leading-tight">
          Design your custom engagement ring with AI
        </h1>
        
        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
          Build your perfect engagement ring online in our easy-to-use design tool
        </p>

        {/* Input Box - styled like modern design tools */}
        <div className="w-full max-w-2xl mb-6">
          <div className="relative">
            <input
              type="text"
              value={ringDescription}
              onChange={(e) => setRingDescription(e.target.value)}
              placeholder="Design me a yellow gold 2 carat round solitaire ring with..."
              className="w-full px-6 py-4 text-gray-800 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-base md:text-lg placeholder-gray-400"
            />
          </div>
        </div>

        {/* Create my ring Button */}
        <button
          onClick={handleCreateRing}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 mb-8"
        >
          Create my ring
        </button>

        {/* Visit Link */}
        <div className="mt-2">
          <button
            onClick={handleTakeMeToDesigner}
            className="text-white border-b border-white/50 hover:border-white pb-0.5 text-base md:text-lg transition duration-150 font-medium"
          >
            Take me to the ring designer
          </button>
        </div>

        {/* Small activation hint - purely aesthetic from original */}
        <div className="absolute bottom-4 right-4 text-white/40 text-xs hidden sm:block">
          Activate Windows
        </div>
      </div>
    </div>
  );
};

export default HomePage;