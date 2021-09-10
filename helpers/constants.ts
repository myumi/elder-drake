export const prefix = '!';
export const region = 'en-US';
export const basePath =  'http://cdn.merakianalytics.com/riot/lol/resources/latest';

export type ChampionQuery = 'q' | 'w' | 'e' | 'r' | 'ult' | 'ultimate' | 'p' | 'passive' | 'skins';
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
}

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
}

export interface Stat {
  flat: number;
  percent: number;
  perLevel: number;
  percentPerLevel: number;
  percentBase: number;
  percentBonus: number;
}

// they're actually numbers but we use them as strings
export interface Modifiers {
  modifiers: Array<{
    values: Array<string>
    units: Array<string>
  }>
}