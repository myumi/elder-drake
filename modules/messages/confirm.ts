import { generateShortenedFields, titleCase } from "../cleanup";
import { AbilityQuery } from "../constants";
import { makeEmbedMessage } from "./message";


/// abilities
/// message for notes portion
function confirmedNotesMessage(champName: string, ability: AbilityQuery) {
  // check stored file
  const { name: champion } = query;
  const abilityObject = query.abilities[ability.toUpperCase().charAt(0)][0];
  const { name, icon, blurb, notes } = abilityObject;
  const notesArray = generateShortenedFields('Notes', notes);

  return makeEmbedMessage({
    title: `${champion}'s ${titleCase(ability)} Ability: ${name}`,
    description: blurb,
    thumbnail: `${icon}.png`,
    fields: [
      ...notesArray,
    ],
  });
}

/// message for skins

/// message for chromas