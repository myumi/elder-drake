import { MessageEmbed } from 'discord.js';
import { Embed } from '../modules/constants';
import { makeChampionSkinAPICall } from '../modules/api';
import { normalizeChampionName } from '../modules/cleanup';
import { constructEmbedMessage, constructErrorMessage } from '../modules/messages/message';

export async function getChampionSkin(championName: string, skinName: string): Promise<MessageEmbed> {
  return await makeChampionSkinAPICall(championName, skinName)
    .then((data) => {
      championName = normalizeChampionName(championName);
      const { name, formatName, cost, chromas, lore, uncenteredSplashPath, tilePath } = data;
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
    })
    .catch((err) => {
      return constructErrorMessage(
        'Having trouble finding that particular skin!',
        err,
      );
    });
}

// export async function getSkin(skinName: string): Promise<MessageEmbed> {}
