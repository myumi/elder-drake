import axios from 'axios';
import { region, basePath, Chroma, Skin } from '../modules/constants';

export let championNames: Array<string> = [];
export let skinNames: Array<string> = [];
export let chromaNames: Array<string> = [];

export function init() {
  setChampionNamesAndSkinNamesAndChromaNames();
}

async function setChampionNamesAndSkinNamesAndChromaNames() {
  axios.get(`${basePath}/${region}/champions.json`)
    .then(({ data }: { data: any }) => {
      Object.getOwnPropertyNames(data).map(champion => {
        addToChampionNames(data[champion].name);
        addToSkinNames(data[champion].skins);
        addToChromaNames(data[champion].skins);
      });
    });
}

function addToChampionNames(championName: string) {
  championName = championName.toLowerCase();
  championNames.push(championName);
}

function addToSkinNames(skinArray: Array<Skin>) {
  pushNewItemToArray(skinArray, skinNames);
}

function addToChromaNames(skinArray: Array<Skin>) {
  skinArray.forEach(({ chromas }: { chromas: Array<Chroma> }) => {
    pushNewItemToArray(chromas, chromaNames);
  });
}

function pushNewItemToArray(dataArray: Array<Chroma> | Array<Skin>, array: Array<string>) {
  dataArray.forEach((item) => {
    if (item !== null && item.name) {
      const itemName = item.name.toLowerCase();
      if (!array.includes(itemName)) {
        array.push(itemName);
      }
    }
  });
}