export function normalizeChampionName(championName: string): string {
  const nicknames: any = {
    'mundo': 'Mundo',
    'jarvan': 'Jarvan IV',
    'j4': 'Jarvan IV',
    'kogmaw': 'Kog\'Maw',
    'reksai': 'Rek\'Sai',
    'tf': 'Twisted Fate',
    'asol': 'Aurelion Sol',
    'yi': 'Master Yi',
    'akechi': 'Kayn',
    'mord': 'Mordekaiser',
    'rhaast': 'Kayn',
    'powder': 'Jinx',
    'violet': 'Vi',
    'cait': 'Caitlyn',
    'ez': 'Ezreal',
    'cupcake': 'Caitlyn',
    'best boy': 'Kayn',
    'best girl': 'Rek\'Sai',
    'nunu': 'Nunu & Willump',
  }

  if (nicknames.hasOwnProperty(championName)) {
    return nicknames[championName];
  }

  return capitalizeWordsInString(championName);
}

export function normalizeChampionNameForAPI(championName: string): string {
  const nicknames: any = {
    'wukong': 'MonkeyKing',
    'mundo': 'DrMundo',
    'jarvan': 'JarvanIV',
    'j4': 'JarvanIV',
    'nunu & willump': 'Nunu',
  }

  if (nicknames.hasOwnProperty(championName)) {
    return nicknames[championName];
  }

  // remove symbols and make title-cased
  return titleCase(championName);
}

export function normalizePriceProperty(property: string): string {
  if (property === 'rp') {
    return 'RP';
  } else if (property === 'saleRp') {
    return 'Sale RP';
  }
  return normalizeNameString(property);
}

// miss fortune -> MissFortune
export function titleCase(string: string): string {
  return string.replace(`'`, ' ')
  .replace(/_/g, ' ')
  .split(' ')
  .map((split) => capitalizeWordsInString(split))
  .join('')
  .trim();
}

export function capitalizeWordsInString(string: string): string {
  let words = string.split(' ');
  words = words.map(word => { 
    return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
  });

  return words.join(' ');
}

export function normalizeNameString(name: string): string {
  if (name === name.toUpperCase()) {
    name = name.toLowerCase();
  }

  name = name
    .replace(/p(i)ercent/g, '%')
    .replace(/([A-Z]|[%])/g, ' $1')
    .replace(/.0/g, '')
    .replace(/_/g, ' ')
    .replace(/'/g, '');
  
  if (name.includes(' ')) {
    name = name.split(' ') 
    .map((split) => capitalizeWordsInString(split))
    .join(' ')
    .trim();
  } else {
    name = capitalizeWordsInString(name);
  }
  
  return name;
}

export function formatPrestigeSkinNames(skinName: string): string {
  if (skinName.includes('prestige')) {
    return 'prestige';
  }
  return skinName;
}