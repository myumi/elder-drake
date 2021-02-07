const Discord = require('discord.js')
const axios = require('axios')

const client = new Discord.Client()
const prefix = '!' 
const region = 'en_US'
const itemsPath = 'http://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/items.json'
let basePath =  'http://cdn.merakianalytics.com/riot/lol/resources/latest'
let items = new Map()

client.on('ready', () => { 
  // assign all item items to map to have them searched by name 
  getItems()
});

// make request to get version every 24 hours

// api path
// display item details
// display champ details (type, name, image, abilities)
// display ability details and improvements with each level
// display free champ rotation every week (can turn on or off)
// display all skins for specific champion


// !elder miss fortune skins
// !elder skins miss fortune
client.on('message', msg => {  
    if (msg.author.bot) return;

    // make entire message lowercase for easier searching
    msg = msg.toLowerCase();
    // NOTE: will need to camel case names
    // ex: miss fortune should become MissFortune
    // nunu & willump should just be 'Nunu'
    // use isWukong on champname

    // if message contains command
    if (msg.contains(`${prefix}elder`)) {  
      // remove elder command from message
      msg = msg.replace(`${prefix}elder`, '')

      // if user wants to see skins
      if (msg.contains(`${prefix}skins`)) {
        // remove skins command from message
        msg = msg.replace(`${prefix}skins`, '')

        // search skins for remaining text
        if (searchChampion(msg.split(' ')[1])) {
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
});

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
function searchItem(itemName) {
  if (items.has(itemName)) {
    const id = items[itemName]
  
    if (id) {
      // return formatted string of item data
      axios.get(itemPath)
      .then(json => json.json())
      .then(data => {
        const item = data[id]

        // build formatted string
      })
    }
  }
  return undefined
}
function searchAbility(champName, key) {
  // search champ name 
  // return data oh ability k mentioned
}
function searchSkins(champName) {
  // display list and images of skins for certain champ
}
function freeChampRotation() {
  // return list of champions in formatted string that are available for free rotation
}

function getItems() {
  data.keys().forEach(key => {
    items.set(data[key].name, key)
  })
}

function isWukong(champName) {
  if (champName === 'wukong') return 'MonkeyKing'
  else if (champName === 'mundo') return 'DrMundo'
  else if (champName === 'nunu & willump') return 'Nunu'
  else if (champName === 'jarvan' || champName === 'j4') return 'JarvanIV'
  else if (champName === 'kogmaw') return 'KogMaw'
  return champName
    .replace(`'`, '')
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join('');
}

client.login(process.env.TOKEN);