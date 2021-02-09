const Discord = require(`discord.js`)
const axios = require(`axios`)

const client = new Discord.Client()
const prefix = `!` 
const region = `en_US`
let basePath =  `http://cdn.merakianalytics.com/riot/lol/resources/latest`

const itemsById = new Map()
const itemsByName = new Map()

client.on(`ready`, () => { 
  // assign all item items to map to have them searched by name 
  getItems()
})

// make request to get version every 24 hours

// api path
// display item details
// display champ details (type, name, image, abilities)
// display ability details and improvements with each level
// display free champ rotation every week (can turn on or off)
// display all skins for specific champion


// !elder miss fortune skins
// !elder skins miss fortune
client.on(`message`, msg => {  
    if (msg.author.bot) return;

    // make entire message lowercase for easier searching
    msg = msg.toLowerCase();
    // NOTE: will need to camel case names
    // ex: miss fortune should become MissFortune
    // nunu & willump should just be `Nunu`
    // use isWukong on champname

    // if message contains command
    if (msg.contains(`${prefix}elder`)) {  
      // remove elder command from message
      msg = msg.replace(`${prefix}elder`, ``)

      // if user wants to see skins
      if (msg.contains(`${prefix}skins`)) {
        // remove skins command from message
        msg = msg.replace(`${prefix}skins`, ``)

        // search skins for remaining text
        if (searchChampion(msg.split(` `)[1])) {
          // search for skins
        }
        // else post message that champ does not exist
        return;
      }
      // if user wants to see plain champ info
      else if (searchChampion(msg)) return;
      // if user wants to see item
      else if (searchItem(msg)) return;
      // if user wants to see ability
      else if (searchAbility(msg)) return;
    } 
})

function searchChampion(champName) {
  // http://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions/Aatrox.json
  axios.get(`${basePath}/${region}/champions/${champName}.json`)
    .then(json => json.json())
    .then(data => {
      `
      **${data.name}, ${data.title}**
      Type: ${data.tags[0]} & ${data.tags[1]}
      Base Health: ${data.stats.hp}
      *Abilities*
      Passive: ${data.passive.name}
      ${cleanLeagueData(data.passive.description)}

      Q: ${data.spells[0].name}
      ${data.spells[0].tooltip}
      `
    })
}

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
// returns data
function searchItem(item) {
  if (!Number.isInteger(item)) {
    item = isShorthand(item)
    if (itemsByName.has(item)) {
      const item = itemsByName[item]
    } else {
      // TODO: build no item found message
    }
  }
  // return formatted string of item data
  axios.get(`${basePath}/${region}/items/${item}.json`)
    .then(json => json.json())
    .then(data => {
      return data
    })
}

client.login(process.env.TOKEN);