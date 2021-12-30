import { MessageEmbed } from 'discord.js';
import { ErrorMessage, Embed } from '../constants';
import generateErrorMessage from './errorMessageGeneration';

export function constructEmbedMessage(message: Embed): MessageEmbed {
  const embedMessage = new MessageEmbed()
    .setColor('#87E4E9')
    .setAuthor('The elder drake speaks...', 'https://cdn.discordapp.com/attachments/651148711115882556/877567670608871494/elder-icon.png');
  
  // set message properties if we received them
  if (message.title) {
    embedMessage.setTitle(message.title);
  }
  if (message.thumbnail) {
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