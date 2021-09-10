import fetch from 'node-fetch';
import { region, basePath, ErrorMessage, Embed, Stats, Stat } from '../helpers/constants';

let itemsById = new Map();
let itemsByName = new Map();

// update item maps
export function getItems(): void {
  fetch(`${basePath}/${region}/items.json`)
    .then(data => {
      console.log('items:', data);
      return data.json();
    })
    .catch(err => {
      console.error(err);
    })
    .then(items => {
      // i hate this
      Object.keys(items).forEach((key) => {
        itemsById.set(items[key].id, items[key].name)
        itemsByName.set(items[key].name, items[key].id)
      })
    })
}

// takes item by name or id and returns built message string or error message
export function findItem(item: string): Embed | ErrorMessage {
  let itemID = item;
  const error = {
    type: 'Not Found',
    message: `The item you were searching for wasn't found in the database. Are you sure it's spelled correctly?`,
  };

  // if item not a number, get the number id
  if (!Number.isInteger(itemID)) {
    if (itemsByName.has(itemID)) {
      itemID = itemsByName.get(item);
    } else {
      itemID = isShorthandItemName(itemID);
    }
  }

  if (Number.isInteger(itemID)) {
    return buildItemMessage(itemID);
  }
  
  return error;
}

function isShorthandItemName(item: string): string {
  // check if item exists in map
  const shorthandLookup: Map<string, string> = new Map([
    ['yellow trinket', '3340'],
    ['red trinket', '3364'],
    ['blue trinket', '3363'],
    ['pink ward', '2055'],
    ['runaans', '3085'],
    ['ie', '3031'],
    ['locket', '3190'],
    ['dc', '3089'],
    ['cap', '3089'],
    ['hat', '3089'],
    ['bork', '3153'],
    ['botrk', '3153'],
    ['bt', '3072'],
    ['ffg', '6662'],
    ['ibg', '6662'],
    ['gauntlet', '6662'],
    ['pd', '3046'],
    ['qss', '3140'],
    ['merc treads', '3111'],
    ['mobi boots', '3117'],
    ['mobis', '3117'],
    ['bf sword', '1038'],
    ['pot', '2003'],
    ['potion', '2003'],
    ['biscuit', '2010'],
    ['refillable pot', '2031'],
    ['corrupting pot', '2033'],
    ['ga', '3026'],
    ['mejais', '3041'],
    ['tear', '3070'],
    ['guinsoos', '3124'],
    ['zhonya', '3157'],
    ['zhonyas', '3157'],
    ['hourglass', '3157'],
  ]);

  if (shorthandLookup.has(item)) {
    return shorthandLookup.get(item)!;
  }

  return item;
}

// takes the stats object and finds properties with value
// returns formatted string of stat changes
function traverseItemStats(stats: Stats): Array<Array<string | number>> {
  let statArray = []

  // for each stat... so ugly 
  // get all stats that have a value in an attribute
  for (const statAttribute in stats) {
    if (stats.hasOwnProperty(statAttribute)) {
      const stat = stats[statAttribute as keyof Stats];

      // iterate through each stat object's values
      for (const value in stat) {
        if (stat.hasOwnProperty(value) && stat[value as keyof Stat]) {
          // if that item has a value > 0 add it to the array
          statArray.push([value, stat[value as keyof Stat]]);
        }
      }
    }
  }

  return statArray;
}

export function buildItemMessage(item: string): Embed | Error {
  const error = {
    type: 'Not Found',
    message: `The item you were searching for wasn't found in the database. Are you sure it's spelled correctly?`,
  }
  // return formatted string of item data
  fetch(`${basePath}/${region}/items/${item}.json`)
  .then(data => data.json())
  .then(itemJSON => {
    const title = itemJSON.name;
    const gold = `${itemJSON.shop.prices.total} Gold`;

  })
  .catch(err => {
    return error;
  });
}