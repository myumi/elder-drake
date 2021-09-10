// typescript compiler: npx tsc
import { Client, Message, MessageEmbed } from 'discord.js';
import { ChampionQuery, prefix } from './helpers/constants';
import { getChampionInformation } from './features/champions';
import { includesAbility } from './helpers/helpers';
import { makeEmbedMessage } from './helpers/messageMaker';
const client = new Client();

client.on('ready', () => {
  console.log('The elder drake is awake!');
});

client.on('message', (message: Message) => {
  if (message.author.bot) return;
  let { content } = message;
  content = content.toLowerCase().trim();

  // if just looking for list of commands
  if (content === `${prefix}elder` 
    || (content.startsWith(`${prefix}elder`) && content.includes('help'))) {
      return message.reply(helpMessage());
  }

  if (content.startsWith(`${prefix}elder`)) {  
    // remove elder command from message
    content = content
      .replace(`${prefix}elder`, '')
      .trim();

    // if looking for skins
    if (content.includes('skins') || content.includes('skin')) {
      // format will be "[champ name] skins [possibly specific skin name]"
      // so we need to split the string from before "skins" and after "skins"
      let nameArray: Array<string>;
      if (content.includes('skins')) {
        nameArray = content.split('skins');
      } else {
        nameArray = content.split('skin');
      }

      getChampionInformation(nameArray[0].trim(), <ChampionQuery>'skins', nameArray[1].trim())
        .then((embed) => {
          return message.reply(embed)
            .catch((err) => {
              return console.error(err);
            })
        });
    }
    // if the query is asking for an ability
    else if (includesAbility(content)) {
      const contentArray = content.split(' ');
      getChampionInformation(contentArray[0].trim(), <ChampionQuery>contentArray[contentArray.length-1].trim())
        .then((embed) => {
          return message.reply(embed)
            .catch((err) => {
              return console.error(err);
            })
        });
    }
    // assume they only sent champion name
    else {
      getChampionInformation(content)
        .then((embed) => {
          return message.reply(embed)
            .catch((err) => {
              return console.error(err);
            })
        });
    }
  }
});

function helpMessage(): MessageEmbed {
  return makeEmbedMessage({
    title: 'Elder Drake Bot Commands',
    description: `This bot is run and maintained by @myumi on GitHub.
    If you notice an issue or would like to request a feature, please do so through GitHub.

    Here are a list of commands that this bot will parse.`,
    fields: [{
      name: 'Commands:',
      value: `- !elder *[champion name]*
      Returns general champion info like lore, role, price, splash image, damage types, and soforth.

      - !elder *[champion name]* *[ability code (q, ult, passive, etc)]*
      Returns the specified champion's ability information, including any details or notes by the developers.

      - !elder *[champion name]* skins
      Returns a list of all of the released skins for the specified champion.

      - !elder *[champion name]* skin *[skin name]*
      Returns an image and information on the specified champion's specified skin. Includes lore, image, chroma names (if any), and price.

      - !elder *[champion name]* skin *[skin name]* chroma *[chroma name]*
      Returns an image and lore on the specified champion's specified skin's specified chroma. (Whew!)

      - !elder *[item name]*
      Returns the most updated information on the specified item, including build paths, price, and stats. (Not yet implemented)`
    }],
    url: 'https://github.com/myumi/elder-drake'
  });
}

client.login(process.env.TOKEN);
