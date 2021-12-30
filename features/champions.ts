
import { MessageEmbed } from 'discord.js';
import { makeChampionAPICall } from '../modules/api';
import { normalizeChampionName, normalizeNameString, normalizePriceProperty } from '../modules/cleanup';
import { constructEmbedMessage, constructErrorMessage } from '../modules/messages/message';

export async function getChampion(championName: string): Promise<MessageEmbed> {
  return await makeChampionAPICall(championName)
    .then((data) => {
      const { name, title, icon, roles, resource, attackType, 
        adaptiveType, price, releaseDate, skins, lore, patchLastChanged } = data;
      
      return constructEmbedMessage({
        title: `${name}, ${title}`,
        thumbnail: icon,
        description: lore,
        image: skins[0].splashPath,
        fields: [
          {
            name: 'Roles',
            value: roles.map((item: string) => normalizeNameString(item)).join(', '),
            inline: true,
          },
          {
            name: 'Ranged or Melee?',
            value: normalizeNameString(attackType),
            inline: true,
          },
          {
            name: 'Adaptive Damage Type',
            value: normalizeNameString(adaptiveType),
            inline: true,
          },
          {
            name: 'Ability Resource',
            value: normalizeNameString(resource),
            inline: true,
          },
          {
            name: 'Price',
            value: Object.keys(price).map((property) => 
              price[property] ? `${price[property]} ${normalizePriceProperty(property)}` : '')
              .join('\n'),
            inline: true,
          },
          {
            name: 'Release Date',
            value: releaseDate,
            inline: true,
          },
          {
            name: 'Last Update Patch',
            value: patchLastChanged,
            inline: true,
          },
        ]
      });
    })
    .catch((err) => {
      return constructErrorMessage('Having trouble getting that champion\'s info!', 'Are you sure you spelled their name correctly? If so, the API might be down. Try again in a little while.');
    });
}
