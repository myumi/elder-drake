function searchAbility(champName, key) {
  // search champ name 
  // return data on ability k mentioned
}

function searchSkins(champName) {
  // display list and images of skins for certain champ
}

function freeChampRotation() {
  // return list of champions in formatted string that are available for free rotation
}

// normalize name for api
function isWukong(champName) {
  if (champName === `wukong`) return `MonkeyKing`
  else if (champName === `mundo`) return `DrMundo`
  else if (champName === `nunu & willump`) return `Nunu`
  else if (champName === `jarvan` || champName === `j4`) return `JarvanIV`
  else if (champName === `kogmaw`) return `KogMaw`
  return champName
    .replace(`'`, ``)
    .split(` `)
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(``);
}