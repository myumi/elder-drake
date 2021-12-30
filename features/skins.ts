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
  const { name, formatName, cost, chromas, lore, uncenteredSplashPath, tilePath } = skinData;
  const fullSkinName = name !== formatName ? formatName : `${name} ${championName}`;
  const price = cost === 'special' ? 'Special Event' : `${cost} RP`;

  let messageObject: Embed = {
    title: `Skin: ${fullSkinName}`,
    thumbnail: tilePath,
    image: uncenteredSplashPath,
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

// export async function getSkin(skinName: string): Promise<MessageEmbed> {}
