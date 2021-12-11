import { SlashCommand } from "..";
import gifs from "../../constants/gifs";

export default {
  description: "Get a cool GIF to *flex* your hard work as a moderator",
  options: [{
    type: "STRING",
    name: "category",
    description: "The type of GIF you want to send",
    required: true,
    choices: Object.entries(gifs).map(([ category ]) => ({ name: category.charAt(0).toUpperCase() + category.slice(1), value: category })),
  }],
  execute: async (interaction, { category }: { category: keyof typeof gifs }) => interaction.reply({
    content: gifs[category][Math.floor(Math.random() * gifs[category].length)]
  })
} as SlashCommand;