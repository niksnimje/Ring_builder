import React from 'react';
import { Html } from "@react-three/drei";

const Loader = () => {
  return (
    <Html center zIndexRange={[1, 0]}>
    <div className="flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-75 z-20">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        <p className="text-white mt-4 text-lg">Loading...</p>
      </div>
    </div>
    </Html >
  );
};

export default Loader;






// import React from 'react';
// import { Html } from "@react-three/drei";

// const Loader = () => {
//   return (
//     <Html center>
//       <div className="flex flex-col items-center justify-center ">
//         {/* Diamond Animation Container */}
//         <div className="relative flex items-center justify-center">
          
//           {/* Main Diamond Shape */}
//           <div className="w-12 h-12 bg-blue-400 rotate-45 animate-pulse shadow-[0_0_20px_rgba(147,197,253,0.8)] relative">
//             {/* Diamond Sparkle Effect */}
//             <div className="absolute inset-0 bg-white opacity-30 animate-ping"></div>
//           </div>

//           {/* Outer Rotating Ring (Jewelry vibe) */}
//           <div className="absolute w-20 h-20 border-t-2 border-r-2 border-blue-200 rounded-full animate-spin"></div>
          
//           {/* Static Outer Ring for depth */}
//           <div className="absolute w-20 h-20 border-2 border-white opacity-10 rounded-full"></div>
//         </div>

//         {/* Branding Text */}
//         <div className="mt-10 text-center">
//           <h2 className="text-white text-xl font-light tracking-[0.3em] uppercase">
//             Loading Ring
//           </h2>
//           <div className="flex justify-center gap-1 mt-2">
//             <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
//             <span className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
//             <span className="w-1.5 h-1.5 bg-blue-200 rounded-full animate-bounce"></span>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes shine {
//           0% { transform: translateX(-100%) rotate(45deg); }
//           100% { transform: translateX(100%) rotate(45deg); }
//         }
//       `}</style>
//     </Html>
//   );
// };

// export default Loader;