function traversePassive(passive) {}
function traverseActive(active) {}
// takes the stats object and finds properties with value
// returns formatted string of stat changes
function traverseStats(stats) {
  const statString = ''
  // stats: { armor: { flat: 35.0, ... }, ...}
  // this loop gets 'armor'{}
  for (const stat in stats) {
    // this loop gets '35.0'
    for (const value in stat) {
      // there is a non zero value
      if (stat[value]) {
        const normalizedStat = normalizeString(stat)
        const normalizedValue = normalizeString(value)
        // add value to list
        // Armor: 35 Flat
        statString += `${normalizedStat}: ${stat[value]} ${normalizedValue}\n`
        // found value, leave stat
        break
      }
    }
  }
  return statString
}

function isShorthand(itemName) {
  // speed boots, armor boots, cooldown boots, merc treads, mobi boots
  // runaans
  // bork
  // zhonyas
  // IE
  // zekes
  // locket
  // red trinket
  // blue trinket
  // stopwatch
  // sweeper
  // lord dominiks
  // deathcap = dc, cap, hat
  if (itemName === ``) return 
}

function buildString(data) {
  // get base info
  const { name, buildsFrom, buildsInto, icon, passives, actives, stats } = data
  // get detailed info if item has passive
  if (passives.length) {

  }
  if (actives.length) {

  }

  // name
  // icon
  // builds into
  // builds from
  // stats
  // passive
  // active
}

function normalizeString(string) {
  // replace 'percent' with %
  string = string.replace(/p(i)ercent/g, ' %')
  // add space in between camel cases words or %
  string = string.replace(/([A-Z]|[%])/g, ' $1').trim()
  // capitalize first letter
  string = string.charAt(0).toUpperCase() + string.slice(1)
  return string
}