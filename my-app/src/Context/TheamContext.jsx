// ThemeContext.jsx
import { createContext, useContext, useState } from "react";

 const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeClass, setThemeClass] = useState(
    "bg-gradient-to-b from-gray-100 via-gray-200 to-gray-500"
    
  );

  return (
    <ThemeContext.Provider value={{ themeClass, setThemeClass }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);