export function getRandomElementFromArray(array: Array<any>): string {
  return `${array[Math.floor(Math.random() * array.length)]}`;
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