import axios from 'axios';
import { region, basePath, Chroma, Skin } from '../modules/constants';
import { simplifyName } from './cleanup';
export let itemMap = new Map<string, string>();
export let itemNames: Array<string> = [];
export let championNames: Array<string> = [];
export let skinNames: Array<string> = ['prestige'];
export let chromaNames: Array<string> = [];
export let skinToChampionMap: Map<string, Array<string>> = new Map();
skinToChampionMap.set('prestige', [])

export function init() {
  setChampionNamesAndSkinNamesAndChromaNames();
  setItemNames();
}

async function setChampionNamesAndSkinNamesAndChromaNames() {
  await axios.get(`${basePath}/${region}/champions.json`)
    .then(({ data }: { data: any }) => {
      Object.getOwnPropertyNames(data).map(champion => {
        addToChampionNames(data[champion].name);
        addChampionsToSkinMap(data[champion].name, data[champion].skins);
        addToSkinNames(data[champion].skins);
        addToChromaNames(data[champion].skins);
      });
    });
}

// Sets item map for getting item ID from item name.
export async function setItemNames() {
  await axios.get(`${basePath}/${region}/items.json`)
      .then(res => {
          for (let id in res.data) {
              let itemName = simplifyName(res.data[id].name.replace(/'/,''));
              itemMap.set(itemName, id);
              itemNames.push(itemName);
          }
      }
  )
}

function addToChampionNames(championName: string) {
  championName = championName.toLowerCase();
  championNames.push(championName);
}

function addChampionsToSkinMap(championName: string, skinArray: Array<Skin>) {
  skinArray.forEach(({ name: skinName }: { name: string }) => {
    skinName = skinName.toLowerCase();
    
    if (skinName !== 'original') {
      const isPrestige = skinName.includes('prestige');

      if (isPrestige) {
        setNewItemToSkinMap(championName, 'prestige');
      }

      if (skinToChampionMap.has(skinName)) {
        setNewItemToSkinMap(championName, skinName);
      } else {
        skinToChampionMap.set(skinName, [championName]);
      }
    }
  });
}

function addToSkinNames(skinArray: Array<Skin>) {
  pushNewItemToArrayFromArray(skinArray, skinNames);
}

function addToChromaNames(skinArray: Array<Skin>) {
  skinArray.forEach(({ chromas }: { chromas: Array<Chroma> }) => {
    pushNewItemToArrayFromArray(chromas, chromaNames);
  });
}

function pushNewItemToArrayFromArray(dataArray: Array<Chroma> | Array<Skin>, array: Array<string>) {
  dataArray.forEach((item) => {
    if (item !== null && item.name) {
      const itemName = item.name.toLowerCase();
      if (!array.includes(itemName)) {
        array.push(itemName);
      }
    }
  });
}

function pushNewItemToArray(item: string, array: Array<string>) {
  if (array.includes(item)) {
    return;
  }

  array.push(item);
}

function setNewItemToSkinMap(championName: string, skinName: string) {
  let skinArray = skinToChampionMap.get(skinName)!;
  pushNewItemToArray(championName, skinArray);
  skinToChampionMap.set(skinName, skinArray);
}