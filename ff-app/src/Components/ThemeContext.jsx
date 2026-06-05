import { createContext, useState, useContext } from 'react';

// define getTheme here
export const getTheme = (darkMode) => ({
  accent:         darkMode ? "#DFFF00"  : "#5a8a00",   // darker accent for light mode readability
  pageBg:          darkMode ? "#000000" : "#f5f6f8",
  cardBg:          darkMode ? "#1a1a1a" : "#ffffff",
  cardBorder:      darkMode ? "#2a2a2a" : "#d9dce2",
  inputBorder:     darkMode ? "#444"    : "#c7cad1",
  text:            darkMode ? "#ffffff" : "#111827",
  muted:           darkMode ? "#888"    : "#5f6570",
  watermark:       darkMode ? "#2a2a2a" : "#d9dce2",
  securityNoteBg:  darkMode ? "#111"    : "#f0f2f5",
  selectBg:        darkMode ? "#333333" : "#f0f2f5",
  toggleOffBg:     darkMode ? "#444"    : "#c7cad1",
  toggleOffKnob:   darkMode ? "#888"    : "#ffffff",
  toggleNotDone:   darkMode ? "#F6FFC0" : "black",
  toggleDone:      darkMode ?  "black"    :  "#F6FFC0",
  tansparentBG:    darkMode ?  'rgba(0,0,0,0.3)'  :  '#f6ffc090',
  sidebar:           darkMode ? "#1a1a1a"    : "#636363",
  subheader:           darkMode ?  "#636363": "#1a1a1a" ,


});

export const ThemeContext = createContext(null);

export const FONT_SCALE = {
  COMPACT:     { fontSize: "0.85rem", lineHeight: 1.0 },
  STANDARD:    { fontSize: "1rem",    lineHeight: 1.5 },
  COMFORTABLE: { fontSize: "1.15rem", lineHeight: 2.0 },
};

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(true);
  const [fontDensity, setFontDensity] = useState("STANDARD");
  const [alertTime, setAlertTime] = useState("06:30");
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const fontScale = FONT_SCALE[fontDensity] ?? FONT_SCALE.STANDARD;
  const theme = getTheme(darkMode);

  return (
    <ThemeContext.Provider value={{ theme, darkMode, setDarkMode, fontDensity, setFontDensity, fontScale, alertTime, setAlertTime, workoutReminders, setWorkoutReminders   }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

