import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';
import { region, basePath, ChampionQuery, Embed, Modifiers } from '../helpers/constants';
import { normalizeString, titleCase } from '../helpers/helpers';
import { makeEmbedMessage, errorMessage } from '../helpers/messageMaker';

export function getChampionInformation(champName: string, type?: ChampionQuery | string, extra?: string): Promise<MessageEmbed> {
  champName = isWukong(champName);

  switch (type) {
    case 'q': 
      return searchAbility(champName, 'q');
    case 'w': 
      return searchAbility(champName, 'w');
    case 'e': 
      return searchAbility(champName, 'e');
    case 'r': 
      return searchAbility(champName, 'r');
    case 'ult': 
      return searchAbility(champName, 'r');
    case 'p': 
      return searchAbility(champName, 'p');
    case 'passive': 
      return searchAbility(champName, 'p');
    case 'skins':
      // if specific skin
      if (extra) {
        // if specific skin + chroma
        if (extra.includes('chroma')) {
          const chromaArray = separateSkinAndChroma(extra);
          // function handles undefined with error, so no need to check here
          return getChroma(champName, chromaArray[0], chromaArray[1]);
        }
        return getSkin(champName, extra);
      }
      return searchSkins(champName);
    default:
      return getChampion(champName);
  }
}

// todo
export function freeChampionRotation() {
  // return list of champions in formatted string that are available for free rotation
}

// get general champion information
async function getChampion(champName: string): Promise<MessageEmbed> {
  return await makeAPICall(champName)
    .then((json) => {
      const { name, title, icon, roles, resource, attackType, 
        adaptiveType, price, releaseDate, skins, lore, patchLastChanged } = json;
      
      return makeEmbedMessage({
        title: `${name}, ${title}`,
        thumbnail: icon,
        description: lore,
        image: skins[0].splashPath,
        fields: [
          {
            name: 'Roles',
            value: roles.map((item: string) => normalizeString(item)).join(', '),
            inline: true,
          },
          {
            name: 'Ranged or Melee?',
            value: normalizeString(attackType),
            inline: true,
          },
          {
            name: 'Adaptive Damage Type',
            value: normalizeString(adaptiveType),
            inline: true,
          },
          {
            name: 'Ability Resource',
            value: normalizeString(resource),
            inline: true,
          },
          {
            name: 'Price',
            value: Object.keys(price).map((property) => 
              price[property] ? `${price[property]} ${handlePriceProperty(property)}` : '')
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
      return errorMessage({
        type: 'Having trouble getting that champion\'s info!',
        message: err,
      });
    });
}

// get specific champion skin info and image
async function getSkin(champName: string, skinName: string): Promise<MessageEmbed> {
  return await makeAPICall(champName)
    .then((json) => {
      const { skins, name: champion, icon } = json;
      const found = skins.find((item: { name: string }) => item.name.toLowerCase() === skinName);
      const { name, lore, chromas, splashPath, cost } = found;

      // some skins are limited to special events
      const price = cost === 'special' ? 'Special Event' : `${cost} RP`;

      let messageObject: Embed = {
        title: `Skin: ${name} ${champion}`,
        thumbnail: `${icon}.png`,
        image: splashPath,
        fields: [
          {
            name: 'Price',
            value: price,
            inline: true,
          }
        ],
      }

      if (lore || lore !== 'null') {
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

      return makeEmbedMessage(messageObject);
    })
    .catch((err) => {
      return errorMessage({
        type: 'Having trouble finding that particular skin!',
        message: err,
      });
    });
}

async function getChroma(champName: string, skin: string, chroma: string): Promise<MessageEmbed> {
  return await makeAPICall(champName)
    .then((json) => {
      const { skins, name: champion } = json;
      const foundSkin = skins.find((item: { name: string }) => item.name.toLowerCase() === skin);
      const foundChroma = foundSkin.chromas.find((item: { name: string }) => item.name.toLowerCase() === chroma);
      const { name: skinName, lore } = foundSkin;
      const { name: chromaName, chromaPath } = foundChroma;

      let messageObject: Embed = {
        title: `Chroma: ${chromaName} ${skinName} ${champion}`,
        image: chromaPath,
      }

      if (lore || lore !== 'null') {
        messageObject = {
          ...messageObject,
          description: lore,
        }
      }

      return makeEmbedMessage(messageObject);
    })
    .catch((err) => {
      return errorMessage({
        type: 'Having trouble finding that particular chroma!',
        message: err,
      });
  });
}

// get list of all skins for champion
async function searchSkins(champName: string): Promise<MessageEmbed> {
  return await makeAPICall(champName)
    .then((json) => {
      const { name, icon, title, skins } = json;

      // remove the default skin from list
      skins.shift();

      return makeEmbedMessage({
        title: `${name}, ${title}'s Skins`,
        description: `This champion has ${skins.length} skins: 
        ${skins.map((item: { name: string; }) => item.name).join(', ')}
        If you would like to see the image of a specific skin, send 
        "!elder [champion name] skins [skin name]"`,
        thumbnail: `${icon}.png`,
      });
    })
    .catch((err) => {
      return errorMessage({
        type: 'Having trouble finding anything for that!',
        message: err,
      });
    })
}

// get champion's specific ability information
async function searchAbility(champName: string, ability: string): Promise<MessageEmbed> {
  return await makeAPICall(champName)
    .then((json) => {
      const { name: champion, resource} = json;
      const abilityObject = json.abilities[ability.toUpperCase().charAt(0)][0];
      const { name, icon, blurb, effects, cost, cooldown, notes } = abilityObject;
      const cooldownString = generateReducedString(cooldown, 'seconds');
      const costString = generateReducedString(cost, normalizeString(resource));
      const effectsArray = effects.map((item: { description: string }, index: number) => {
        if (index > 0) {
          return {
            name: '***',
            value: cleanDescription(item.description),
          }
        }
  
        return {
          name: 'Effects:',
          value: cleanDescription(item.description),
        }
      });
      const notesArray = generateShortenedFields('Notes', notes);

      return makeEmbedMessage({
        title: `${champion}'s ${titleCase(ability)} Ability: ${name}`,
        description: blurb,
        thumbnail: `${icon}.png`,
        fields: [
          {
            name: 'Cost:',
            value: costString,
            inline: true,
          },
          {
            name: 'Cooldown:',
            value: cooldownString,
            inline: true,
          },
          ...effectsArray,
          ...notesArray,
        ],
      });
    })
    .catch((err) => {
      return errorMessage({
        type: 'Having trouble finding anything for that!',
        message: err,
      });
    })
}

/* Champion.ts Helpers */

// need to call .then() on returned promise
async function makeAPICall(champName: string): Promise<any> {
  return await fetch(`${basePath}/${region}/champions/${champName}.json`)
    .then(data => data.json());
}

// normalize name for api
function isWukong(champName: string): string {
  const nicknames: any = {
    'wukong': 'MonkeyKing',
    'mundo': 'DrMundo',
    'nunu&willump': 'Nunu',
    'jarvan': 'JarvanIV',
    'j4': 'JarvanIV',
    'kogmaw': 'KogMaw',
    'kaisa': 'KaiSa',
    'reksai': 'RekSai',
    'tf': 'TwistedFate',
    'asol': 'AurelionSol',
    'yi': 'MasterYi',
    'akechi': 'Kayn',
    'mord': 'Mordekaiser',
  }

  if (nicknames.hasOwnProperty(champName)) {
    return nicknames[champName];
  }

  // remove symbols and make title-cased
  return titleCase(champName);
}

// seperate the two items, if they both exist
function separateSkinAndChroma(extra: string): Array<string> {
  // split the portion thats the skin name and the chroma name
  const chromaArray = extra.split('chroma');
  // first part should be skin name, then chroma name
  if (chromaArray.length === 2) return [chromaArray[0].trim(), chromaArray[1].trim()];
  // if theres nothing, send nothing
  return ['', '']
}

// normalize price properties like rp -> RP
function handlePriceProperty(property: string): string {
  if (property === 'rp') {
    return 'RP';
  } else if (property === 'saleRp') {
    return 'Sale RP';
  }
  return normalizeString(property);
}

// for certain objects, need to reduce their array of value to something printable
function generateReducedString(array: Modifiers | null, type: string): string {
  if (!array) {
    return 'None';
  }
  
  const values: Array<string> = array.modifiers[0].values;

  return values.reduce((arrayString: string, current: string, index: number) => {
    if (!arrayString.toString().includes('Level')) {
      arrayString = `Level 1: ${arrayString} ${type}`;
    }

    arrayString += `\nLevel ${index + 1}: ${Math.round(parseInt(current))} ${type}`;
    return arrayString;
  });
}

// discord has a length limit on messages
function generateShortenedFields(title: string, message: string): Array<{name: string, value: string}>{
  // seperate long fields into seperate fields
  if (message.length > 1024) {
    // anything past this line is not in-game
    message = cleanDescription(message);

    // make an empty array to push to
    let messages: Array<string> = [];

    // while we still have length on the original string
    while (message) {
      if (message.includes('\n') && message.length > 1024) {
        // cut off the string at the closest \n (look backwards)
        const cutOff = message.lastIndexOf('\n', 1024);
        const subMessage = message.substring(0, cutOff);
        message = message.substring(cutOff);
        messages.push(subMessage);
      } else if (message.length > 1024) {
        // cut off at  1021 to leave room for elipses
        const subMessage = message.substring(0, 1021) + '...';
        message = '...' + message.substring(1024);
        messages.push(subMessage);
      } else {
        // string is short enough, just push it
        messages.push(message);
        message = '';
      }
    }

    // split at 1024 character intervals
    // const messages: RegExpMatchArray | null = message.match(/.{1,1024}/g);
    return messages!.map((message: string, index) => {
      if (index > 0) {
        return {
          name: `${title} contin.`,
          value: message,
        }
      }

      return {
        name: `${title}:`,
        value: message,
      }
    });
  }

  return [{
    name: title,
    value: message,
  }];
}

// removes extra characters and prettifies some text
function cleanDescription(description: string): string {
  // removes excessive new lines
  // removes "Innate" prepend
  // removes extra spaces around parathesis and brackets
  // removes a spaces after and before newlines
  description = description
    .split('\n')
    .filter(line => line.trim())
    .join('\n')
    .replace('  ', ' ')
    .replace(/Innate - /g, '')
    .replace(/Innate: /g, '')
    .replace(/\s+\]/g, '] ')
    .replace(/\[\s+/g, ' [')
    .replace(/\s+\)/g, ') ')
    .replace(/\(\s+/g, ' (')
    .replace('/\n\s+/', '\n')
    .replace('/\s+\n/', '\n');

  if (description.includes(':')) {
    const labelArray = description.split(':');
    labelArray[0] = `***${labelArray[0]}***`;
    description = labelArray.join(':');
  }

  return description.trim();
}

// change "skins -> skin" when displaying a single skin
// "skins all" command displays all skins (needs confirmation with number of how many messages)
// set fields to check if longer than 1024 characters, then to split at \n closest to 1024 length
// do this ^ in loop until all remains are less than 1024 characters
// make title "title contin"