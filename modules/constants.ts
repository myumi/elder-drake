export const prefix = '!elder';
export const region = 'en-US';
export const basePath =  'http://cdn.merakianalytics.com/riot/lol/resources/latest';

export type AbilityQuery = 'q' | 'w' | 'e' | 'r' | 'ult' | 'ultimate' | 'p' | 'passive';
export interface ErrorMessage {
  type: string,
  message: string
};
export interface Embed {
  // color?: string;
  // author?: {name: string, image?: string, url?: string};
  // timestamp?: boolean;
  // footer?: {text: string, image?: string}
  title?: string;
  description?: string;
  fields?: Array<{name: string, value: string, inline?: boolean}>;
  image?: string;
  thumbnail?: string;
  url?: string;
};
export interface Stats {
  abilityPower: Stat;
  armor: Stat;
  attackDamage: Stat;
  attackSpeed: Stat;
  cooldownReduction: Stat;
  criticalStrikeChance: Stat;
  goldPer_10: Stat;
  healAndShieldChance: Stat;
  health: Stat;
  healthRegen: Stat;
  lethality: Stat;
  lifesteal: Stat;
  magicPenetration: Stat;
  magicResistance: Stat;
  mana: Stat;
  manaRegen: Stat;
  movespeed: Stat;
  abilityHaste: Stat;
  omnivamp: Stat;
  tenacity: Stat;
};
export interface Stat {
  flat: number;
  percent: number;
  perLevel: number;
  percentPerLevel: number;
  percentBase: number;
  percentBonus: number;
};
export interface Skin {
  name: string;
  id: number;
  isBase: boolean;
  availability: string;
  formatName: string;
  lootEligible: true;
  cost: number | string;
  sale: number;
  distribution: string | null;
  rarity: string;
  chromas: Array<Chroma>;
  lore: string;
  release: string;
  set: Array<string>;
  splashPath: string;
  uncenteredSplashPath: string;
  tilePath: string;
  loadScreenPath: string;
  loadScreenVintagePath: string | null;
  newEffects: boolean;
  newAnimations: boolean;
  newRecall: boolean;
  newVoice: boolean;
  newQuotes: boolean;
  voiceActor: Array<string>;
  splashArtist: Array<string>;
};
export interface Chroma {
  name: string;
  id: number;
  chromaPath: string;
  colors: Array<string>;
  descriptions: {
    description: string | null;
    region: string | null;
  };
  rarities: {
    rarity: number;
    region: string;
  }
};