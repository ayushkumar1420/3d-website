export type Flavor = {
  id: string;
  name: string;
  shortName: string;
  color: string;
  secondary: string;
  tint: string;
  tagline: string;
  personality: string;
  taste: string;
  description: string;
  notes: readonly string[];
  highlights: readonly string[];
  profile: readonly [number, number, number];
  caffeine: number;
  label: string;
};

export const flavors: readonly Flavor[] = [
  {
    id: "original",
    name: "Original Energy",
    shortName: "Original",
    color: "#c1ff36",
    secondary: "#78b821",
    tint: "#1b260c",
    tagline: "The one that started it all.",
    personality: "Raw power.",
    taste: "Bold. Sweet. Unapologetic.",
    description:
      "A bright citrus spark. A bold, full-bodied finish. The original is made for the moments you refuse to let pass you by.",
    notes: ["Bright citrus", "Sweet finish", "Electric bite"],
    highlights: ["Carbonated water", "Citrus flavor", "B vitamins"],
    profile: [8, 6, 9],
    caffeine: 160,
    label: "ORIGINAL",
  },
  {
    id: "blue",
    name: "Ultra Blue",
    shortName: "Ultra Blue",
    color: "#64ddff",
    secondary: "#2878ed",
    tint: "#071d2f",
    tagline: "Cold as ice. Wide awake.",
    personality: "Frozen energy.",
    taste: "Cool. Crisp. Limitless.",
    description:
      "Cut through the noise with a rush of cool citrus and a clean, glacier-fresh finish. A little clarity in a world that never slows down.",
    notes: ["Cool citrus", "Fresh lime", "Clean finish"],
    highlights: ["Carbonated water", "Citrus flavor", "B vitamins"],
    profile: [4, 9, 7],
    caffeine: 150,
    label: "ULTRA BLUE",
  },
  {
    id: "mango",
    name: "Mango Rush",
    shortName: "Mango Rush",
    color: "#ffad32",
    secondary: "#ff5d20",
    tint: "#321809",
    tagline: "A little sunshine. A lot of wild.",
    personality: "Tropical explosion.",
    taste: "Golden. Juicy. Untamed.",
    description:
      "Sun-ripened mango meets a sharp citrus kick. All the warmth of a summer escape, with the volume turned all the way up.",
    notes: ["Ripe mango", "Tropical citrus", "Golden sweetness"],
    highlights: ["Carbonated water", "Mango flavor", "B vitamins"],
    profile: [9, 5, 8],
    caffeine: 160,
    label: "MANGO RUSH",
  },
  {
    id: "berry",
    name: "Berry Shock",
    shortName: "Berry Shock",
    color: "#d497ff",
    secondary: "#f244cf",
    tint: "#261035",
    tagline: "Made for after hours.",
    personality: "Electric nightlife.",
    taste: "Dark. Tart. Electric.",
    description:
      "A collision of dark berries and a bright, tart finish. For late-night ideas, neon-lit streets, and everything that happens after the ordinary.",
    notes: ["Blackcurrant", "Wild raspberry", "Tart finish"],
    highlights: ["Carbonated water", "Berry flavor", "B vitamins"],
    profile: [7, 3, 9],
    caffeine: 160,
    label: "BERRY SHOCK",
  },
  {
    id: "watermelon",
    name: "Watermelon Blast",
    shortName: "Watermelon",
    color: "#ff6b86",
    secondary: "#ef2949",
    tint: "#321016",
    tagline: "Summer has a wild side.",
    personality: "Fresh chaos.",
    taste: "Fresh. Juicy. Fearless.",
    description:
      "A wave of juicy watermelon with a crisp, refreshing edge. Bottle up that first-dive feeling and take it wherever your day goes.",
    notes: ["Fresh watermelon", "Pink sweetness", "Crisp finish"],
    highlights: ["Carbonated water", "Watermelon flavor", "B vitamins"],
    profile: [8, 4, 7],
    caffeine: 150,
    label: "WATERMELON",
  },
];

export const PROFILE_LABELS = ["Sweetness", "Citrus", "Intensity"] as const;
export const CAN_VOLUME = 500;
export const TRANSITION_DURATION = 1.15;
