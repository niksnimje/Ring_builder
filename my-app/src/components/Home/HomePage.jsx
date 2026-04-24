export const rules = {
  colors: [
    {
      keywords: ["red", "lal", "rose", "pink"],
      value: "#f1a886",
    },
    {
      keywords: ["silver", "chandi", "white", "safed", "gray"],
      value: "#B8B4B9",
    },
    {
      keywords: ["gold", "yellow", "sona", "pila"],
      value: "#E6BE5A",
    },
  ],

  shapes: [
    {
      keywords: ["round", "gol"],
      value: "Round",
    },
    {
      keywords: ["square", "chokor","choras" ,"chorash" ,"coras"],
      value: "Princess",
    },
    {
      keywords: ["oval"],
      value: "Oval",
    },
  ],

  styles: [
    {
      keywords: ["pave"],
      value: "Pave",
    },
    {
      keywords: ["halo"],
      value: "Halo",
    },
    {
      keywords: ["solitaire"],
      value: "Solitaire",
    },
  ],
};


// 🔥 MAIN FUNCTION
export const inputChecker = (text) => {
  const lower = text.toLowerCase();

  let result = {
    bandColor: null,
    prongColor: null,
    shape: null,
    style: null,
  };

  // 🎨 COLOR
  for (let rule of rules.colors) {
    if (rule.keywords.some(word => lower.includes(word))) {
      result.bandColor = rule.value;
      result.prongColor = rule.value;
      break;
    }
  }

  // 💎 SHAPE
  for (let rule of rules.shapes) {
    if (rule.keywords.some(word => lower.includes(word))) {
      result.shape = rule.value;
      break;
    }
  }

  // ⚙️ STYLE (SHANK)
  for (let rule of rules.styles) {
    if (rule.keywords.some(word => lower.includes(word))) {
      result.style = rule.value;
      break;
    }
  }

  return result;
};