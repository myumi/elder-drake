import { MessageEmbed } from 'discord.js';
import { Embed, Skin } from '../modules/constants';
import { makeChampionSkinAPICall } from '../modules/api';
import { normalizeChampionName } from '../modules/cleanup';
import { constructEmbedMessage } from '../modules/messages/normalMessageGeneration';
import { constructErrorMessage } from '../modules/messages/errorMessageGeneration';

export async function getChampionSkin(championName: string, skinName: string): Promise<MessageEmbed> {
  return await makeChampionSkinAPICall(championName, skinName)
    .then((skinData) => {
      return makeChampionSkinMessageEmbed(championName, skinData);
    })
    .catch((err) => {
      return constructErrorMessage('Having trouble finding that particular skin!', err);
    });
}

function makeChampionSkinMessageEmbed(championName: string, skinData: Skin): MessageEmbed {
  championName = normalizeChampionName(championName);
  const { name, formatName, cost, chromas, lore, splashPath, tilePath } = skinData;
  const fullSkinName = formatWeirdSkinName(championName, name, formatName);
  const price = cost === 'special' ? 'Special Event' : `${cost} RP`;

  let messageObject: Embed = {
    title: `Skin: ${fullSkinName}`,
    thumbnail: tilePath,
    image: splashPath,
    fields: [
      {
        name: 'Price',
        value: price,
        inline: true,
      }
    ],
  }

  if (!!lore) {
    messageObject = {
      ...messageObject,
      description: lore,
    }
  }

  if (chromas.length) {
    messageObject.fields!.unshift({
      name: 'Chromas',
      value: chromas.map((chroma: any) => chroma.name).join(', '),
    });
  }

  return constructEmbedMessage(messageObject);
}

function formatWeirdSkinName(championName: string, skinName: string, formatName: string) {
  if (skinName.includes(championName)) {
    return skinName;
  } else if (skinName !== formatName) {
    return formatName;
  } else {
    return `${skinName} ${championName}`
  }
}

// export async function getSkin(skinName: string): Promise<MessageEmbed> {}
