import { Restriction } from ".";

const restrictions: Array<Restriction> = [
  {
    name: "Embed",
    description: "Disallow the use of embeds",
    allowed: "Can use embeds",
    disallowed: "Cannot use embeds",
    role: "708546418280890370",
  },
  {
    name: "Reactions",
    description: "Disallow adding reactions",
    allowed: "Can add reactions",
    disallowed: "Cannot add reactions",
    role: "708546441563603065",
  },
  {
    name: "Bots",
    description: "Disallow using bot commands",
    allowed: "Can use bot commands",
    disallowed: "Cannot use bot commands",
    role: "573392328912404480",
  },
  {
    name: "VAD",
    description: "Disallow voice activity detection",
    allowed: "Can use voice activity detection",
    disallowed: "Cannot use voice activity detection",
    role: "518114943019778069",
  },
  {
    name: "Nick",
    description: "Disallow nickname change",
    allowed: "Can change nickname",
    disallowed: "Cannot change nickname",
    role: "841051057496391680",
  },
];

export default restrictions;