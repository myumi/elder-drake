import axios from 'axios';
import { region, basePath, Chroma, Skin } from '../modules/constants';
import { capitalizeWordsInString, normalizeChampionNameForAPI } from './cleanup';
import { constructErrorMessage } from './messages/errorMessageGeneration';

export async function makeChampionAPICall(championName: string): Promise<any> {
  const normalizedChampionName = normalizeChampionNameForAPI(championName);
  return await axios.get(`${basePath}/${region}/champions/${normalizedChampionName}.json`);
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

function ifArrayHaveGivenName(array: Array<Skin> | Array<Chroma>, name: string): Skin | Chroma | boolean {
  return array.some((item) => {
    if (item.name.toLowerCase() === name.toLowerCase()) {
      return item;
    }
    return false;
  });
}