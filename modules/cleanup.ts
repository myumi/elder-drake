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

// Simplify any name by lowercasing and removing apostrophes
export function simplifyName(itemName: string) {
  let simpleItemName = itemName.toLowerCase();
  return simpleItemName.replace(/'/,'');
}

// Normalize stat name for printing
export function normalizeStatName(statName: string): string {
  let normalizedStat = statName.split(/(?=[A-Z])/).join(" ");
  normalizedStat = (capitalizeWordsInString(normalizedStat));
  return normalizedStat;
}

// Normalize item name based on input
export function normalizeItemName(itemName: string): string {
  itemName = simplifyName(itemName);
  const nicknames: any = {
      'seal': 'Dark Seal',
      'red jungle': 'Emberknife',
      'blue jungle': 'Hailblade',
      'tear': 'Tear of the Goddess',
      'red ward': 'Control Ward',
      'blue trinket': 'Farsight Alteration',
      'farsight trinket': 'Farsight Alteration',
      'red trinket': 'Oracle Lens',
      'yellow trinket': 'Stealth Ward',
      'sweeper': 'Oracle Lens',
      'sweeping lens': 'Oracle Lens',
      'herald': 'Eye of the Herald',
      'dematerializer': 'Minion Dematerializer',
      'magic boots': 'Slightly Magical Boots',
      'buscuit': 'Total Biscuit of Everlasting Will',
      'swifties': 'Boots of Swiftness',
      'lucidity boots': 'Ionian Boots of Lucidity',
      'boots of lucidity': 'Ionian Boots of Lucidity',
      'merc treads': 'Mercurys Treads',
      'mercury treads': 'Mercurys Treads',
      'boots5': 'Mobility Boots',
      'mobi boots': 'Mobility Boots',
      'steelcaps': 'Plated Steelcaps',
      'sorc treads': 'Sorcerers Treads',
      'bf sword': 'B.F. Sword',
      'agility cloak': 'Cloak of Agility',
      'large rod': 'Needelessly Large Rod',
      'magic mantle': 'Null-Magic Mantle',
      'aegis': 'Aegis of the Legion',
      'cinder': 'Bamis Cinder'

          //TO BE CONTINUED

    }

    if (nicknames.hasOwnProperty(itemName)) {
      return simplifyName(nicknames[itemName]);
    }
  
    return itemName;
}