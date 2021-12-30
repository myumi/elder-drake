import { MessageEmbed } from 'discord.js';
import { Embed } from '../constants';
import { championNames } from '../init';
import { constructEmbedMessage } from './normalMessageGeneration';

export function constructErrorMessage(type: string, message: string): MessageEmbed {
  const embedMessage: Embed = {
    title: 'Oh, woof.',
    description: generateErrorMessage(),
    fields: [{
      name: type, 
      value: message
    }],
  };

  return constructEmbedMessage(embedMessage);
}

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

  return `${getRandomElementFromArray([`Your team's`, `The enemy team's`])} ${getRandomRole()} ${getRandomChampion()} ${getRandomElementFromArray(leagueThings)}. You feel ${getEmotionString()}.`;
}

function generateItemMessage(): string {
  return `You are feeling ${getEmotionString()} about ${getRandomElementFromArray(['your', `your team's ${getRandomChampion()}`, `the enemy team's ${getRandomChampion()}`])} ${'(leagueItem)'}`;
}

function generateBuffMessage(): string {
  const prizes = [
    'Mountain Soul smite',
    'Fire Soul smite',
    'Cloud Soul smite',
    'Ocean Soul smite',
    'cannon minion',
    'baron buff',
    'your ultimate by a pixel',
  ];

  return `You miss the ${getRandomElementFromArray(prizes)}. You are feeling ${getEmotionString()}.`;
}

function generateDragonMessage(): string {
  const dragonThings = [
    'executes you at half health',
    'de-aggros for no reason',
    'aggros for not reason',
    'sticks its tongue out at you'
  ]
  // 4. The elder drake (does dragon thing). You look at it (emotion-fully).
  return `The elder drake ${getRandomElementFromArray(dragonThings)}. You look at it with ${getEmotionString()}.`;
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

  return `${getRandomElementFromArray(emphasis)} ${getRandomElementFromArray(emotions)}`;
}

function getRandomChampion(): string {
  return getRandomElementFromArray(championNames);
}

function getRandomRole(): string {
  const roles = [
    'top lane', 'ADC', 'mid', 'jungle', 'support', ''
  ];

  return getRandomElementFromArray(roles);
}

export function getRandomElementFromArray(array: Array<any>): string {
  return `${array[Math.floor(Math.random() * array.length)]}`;
}
