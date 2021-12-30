// typescript compiler: npx tsc
import { Client, Message, MessageAdditions, MessageEmbed, MessageOptions } from 'discord.js';
import { prefix } from './modules/constants';
import { getChampion } from './features/champions';
import { includesAbility } from './modules/helpers';
import { makeEmbedMessage } from './modules/messages/message';
import { championNames, chromaNames, init, skinNames } from './modules/init';
import { off } from 'process';
import { normalizeChampionName } from './modules/cleanup';

const client = new Client();

client.on('ready', () => {
  console.log('The elder drake is awake!');
  init();
});

client.on('message', (message: Message) => {
  if (message.author.bot) return;

  let { content }: { content: string } = message;
  content = content.toLowerCase().trim();

  if (ifPrefix(content)) {
    // if (content.includes('help')) {
    //   return message.reply(helpMessage());
    // }

    const championName = getIncludedName(content, championNames);
    const skinName = getIncludedName(content, skinNames);
    const chromaName = getIncludedName(content, chromaNames);

    if (chromaName && skinName && championName) {
      return sendChampionSkinChromaData(championName, skinName, chromaName, message);
    }
    if (skinName && championName) {
      return sendChampionSkinChromaData(championName, skinName, chromaName, message);
    }
    if (championName) {
      return sendChampionData(championName, message);
    }
  }
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

function helpMessage(): MessageEmbed {
  return makeEmbedMessage({
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
      Returns a list of all of the released skins for the specified champion.`
    }],
    url: 'https://github.com/myumi/elder-drake'
  });
}

function getIncludedName(message: string, names: Array<string>): string {
  let nameIncluded = '';
  names.some((name: string) => {
    if (message.includes(name)) {
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
          return console.error('when sending embedded message for champion data', err);
        });
    })
      .catch((err) => {
        return console.error('when getting the embedded message for champion data', err)
      });
}

function sendChampionSkinData(championName: string, skinName: string, message: Message): Promise<void | Message>  {
  return getChampion(championName)
  .then((embed: MessageEmbed) => {
    return message.reply(embed)
      .catch((err) => {
        return console.error('when sending embedded message for champion data', err);
      });
  })
    .catch((err) => {
      return console.error('when getting the embedded message for champion data', err)
    });
}

function sendChampionSkinChromaData(championName: string, skinName: string, chromaName: string, message: Message): Promise<void | Message>  {
  return getChampion(championName)
  .then((embed: MessageEmbed) => {
    return message.reply(embed)
      .catch((err) => {
        return console.error('when sending embedded message for champion data', err);
      });
  })
    .catch((err) => {
      return console.error('when getting the embedded message for champion data', err)
    });
}

client.login(process.env.TOKEN);
