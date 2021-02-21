const itemsById = new Map()
const itemsByName = new Map()

// get all items, called every X amount of time?
// assign the names to their id in a map
// use the map for querying items instead of api
// update item maps
function getItems() {
  axios.get(`${basePath}/${region}/items.json`)
    .then(json => {
      console.log(json)
      return json.json()
    })
    .catch(err => {
      // send oh fuck message
      console.error(err)
    })
    .then(data => {
      Object.keys(data).forEach(key => {
        itemsById.set(data[key].id, data[key].name)
        itemsByName.set(data[key].name, data[key].id)
      })
    })
}

// search through maps to get item id
// ping api for item data
// returns built item string
export default function searchItem(item) {
  if (!Number.isInteger(item)) {
    item = isShorthand(item)
    if (itemsByName.has(item)) {
      const item = itemsByName[item]
    } else {
      return undefined
    }
  }
  // return formatted string of item data
  axios.get(`${basePath}/${region}/items/${item}.json`)
    .then(json => json.json())
    .then(data => {
      return buildItemString(data)
    })
}

// builds message string
function buildItemString(data) {
  // Item Name, {icon} *Gold*
  // **Builds Into** item, item, and item
  // **Builds From** item, item, and item
  // **Stats**
  // {icon} stat
  // ...
  // Active: sakdjas
  // (Non-/Unique) Passive: adkhasdk

  // todo if time is up OR check that maps are filled
  getItems()

  // get base info
  const { name, buildsFrom, buildsInto, passives, active, effects, stats } = data
  const itemDetailsMessage = `${name}, ${data.shops.price} *Gold*\n`

  // items this item is built from
  if (buildsFrom.length) {
    const names = buildsFrom.map(itemID => itemsById[itemID])
    const list = names.join(`, `)

    itemDetailsMessage += `**Builds from** ${list}\n`
  }

  // items this item builds into
  if (buildsInto.length) {
    const names = buildsInto.map(itemID => itemsById[itemID])
    const list = names.join(`, `)
  
    itemDetailsMessage += `**Builds into** ${list}\n`
  }

  // if effects property exist
  if (effects) {
    itemDetailsMessage += `**Stats**\n${effects}\n`
  } else {
    itemDetailsMessage += `**Stats**\n${traverseStats(stats)}\n`
  }

  // get detailed info if item has active
  if (active.length) {
    const { name, effects, cooldown } = active
    itemDetailsMessage += `Active: **${name}**, ${normalizeString(cooldown)} seconds.\n${effects}\n`
  }

  // get detailed info if item has passive
  if (passives.length) {
    if (passives.length > 1) {
      const passiveString = ``
      passives.forEach(passive => passiveString += `${passive.unique ? 'Unique' : '' } Passive: **${passive.name}**, ${passive.effects}\n`)
      itemDetailsMessage += `${passiveString.slice(0, -2)}\n`;
    } else {
      const { unique, name, effects } = passive
      itemDetailsMessage += `${unique ? 'Unique' : '' } Passive: **${name}**, ${effects}\n`
    }
  }

  return itemDetailsMessage
}

// todo: should actually repalce these with item ids....
function isShorthand(item) {
  // speed boots, armor boots, cooldown boots, merc treads, mobi boots
  // runaans
  // bork
  // zhonyas
  // IE
  // zekes
  // locket
  // stopwatch
  // lord dominiks
  // deathcap = dc, cap, hat
  // check if item exists in map
  const shorthandLookup = new Map()
  shorthandLookup.set('yellow trinket', 'Stealth Ward')
  shorthandLookup.set('red trinket', 'Oracle Lens')
  shorthandLookup.set('blue trinket', 'Farsight Alteration')
  shorthandLookup.set('speed boots', 'Berserker\'s Greaves')
  shorthandLookup.set('runaans', 'Runaan\'s Hurricane')
  shorthandLookup.set('IE', 'Infinity Edge')
  shorthandLookup.set('', '')

}

function normalizeString(string) {
  // replace 'percent' with %
  string = string.replace(/p(i)ercent/g, ' %')
  // add space in between camel cases words or %
  string = string.replace(/([A-Z]|[%])/g, ' $1').trim()
  // capitalize first letter
  string = string.charAt(0).toUpperCase() + string.slice(1)
  // remove '.0' from numbers
  string = string.replace(/.0/g, '')
  return string
}

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