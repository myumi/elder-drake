// clean up string to be more readable
export function normalizeString(string: string): string {
  // an all caps string is weird to parse, but always one word so make it all lowercase
  if (string === string.toUpperCase()) {
    string = string.toLowerCase();
  }

  string = string
    .replace(/p(i)ercent/g, '%')
    .replace(/([A-Z]|[%])/g, ' $1')
    .replace(/.0/g, '')
    .replace(/_/g, ' ')
    .replace(/'/g, '');
  
  if (string.includes(' ')) {
    string = string.split(' ') 
    .map((split) => split.charAt(0).toUpperCase() + split.substring(1).toLowerCase())
    .join(' ')
    .trim();
  } else {
    string = string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
  }
  
  return string;
}

// get random element from array
export function getRandomElement(array: Array<any>): string {
  return array[Math.floor(Math.random() * array.length)];
}

// miss fortune -> MissFortune
export function titleCase(string: string): string {
  return string.replace(`'`, '')
  .replace(/_/g, ' ')
  .split(' ')
  .map((split) => split.charAt(0).toUpperCase() + split.substring(1).toLowerCase())
  .join('')
  .trim();
}

// checks last word for a ChampionQuery
export function includesAbility(string: string): boolean {
  if (
    string.includes(' q')
    || string.includes(' w')
    || string.includes(' e')
    || string.includes(' r')
    || string.includes(' ult')
    || string.includes(' ultimate')
    || string.includes(' passive')
    || string.includes(' p')
  ) {
    return true;
  }
  return false;
}