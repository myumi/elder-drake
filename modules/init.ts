import axios from 'axios';
import { region, basePath, Chroma, Skin } from '../modules/constants';
import { formatPrestigeSkinNames } from './cleanup';

export let championNames: Array<string> = [];
export let skinNames: Array<string> = [];
export let chromaNames: Array<string> = [];
export let skinToChampionMap: Map<string, Array<string>> = new Map();

export function init() {
  setChampionNamesAndSkinNamesAndChromaNames();
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

function addToChampionNames(championName: string) {
  championName = championName.toLowerCase();
  championNames.push(championName);
}

function addChampionsToSkinMap(championName: string, skinArray: Array<Skin>) {
  skinArray.forEach(({ name: skinName }: { name: string }) => {
    if (skinName !== 'Original') {
      skinName = formatPrestigeSkinNames(skinName.toLowerCase());
      if (skinToChampionMap.has(skinName)) {
        let skinArray = skinToChampionMap.get(skinName)!;
        pushNewItemToArray(championName, skinArray);
        skinToChampionMap.set(skinName, skinArray);
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