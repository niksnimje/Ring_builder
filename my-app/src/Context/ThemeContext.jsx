// ThemeContext.jsx
import { createContext, useContext, useState } from "react";

 const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeClass, setThemeClass] = useState(
    // "bg-white"
    "bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#0f172a_40%,_#020617_100%)]"
  );

  return (
    <ThemeContext.Provider value={{ themeClass, setThemeClass }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);