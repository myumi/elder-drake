import axios from 'axios';
import { MessageEmbed } from 'discord.js';
import { region, basePath } from '../modules/constants';
import { capitalizeWordsInString } from '../modules/cleanup';
import { constructErrorMessage } from '../modules/messages/errorMessageGeneration';
import { normalizeItemName, normalizeStatName,  } from '../modules/cleanup';
import { itemMap } from '../modules/init';

// Gets item ID from name
export function getItemID(itemName: string): any {
    const normalizedItemName: string = normalizeItemName(itemName);
    return itemMap.get(normalizedItemName);
} 

// Item API call
export async function makeItemAPICall(itemName: string): Promise<any> {
    const itemID = getItemID(itemName);
    return await axios.get(`${basePath}/${region}/items/${itemID}.json`)
      .then((res) => {
        return res.data;
      });
  }

// Gets item and sends message to Discord
export async function getItem(itemName: string): Promise<any> {
    return await makeItemAPICall(itemName)
        .then((res) => {
            return constructItemEmbedMessage(res);
        })
        .catch((err) => {
            return constructErrorMessage('Having trouble getting that item\'s info!', 'Are you sure you spelled their name correctly? If so, the API might be down. Try again in a little while.');
        })
}

export function constructItemEmbedMessage(itemData: any) {
    const { name, id, tier, icon, simpleDescription, passives, stats, shop} = itemData;
    const itemMessage = new MessageEmbed()
        .setColor('#87E4E9')
        .setAuthor('The elder drake speaks...', 'https://cdn.discordapp.com/attachments/651148711115882556/877567670608871494/elder-icon.png')
        .setTitle(name)
        .setThumbnail(icon)

        if (simpleDescription) {
            itemMessage.setDescription(`${simpleDescription} \nItem ID: ${id}`);
        } else {
            itemMessage.setDescription(`Item ID: ${id}`);
        };

        Object.entries(passives).forEach((passive: any): void => {
            const [passiveName, passiveValues] = passive;
            if (passiveValues.mythic) {
                itemMessage.addFields({ name: 'Mythic', value: 'No data. To be implemented at a later date', inline: false })
                itemMessage.setTitle(`${name} (Mythic)`)
            } else if (passiveValues.unique) {
                itemMessage.addFields({ name: 'UNIQUE Passive', value: passiveValues.effects, inline: false })
            } else {
                itemMessage.addFields({ name: 'Passive', value: passiveValues.effects, inline: false })
            }
        })

        Object.entries(stats).forEach((itemStat: any): void => {
            const [statName, statValue] = itemStat;
            if (statValue.flat > 0) {
                itemMessage.addFields({ name: normalizeStatName(statName), value: statValue.flat, inline: false });
            }
        });

        Object.entries(shop.prices).forEach((price: any): void => {
            const [shopType, shopValue] = price;
            if (shopType === 'total') {
                itemMessage.addFields({ name: 'Buy', value: shopValue, inline: true})
            } else if (shopValue > 0) {
                itemMessage.addFields({ name: capitalizeWordsInString(shopType), value: shopValue, inline: true})    
            }
        });

    return itemMessage;
}