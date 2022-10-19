import axios from 'axios';
import { MessageEmbed } from 'discord.js';
import { region, basePath } from '../modules/constants';
import { capitalizeWordsInString } from '../modules/cleanup';
import { constructErrorMessage } from '../modules/messages/errorMessageGeneration';
import { normalizeItemName, normalizeStatName,  } from '../modules/cleanup';
import { itemMap } from '../modules/init';

//Gets item ID from name
export function getItemID(itemName: string): any {
    const normalizedItemName: string = normalizeItemName(itemName);
    return itemMap.get(normalizedItemName);
} 

//Item API call
export async function makeItemAPICall(itemName: string): Promise<any> {
    const itemID = getItemID(itemName);
    return await axios.get(`${basePath}/${region}/items/${itemID}.json`)
      .then((resp) => {
        return resp.data;
      });
  }

//Gets item and sends message to Discord
export async function getItem(itemName: string): Promise<any> {
    return await makeItemAPICall(itemName)
        .then((data) => {
            return constructItemEmbedMessage(data);
        })
        .catch((err) => {
            return constructErrorMessage('Having trouble getting that item\'s info!', 'Are you sure you spelled their name correctly? If so, the API might be down. Try again in a little while.');
        })
}

export function constructItemEmbedMessage(itemData: any) {
    const { name, id, tier, icon, simpleDescription, shop } = itemData;
    const itemMessage = new MessageEmbed()
        .setColor('#87E4E9')
        .setAuthor('The elder drake speaks...', 'https://cdn.discordapp.com/attachments/651148711115882556/877567670608871494/elder-icon.png')
        .setTitle(name)
        .setThumbnail(icon)
        .setDescription(`${simpleDescription} \nItem ID: ${id}`)  
        for (var passive in itemData.passives) {
            if (itemData.passives[passive]) {
                if (itemData.passives[passive].name !== 'Mythic') {
                    itemMessage.addFields({ name: itemData.passives[passive].name, value: itemData.passives[passive].effects})
                }
            }
        }
        for (var stat in itemData.stats) {
            if (itemData.stats[stat].flat > 0) {
                itemMessage.addFields({ name: normalizeStatName(stat), value: itemData.stats[stat].flat, inline: false})
            }
        }
        for (var price in itemData.shop.prices) {
            if (itemData.shop.prices[price] > 0) {
                if(price === 'total') {
                    itemMessage.addFields({ name: 'Buy', value: itemData.shop.prices[price], inline: true})
                } else {
                    itemMessage.addFields({ name: capitalizeWordsInString(price), value: itemData.shop.prices[price], inline: true})    
                }
            }
        }
    console.log(itemMessage);
    return itemMessage;
}