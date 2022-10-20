import { Client, Message, MessageAdditions, MessageEmbed, MessageOptions } from 'discord.js';
import { prefix } from './modules/constants';
import { getChampion } from './features/champions';
import { getChampionSkin, getSkin } from './features/skins';
import { fetchItem } from './features/items';
import { constructEmbedMessage } from './modules/messages/normalMessageGeneration';
import { championNames, chromaNames, init, skinNames, itemNames } from './modules/init';
import { normalizeChampionName } from './modules/cleanup';
import { constructErrorMessage } from './modules/messages/errorMessageGeneration';
import { normalizeItemName } from './modules/cleanup';

const championNickNames: Array<string> = ['mundo', 'nunu', 'jarvan', 'j4', 'kogmaw', 'reksai', 'tf', 'asol', 'yi', 
                                          'akechi', 'mord', 'rhaast', 'powder', 'best boy', 'best girl', 'violet', 
                                          'cait', 'cupcake', 'ez'];

const client = new Client();

client.on('ready', () => {
  init();
  console.log('The elder drake is awake!');
});

client.on('message', (message: Message) => {
  if (message.author.bot) return;

  return sendProperMessageResponse(message);
});

function ifPrefix(message: string): boolean {
  if (message === prefix || message.startsWith(prefix)) {
    return true;
  }
  return false;
}

function removePrefix(message: string): string {
  return message.replace(prefix, '');
}

function sendProperMessageResponse(message: Message)  {
  let { content }: { content: string } = message;
  content = content.toLowerCase().trim();
  if (!ifPrefix(content)) {
    return;
  }

  content = removePrefix(content);

  // if (content.includes('help')) {
  //   return message.reply(helpMessage());
  // }

  const nickname = getConvertedNicknameToName(content);
  if (nickname) {
    content += ` ${nickname}`;
  }

  const itemNickname = normalizeItemName(content);
  if (itemNickname) {
    content += ` ${itemNickname}`;
  }

  const championName = getIncludedName(content, championNames);
  const skinName = getIncludedName(content, skinNames);
  const chromaName = getIncludedName(content, chromaNames);
  const itemName = getIncludedName(content, itemNames)

  if (chromaName && skinName && championName) {
    return sendChampionSkinChromaData(championName, skinName, chromaName, message);
  }
  else if (skinName && championName) {
    return sendChampionSkinData(championName, skinName, message);
  }
  else if (championName) {
    return sendChampionData(championName, message);
  }
  else if (skinName) {
    return sendSkinData(skinName, message);
  }
  else if (itemName) {
    return sendItemData(itemName, message);
  }
  else {
    return sendErrorMessage(message);
  }
}

function getConvertedNicknameToName(message: string): string {
  const nickname = getIncludedName(message, championNickNames);

  return normalizeChampionName(nickname).toLowerCase();
}

function getIncludedName(message: string, names: Array<string>): string {
  let nameIncluded = '';
  names.some((name: string) => {
    if (message.includes(` ${name}`)) {
      nameIncluded = name;
    }
    return nameIncluded;
  });
  return nameIncluded;
}

function sendChampionData(championName: string, message: Message): Promise<void | Message> {
  return getChampion(championName)
    .then((embed: MessageEmbed) => {
      return message.reply(embed)
        .catch((err) => {
          return console.error('When sending embedded message for champion data', err);
        });
    })
    .catch((err) => {
      return console.error('When getting the embedded message for champion data', err)
    });
}

function sendSkinData(skinName: string, message: Message): Promise<void | Message>  {
  return getSkin(skinName)
    .then((embed: MessageEmbed) => {
      return message.reply(embed)
      .catch((err) => {
        return console.error('When sending embedded message for skin data', err);
      });
    })
    .catch((err) => {
      return console.error('When getting the embedded message for skin data', err)
    });
}

function sendChampionSkinData(championName: string, skinName: string, message: Message): Promise<void | Message>  {
  return getChampionSkin(championName, skinName)
  .then((embed: MessageEmbed) => {
    return message.reply(embed)
      .catch((err) => {
        return console.error('When sending embedded message for champion data', err);
      });
  })
    .catch((err) => {
      return console.error('When getting the embedded message for champion data', err)
    });
}

function sendChampionSkinChromaData(championName: string, skinName: string, chromaName: string, message: Message): Promise<void | Message>  {
  return getChampion(championName)
  .then((embed: MessageEmbed) => {
    return message.reply(embed)
      .catch((err) => {
        return console.error('When sending embedded message for champion data', err);
      });
  })
    .catch((err) => {
      return console.error('When getting the embedded message for champion data', err)
    });
}

function sendItemData(itemName: string, message: Message): Promise<void | Message> {
  return fetchItem(itemName)
    .then((embed: MessageEmbed) => {
      return message.reply(embed)
        .catch((err) => {
          return console.error('When sending embedded message for item data', err);
        });
    })
    .catch((err) => {
      return console.error('When getting the embedded message for item data', err)
    });
}

function sendErrorMessage(message: Message): Promise<Message> {
  return message.reply(constructErrorMessage('Not Found', 'Your message did not match any of our queries, or did not contain any known key words.'));
}

function sendHelpMessage(): MessageEmbed {
  return constructEmbedMessage({
    title: 'Elder Drake Bot Commands',
    description: `This bot is run and maintained by @myumi on GitHub.
    If you notice an issue or would like to request a feature, please do so through GitHub.

    Here is a list of commands that this bot will parse.`,
    fields: [{
      name: 'Commands:',
      value: `- !elder *[champion name]*
      Returns general champion info like lore, role, price, splash image, damage types, and soforth.

      - !elder *[champion name]* *[ability code (q, ult, passive, etc)]*
      Returns the specified champion's ability information, including any details or notes by the developers.

      - !elder *[skin name]* *[champion name]*
      Returns a list of all of the released skins for the specified champion.
      
      - !elder *[item name]* 
      Returns the general item info such as including description, passives, stats, and shop price.`

    }],
    url: 'https://github.com/myumi/elder-drake'
  });
}

client.login(process.env.TOKEN);
