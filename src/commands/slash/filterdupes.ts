import { SlashCommand } from "..";
import emojis from "../../constants/emojis";

export default {
  description: "Bean someone",
  options: [
    {
      type: "STRING",
      name: "ids",
      description: "List of IDs you want to filter out duplicates from, separated with space",
      required: true
    }
  ],
  execute: async (interaction, { ids }: { ids: string }) => {
    const list = ids.split(" ");
    const filtered = list.filter((id, i, a) => a.indexOf(id) === i);
    return interaction.reply({
      content: `${emojis.sparkle} Filtered out ${list.length - filtered.length}/${list.length} duplicates: \`\`\`fix\n${filtered.join(" ")}\`\`\``,
      ephemeral: true
    });
  }
} as SlashCommand;