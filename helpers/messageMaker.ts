import { MessageEmbed } from 'discord.js';
import { ErrorMessage, Embed } from './constants';
import generateErrorMessage from './errorMessages';

export function makeEmbedMessage(message: Embed): MessageEmbed {
  const embedMessage = new MessageEmbed()
    .setColor('#87E4E9')
    .setAuthor('The elder drake speaks...', 'https://cdn.discordapp.com/attachments/651148711115882556/877567670608871494/elder-icon.png');
  
  if (message.title) {
    embedMessage.setTitle(message.title);
  }
  if (message.thumbnail) {
    console.log(message.thumbnail)
    embedMessage.setThumbnail(message.thumbnail);
  }
  if (message.description) {
    embedMessage.setDescription(message.description);
  }
  if (message.fields) {
    embedMessage.addFields(message.fields);
  }
  if (message.image) {
    embedMessage.setImage(message.image);
  }
  if (message.url) {
    embedMessage.setURL(message.url);
  }

  return embedMessage;
}

export function errorMessage({ type, message }: ErrorMessage): MessageEmbed {
  // generates a fun, random message
  const description = generateErrorMessage();
  const embedMessage: Embed = {
    title: 'Oh, woof.',
    description,
    fields: [{name: type, value: message}],
  };

  return makeEmbedMessage(embedMessage);
}