/// receives the champion name?

import { generateShortenedFields } from "../features/champions";
import { titleCase } from "./helpers";
import { makeEmbedMessage } from "./messageMaker";

/// message for notes portion
function confirmedNotesMessage(query: any, ability: string) {
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