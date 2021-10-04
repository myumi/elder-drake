import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';
import { region, basePath, ChampionQuery, Embed } from '../helpers/constants';
import { modifiersReducedString, normalizeDescription, normalizeNameString, normalizePriceProperty, titleCase } from '../helpers/helpers';
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
// todo: display list of skins from search skins here
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

      return makeEmbedMessage(messageObject);
    })
    .catch((err) => {
      return errorMessage({
        type: 'Having trouble finding that particular skin!',
        message: err,
      });
    });
}

// get specific chromas
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

      if (!!lore) {
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
// todo: update this to return a prompt for all skin images
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
      const { name, icon, blurb, effects, cost, cooldown } = abilityObject;
      const cooldownString = modifiersReducedString(cooldown, 'seconds');
      const costString = modifiersReducedString(cost, normalizeNameString(resource));
      const effectsArray = effects.map((item: { description: string }, index: number) => {
        if (index > 0) {
          return {
            name: '***',
            value: normalizeDescription(item.description),
          }
        }
  
        return {
          name: 'Effects:',
          value: normalizeDescription(item.description),
        }
      });

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
          {
            name: 'Notes:',
            value: 'The notes often have interesting information but are in no way guarenteed to be readable in this format. If you would like to still see them for this query, reply to this message with :notepad_spiral:.'
          }
        ],
      });
    })
    .catch((err) => {
      return errorMessage({
        type: 'Having trouble finding anything for that!',
        message: `${err}: Did you spell the champion name correctly? Are you searching by ability name instead of key?`,
      });
    });
}

/* Champion.ts-specific Helpers */

// need to call .then() on returned promise
async function makeAPICall(champName: string): Promise<any> {
  return await fetch(`${basePath}/${region}/champions/${champName}.json`)
    .then((data: { json: () => any }) => data.json());
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