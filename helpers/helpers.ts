import { Modifiers } from './constants';

// get random element from array
export function getRandomElement(array: Array<any>): string {
  return `${array[Math.floor(Math.random() * array.length)]}`;
}

// checks last word for a ChampionQuery
export function includesAbility(string: string): boolean {
  if (
    string.includes(' q')
    || string.includes(' w')
    || string.includes(' e')
    || string.includes(' r')
    || string.includes(' ult')
    || string.includes(' ultimate')
    || string.includes(' passive')
    || string.includes(' p')
  ) {
    return true;
  }
  return false;
}

/** String Cleaning  **/

// clean up string to be more readable
export function normalizeNameString(string: string): string {
  // an all caps string is weird to parse, but always one word so make it all lowercase
  if (string === string.toUpperCase()) {
    string = string.toLowerCase();
  }

  string = string
    .replace(/p(i)ercent/g, '%')
    .replace(/([A-Z]|[%])/g, ' $1')
    .replace(/.0/g, '')
    .replace(/_/g, ' ')
    .replace(/'/g, '');
  
  if (string.includes(' ')) {
    string = string.split(' ') 
    .map((split) => split.charAt(0).toUpperCase() + split.substring(1).toLowerCase())
    .join(' ')
    .trim();
  } else {
    string = string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
  }
  
  return string;
}

// normalize price properties like rp -> RP
export function normalizePriceProperty(property: string): string {
  if (property === 'rp') {
    return 'RP';
  } else if (property === 'saleRp') {
    return 'Sale RP';
  }
  return normalizeNameString(property);
}

// removes extra characters and prettifies some text
export function normalizeDescription(description: string): string {
  // removes excessive new lines
  // removes "Innate" prepend
  // removes extra spaces around parathesis and brackets
  // removes a spaces after and before newlines
  description = description
    .split('\n')
    .filter(line => line.trim())
    .join('\n')
    .replace(/\s+/g, ' ')
    .replace(/Innate - /g, '')
    .replace(/Innate: /g, '')
    .replace(/\s+\]/g, '] ')
    .replace(/\[\s+/g, ' [')
    .replace(/\s+\)/g, ') ')
    .replace(/\(\s+/g, ' (')
    .replace('/\n\s+/', '\n')
    .replace('/\s+\n/', '\n');

  if (description.includes(':')) {
    // split at the colon
    // bold the line that has the colon
    // restitch strings together
    let labelArray: Array<string> = description.split(':');

    const lineBreaks: Array<string> = labelArray[0].split('\n');
    lineBreaks[lineBreaks.length-1] = `***${lineBreaks[lineBreaks.length-1]}***`;
    labelArray[0] = lineBreaks.join('\n');

    description = labelArray.join(':');
  }

  return description.trim();
}

// miss fortune -> MissFortune
export function titleCase(string: string): string {
  return string.replace(`'`, '')
  .replace(/_/g, ' ')
  .split(' ')
  .map((split) => split.charAt(0).toUpperCase() + split.substring(1).toLowerCase())
  .join('')
  .trim();
}

// for certain objects, need to reduce their array of value to something printable
export function modifiersReducedString(array: Modifiers | null, type: string): string {
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
export function generateShortenedFields(title: string, message: string): Array<{name: string, value: string}>{
  // anything past this line is not in-game
  message = message.split('𝐏𝐄𝐍𝐃𝐈𝐍𝐆 𝐅𝐎𝐑 𝐓𝐄𝐒𝐓 :')[0];

  // seperate long fields into seperate fields
  if (message.length > 1024) {
    // message = cleanDescription(message);

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

    return messages.map((message: string, index) => {
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