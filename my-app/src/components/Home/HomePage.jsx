// HomePage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [ringDescription, setRingDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Auto-focus input box when page loads
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleCreateRing = async () => {
    if (ringDescription.trim()) {
      // Start loading animation
      setIsLoading(true);
      
      // Simulate AI processing with 2.5 seconds delay
      setTimeout(() => {
        setIsLoading(false);
        // Navigate after loading completes
        navigate('/ring-builder', {
          state: {
            description: ringDescription
          }
        });
      }, 2500);
    } else {
      alert('Please describe your dream ring!');
    }
  };

  const handleTakeMeToDesigner = () => {
    navigate('/ring-builder');
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleCreateRing();
    }
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
              ref={inputRef}
              type="text"
              value={ringDescription}
              onChange={(e) => setRingDescription(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Design me a yellow gold 2 carat round solitaire ring with..."
              className="w-full px-6 py-4 text-gray-800 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-base md:text-lg placeholder-gray-400"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Create my ring Button with Loading Animation */}
        <button
          onClick={handleCreateRing}
          disabled={isLoading}
          className={`
            relative bg-yellow-600 hover:bg-yellow-700 text-white font-semibold 
            py-3 px-8 rounded-full text-lg shadow-lg transition duration-200 
            ease-in-out transform hover:scale-105 focus:outline-none 
            focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 mb-8
            ${isLoading ? 'cursor-not-allowed opacity-90' : ''}
          `}
        >
          {isLoading ? (
            <div className="flex items-center space-x-3">
              {/* Spinner Animation */}
              <div className="relative">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
              <span className="flex items-center space-x-1">
                <span>AI is designing your dream ring</span>
                <span className="animate-pulse">.</span>
                <span className="animate-pulse delay-100">.</span>
                <span className="animate-pulse delay-200">.</span>
              </span>
            </div>
          ) : (
            'Create my ring'
          )}
        </button>

        {/* AI Processing Message - Shows only during loading */}
        {isLoading && (
          <div className="mt-4 animate-fadeIn">
            <div className="bg-black/50 backdrop-blur-md rounded-2xl px-6 py-3 inline-flex items-center space-x-3">
              <div className="relative">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full absolute top-0 animate-pulse"></div>
              </div>
              <span className="text-white/90 text-sm">
                Analyzing your preferences...
              </span>
            </div>
          </div>
        )}

        {/* Visit Link */}
        <div className="mt-2">
          <button
            onClick={handleTakeMeToDesigner}
            className="text-white border-b border-white/50 hover:border-white pb-0.5 text-base md:text-lg transition duration-150 font-medium"
            disabled={isLoading}
          >
            Take me to the ring designer
          </button>
        </div>

        {/* Small activation hint - purely aesthetic from original */}
        <div className="absolute bottom-4 right-4 text-white/40 text-xs hidden sm:block">
          Activate Windows
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .delay-100 {
          animation-delay: 100ms;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
};

export default HomePage;