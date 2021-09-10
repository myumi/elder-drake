import { getRandomElement } from './helpers';

export default function generateErrorMessage(): string {
  const errorMessageGenerators = [
    generateTeamMessage,
    // generateItemMessage,
    generateBuffMessage,
    generateDragonMessage,
  ];
  const errorString = errorMessageGenerators[Math.floor(Math.random() * errorMessageGenerators.length)]();
  return errorString;
}

function generateTeamMessage(): string {
  // 1. (Your team's|The enemy team's) (top lane|ADC|support|jungle|'') (champName) (does league thing). You are (emotion).
  const leagueThings = [
    'rages then AFKs in base',
    'ults for no reason',
    'ganks you and misses everything',
    'spams their mastery after dying to a Teemo shroom',
    'tries to solo baron and dies instantly',
    'TPs to the minion next to them',
    'gets a pentakill',
    'has 22 CS at 15 minutes',
    'steals your red buff',
    'flashes for no reason',
    'steals the dragon',
    'has 82 Dark Harvest stacks',
    'tries to 1v4... again'
  ];

  return `${getRandomElement([`Your team's`, `The enemy team's`])} ${getRandomRole()} ${getRandomChampion()} ${getRandomElement(leagueThings)}. You feel ${getEmotionString()}.`;
}

function generateItemMessage(): string {
  // 2. You are feeling (emotion) about (your|your team's (champ)|the enemy team's (champ)) (leagueItem).
  return `You are feeling ${getEmotionString()} about ${getRandomElement(['your', `your team's (champ)`, `the enemy team's (champ)`])} ${'(leagueItem)'}`;
}

function generateBuffMessage(): string {
  // 3. You miss the (mountain?fire?ocean?cloud) soul|cannon minion|baron buff). You are feeling (emotion).
  const prizes = [
    'Mountain Soul smite',
    'Fire Soul smite',
    'Cloud Soul smite',
    'Ocean Soul smite',
    'cannon minion',
    'baron buff',
    'your ultimate by a pixel',
  ];

  return `You miss the ${getRandomElement(prizes)}. You are feeling ${getEmotionString()}.`;
}

function generateDragonMessage(): string {
  const dragonThings = [
    'executes you at half health',
    'de-aggros for no reason',
    'aggros for not reason',
    'sticks its tongue out at you'
  ]
  // 4. The elder drake (does dragon thing). You look at it (emotion-fully).
  return `The elder drake ${getRandomElement(dragonThings)}. You look at it with ${getEmotionString()}.`;
} 

function getEmotionString(): string {
  const emotions = [
    'anger', 'envy', 'fright', 'lust', 'pity', 'guilt', 
    'excitement', 'hatred', 'pain', 'humility', 'contentment', 'horror', 
    'remorse', 'optimism', 'bliss', 'passion', 'pleasure', 'shock', 'terror', 
    'hunger', 'smugness', 'irritation', 'sorrow', 'disappointment', 'longing', 
    'torment', 'ecstasy', 'happiness', 'despair', 'awe', 'melancholy', 
    'surprise', 'pride', 'fury', 'satisfaction', 'bewilderment', 'confusion', 
    'madness', 'contempt', 'shame', 'rage', 'sadness',
  ];

  const emphasis = [
    'incredible', 'undeniable', 'strange', 'slight', 'overwhelming', 'underwhelming',
    'unmatched', 'life-changing', 'complete and utter', 'extreme', 'vague',
  ]

  return `${getRandomElement(emphasis)} ${getRandomElement(emotions)}`;
}

function getRandomChampion(): string {
  const champNames = [
    'Teemo', 'Yuumi', 'Bard', 'Neeko',
    'Ezreal', 'Lux', 'Sona', 'Seraphine',
    'Sylas', 'Lulu',
  ];

  return getRandomElement(champNames);
}

function getRandomRole(): string {
  const roles = [
    'top lane', 'ADC', 'mid', 'jungle', 'support', ''
  ];

  return getRandomElement(roles);
}