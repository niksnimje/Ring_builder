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
      keywords: ["square", "chokor", "choras", "chorash", "coras"],
      value: "Princess",
    },
    {
      keywords: ["oval", "ovul", "andakar", "anda", "egg", "egg shape", "lambu gol", "lambugol"],
      value: "Oval",
    },
    {
      keywords: ["love shape", "dil", "haday", "heart", "ruday", "love sahpe", "love sape"],
      value: "Heart",
    }
  ],

  styles: [
    {
      keywords: ["pave", "peve", "small stones", "heera wala band", "bharela"],
      value: "Pave",
    },
    {
      keywords: ["halo", "helo", "border", "ghera", "frame"],
      value: "Halo",
    },
    {
      keywords: ["solitaire", "soliter", "single stone", "ek pathar", "aklo", "single heera"],
      value: "Solitaire",
    },
  ],

  weights: [
    {
      keywords: ["1 carat", "1 ct", "1.0 ct", "1 point", "1 point zero", "one carat", "one ct"],
      value: 1.0,
    },
    {
      keywords: ["1.5 carat", "1.5 ct", "one point five", "sava carat", "dedh carat"],
      value: 1.5,
    },
    {
      keywords: ["2 carat", "2 ct", "two carat", "do ct", "2ct"],
      value: 2.0,
    },
    {
      keywords: ["3 carat", "3 ct", "3.0 ct", "three carat", "three ct", "teen carat", "3ct"],
      value: 3.0,
    },
    {
      keywords: ["4 carat", "4 ct", "4.0 ct", "four carat", "four ct", "chaar carat", "4ct"],
      value: 4.0,
    },
    {
      keywords: ["5 carat", "5 ct", "5.0 ct", "five carat", "five ct", "paanch carat", "5ct"],
      value: 5.0,
    },
    {
      keywords: ["0.25 carat", "0.25 ct", "quarter carat", "pauna carat", "point twenty five"],
      value: 0.25,
    },
    {
      keywords: ["0.5 carat", "0.5 ct", "half carat", "aadha carat", "point five"],
      value: 0.5,
    },
    {
      keywords: ["0.75 carat", "0.75 ct", "three quarter", "pona carat", "point seventy five"],
      value: 0.75,
    },
  ],

};


// 🔥 NORMALIZE TEXT
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/ni|nahi|nathi|not|dont|don't/g, "not")
    .replace(/joye|chahiye|want/g, "want")
    .replace(/choras|chorash|square|sqare|suare|chokor/g, "square")
    .replace(/love shape|dil|heart|ruday|haday/g, "heart")
    .replace(/lal|rose|pink|gulabi|red/g, "red")
    .replace(/pila|pilo|pivdo|soneri|sona|golden|gold|yellow/g, "yellow")
    .replace(/safed|silver|chandi|cilver|no color|gray|grey|gry|white/g, "white")
    .replace(/hase to chalse|optional/g, "optional")
    .replace(/1 carat|1 ct|1\.0 ct|one carat|one ct/g, "1 carat")
    .replace(/1\.5 carat|1\.5 ct|one point five|sava carat|dedh carat/g, "1.5 carat")
    .replace(/2 carat|2 ct|two carat|do ct/g, "2 carat")
    .replace(/3 carat|3 ct|3\.0 ct|three carat|teen carat/g, "3 carat")
    .replace(/4 carat|4 ct|4\.0 ct|four carat|chaar carat/g, "4 carat")
    .replace(/5 carat|5 ct|5\.0 ct|five carat|paanch carat/g, "5 carat")
    .replace(/0\.5 carat|0\.5 ct|half carat|aadha carat|point five/g, "0.5 carat")
    .replace(/0\.25 carat|0\.25 ct|quarter carat|pauna carat/g, "0.25 carat")
    .replace(/0\.75 carat|0\.75 ct|three quarter|pona carat/g, "0.75 carat")
    .replace(/emerald|patti cut|lambachoras/g, "emerald")
    .replace(/pear|water drop|tipu|aansoo/g, "pear")
    .replace(/cushion|takiya cut/g, "cushion")
    .replace(/marquise|markis|nav|boat shape/g, "marquise")
    .replace(/radiant|rediant/g, "radiant")
    .replace(/asscher|ascher|acher/g, "ascher")
    .replace(/mixture|mix shape|khichdi/g, "mix")
};

// 🔥 INTENT DETECT
const detectIntent = (text) => {
  if (text.includes("not")) return "reject";
  if (text.includes("optional")) return "optional";
  if (text.includes("want")) return "select";
  return "neutral";
};

// 🔥 SMART PARSER
export const inputChecker = (text) => {
  const normalized = normalizeText(text);

  const parts = normalized.split(/,|and|but/);

  let result = {
    bandColor: null,
    prongColor: null,
    shape: null,
    style: null,
    weight: null
  };

  for (let part of parts) {
    const intent = detectIntent(part);

    // 🎨 COLOR
    for (let rule of rules.colors) {
      for (let keyword of rule.keywords) {
        let startIndex = 0;

        while (true) {
          const index = part.indexOf(keyword, startIndex);
          if (index === -1) break;

          // 🔥 window before + after
          const before = part.slice(Math.max(0, index - 10), index);
          const after = part.slice(index, index + 10);

          if (before.includes("not") || after.includes("not")) {
            startIndex = index + keyword.length;
            continue;
          }

          // ✅ valid color
          result.bandColor = rule.value;
          result.prongColor = rule.value;

          startIndex = index + keyword.length;
        }
      }
    }

    // 💎 SHAPE
    for (let rule of rules.shapes) {
      if (rule.keywords.some((k) => part.includes(k))) {
        result.shape = rule.value;
      }
    }

    // ⚙️ STYLE
    for (let rule of rules.styles) {
      if (rule.keywords.some((k) => part.includes(k))) {
        if (intent !== "reject") {
          result.style = rule.value;
        }
      }
    }

    for (let rule of rules.weights) {
      for (let keyword of rule.keywords) {
        if (part.includes(keyword)) {
          result.weight = rule.value;
        }
      }
    }

  }

  return result;
};