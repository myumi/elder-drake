const Discord = require(`discord.js`)
const axios = require(`axios`)
const path = require(`path`)
const { searchItem, getItems } = require(path.join(__dirname, `items.js`))

const client = new Discord.Client()
const prefix = `!` 
const region = `en_US`
let basePath =  `http://cdn.merakianalytics.com/riot/lol/resources/latest`

client.on(`ready`, () => { 
  // assign all item items to map to have them searched by name 
  getItems()
})

// api path
// display item details
// display champ details (type, name, image, abilities)
// display ability details and improvements with each level
// display free champ rotation every week (can turn on or off)
// display all skins for specific champion


// !elder miss fortune skins
// !elder skins miss fortune
// !elder itemName
// !elder championName
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
      // if nothing found
      else return notFoundMessage();
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

function notFoundMessage() {
  // send a fun message if no results are found for search

  // 1. (Your team's|The enemy team's) (top lane|ADC|support|jungle|'') (champName) (does league thing). You are (emotion).
  // 2. You are feeling (emotion) about (your|your team's (champ)|the enemy team's (champ)) (leagueItem).
  // 3. You miss the (mountain?fire?ocean) soul|cannon minion|baron buff). You are feeling (emotion).
  // 4. The elder drake (does dragon thing). You look at it (emotion-ly).
  // No results for your search query! Make sure the spelling is correct.
}

client.login(process.env.TOKEN);