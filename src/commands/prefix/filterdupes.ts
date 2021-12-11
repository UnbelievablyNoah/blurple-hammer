import { PrefixCommand } from "..";
import emojis from "../../constants/emojis";

export default {
  description: "Remove duplicates from a string of IDs",
  usage: {
    "<ID(s ...)>": "List of IDs you want to filter out duplicates from"
  },
  aliases: [ "checkdupes", "dupes", "nodupes" ],
  testArgs: args => Boolean(args.length),
  execute: async ({ channel }, args) => {
    const filtered = args.filter((id, index, array) => array.indexOf(id) == index);
    return void channel.send(`${emojis.sparkle} Filtered out ${args.length - filtered.length}/${args.length} duplicates: \`\`\`fix\n${filtered.join(" ")}\`\`\``);
  }
} as PrefixCommand;