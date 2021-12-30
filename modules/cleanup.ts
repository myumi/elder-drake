export function normalizeChampionName(championName: string): string {
  const nicknames: any = {
    'mundo': 'Mundo',
    'nunu': 'Nunu & Willump',
    'jarvan': 'Jarvan IV',
    'j4': 'Jarvan IV',
    'kogmaw': 'Kog\'Maw',
    'reksai': 'Rek\'Sai',
    'tf': 'Twisted Fate',
    'asol': 'Aurelion Sol',
    'yi': 'Master Yi',
    'akechi': 'Kayn',
    'mord': 'Mordekaiser',
    'rhaast': 'Kayn',
    'powder': 'Jinx',
    'best boy': 'Kayn',
    'best girl': 'Rek\'Sai',
  }

  if (nicknames.hasOwnProperty(championName)) {
    return capitalizeWordsInString(nicknames[championName]);
  }

  return capitalizeWordsInString(championName);
}

export function normalizeChampionNameForAPI(champName: string): string {
  const nicknames: any = {
    'wukong': 'MonkeyKing',
    'mundo': 'DrMundo',
    'nunu & willump': 'Nunu',
    'jarvan': 'JarvanIV',
    'j4': 'JarvanIV',
    'kogmaw': 'KogMaw',
    'reksai': 'RekSai',
    'tf': 'TwistedFate',
    'asol': 'AurelionSol',
    'yi': 'MasterYi',
    'akechi': 'Kayn',
    'mord': 'Mordekaiser',
    'rhaast': 'Kayn',
    'powder': 'Jinx',
    'best boy': 'Kayn',
    'best girl': 'RekSai',
  }

  if (nicknames.hasOwnProperty(champName)) {
    return nicknames[champName];
  }

  // remove symbols and make title-cased
  return titleCase(champName);
}

export function normalizePriceProperty(property: string): string {
  if (property === 'rp') {
    return 'RP';
  } else if (property === 'saleRp') {
    return 'Sale RP';
  }
  return normalizeNameString(property);
}

// miss fortune -> MissFortune
export function titleCase(string: string): string {
  return string.replace(`'`, '')
  .replace(/_/g, ' ')
  .split(' ')
  .map((split) => capitalizeString(split))
  .join('')
  .trim();
}

export function capitalizeWordsInString(string: string): string {
  let words = string.split(' ');
  words = words.map(word => { 
    return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
  });

  return words.join(' ');
}

export function normalizeNameString(name: string): string {
  if (name === name.toUpperCase()) {
    name = name.toLowerCase();
  }

  name = name
    .replace(/p(i)ercent/g, '%')
    .replace(/([A-Z]|[%])/g, ' $1')
    .replace(/.0/g, '')
    .replace(/_/g, ' ')
    .replace(/'/g, '');
  
  if (name.includes(' ')) {
    name = name.split(' ') 
    .map((split) => capitalizeString(split))
    .join(' ')
    .trim();
  } else {
    name = capitalizeString(name);
  }
  
  return name;
}


/* ====== hoping to remove these with new api ====== */

// // for certain objects, need to reduce their array of value to something printable
// export function modifiersReducedString(array: Modifiers | null, type: string): string {
//   if (!array) {
//     return 'None';
//   }
  
//   const values: Array<string> = array.modifiers[0].values;

//   return values.reduce((arrayString: string, current: string, index: number) => {
//     if (!arrayString.toString().includes('Level')) {
//       arrayString = `Level 1: ${arrayString} ${type}`;
//     }

//     arrayString += `\nLevel ${index + 1}: ${Math.round(parseInt(current))} ${type}`;
//     return arrayString;
//   });
// }

// // discord has a length limit on messages
// export function generateShortenedFields(title: string, message: string): Array<{name: string, value: string}>{
//   // anything past this line is not in-game
//   message = message.split('𝐏𝐄𝐍𝐃𝐈𝐍𝐆 𝐅𝐎𝐑 𝐓𝐄𝐒𝐓 :')[0];

//   // seperate long fields into seperate fields
//   if (message.length > 1024) {
//     // message = cleanDescription(message);

//     // make an empty array to push to
//     let messages: Array<string> = [];

//     // while we still have length on the original string
//     while (message) {
//       if (message.includes('\n') && message.length > 1024) {
//         // cut off the string at the closest \n (look backwards)
//         const cutOff = message.lastIndexOf('\n', 1024);
//         const subMessage = message.substring(0, cutOff);
//         message = message.substring(cutOff);
//         messages.push(subMessage);
//       } else if (message.length > 1024) {
//         // cut off at  1021 to leave room for elipses
//         const subMessage = message.substring(0, 1021) + '...';
//         message = '...' + message.substring(1024);
//         messages.push(subMessage);
//       } else {
//         // string is short enough, just push it
//         messages.push(message);
//         message = '';
//       }
//     }

//     return messages.map((message: string, index) => {
//       if (index > 0) {
//         return {
//           name: `${title} contin.`,
//           value: message,
//         }
//       }

//       return {
//         name: `${title}:`,
//         value: message,
//       }
//     });
//   }

//   return [{
//     name: title,
//     value: message,
//   }];
// }

// // removes extra characters and prettifies some text
// export function normalizeDescription(description: string): string {
//   // removes excessive new lines
//   // removes "Innate" prepend
//   // removes extra spaces around parathesis and brackets
//   // removes a spaces after and before newlines
//   description = description
//     .split('\n')
//     .filter(line => line.trim())
//     .join('\n')
//     .replace(/\s+/g, ' ')
//     .replace(/Innate - /g, '')
//     .replace(/Innate: /g, '')
//     .replace(/\s+\]/g, '] ')
//     .replace(/\[\s+/g, ' [')
//     .replace(/\s+\)/g, ') ')
//     .replace(/\(\s+/g, ' (')
//     .replace('/\n\s+/', '\n')
//     .replace('/\s+\n/', '\n');

//   if (description.includes(':')) {
//     // split at the colon
//     // bold the line that has the colon
//     // restitch strings together
//     let labelArray: Array<string> = description.split(':');

//     const lineBreaks: Array<string> = labelArray[0].split('\n');
//     lineBreaks[lineBreaks.length-1] = `***${lineBreaks[lineBreaks.length-1]}***`;
//     labelArray[0] = lineBreaks.join('\n');

//     description = labelArray.join(':');
//   }

//   return description.trim();
// }