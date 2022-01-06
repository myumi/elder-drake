import axios from 'axios';
import { region, basePath, Chroma, Skin } from '../modules/constants';
import { capitalizeWordsInString, normalizeChampionNameForAPI } from './cleanup';
import { skinToChampionMap } from './init';
import { constructErrorMessage } from './messages/errorMessageGeneration';

export async function makeChampionAPICall(championName: string): Promise<any> {
  const normalizedChampionName = normalizeChampionNameForAPI(championName);
  return await axios.get(`${basePath}/${region}/champions/${normalizedChampionName}.json`)
    .then((data) => {
      return data.data;
    });
}

export async function makeChampionSkinAPICall(championName: string, skinName: string): Promise<any> {
  const normalizedChampionName = normalizeChampionNameForAPI(championName);
  return await axios.get(`${basePath}/${region}/champions/${normalizedChampionName}.json`)    
    .then(({ data }: { data: any }) => {
      const skinData = ifArrayHaveGivenName(data.skins, skinName)

      if (!skinData) {
        return constructErrorMessage('Not Found', `${capitalizeWordsInString(championName)} does not have a ${capitalizeWordsInString(skinName)} skin.`);
      }

      return skinData;
  });
}

function ifArrayHaveGivenName(array: Array<Skin> | Array<Chroma>, name: string): Skin | Chroma | undefined {
  return (array as any[]).find((item: Skin | Chroma) => {
    return item.name.toLowerCase() === name.toLowerCase()
  });
}