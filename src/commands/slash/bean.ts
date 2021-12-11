import { SlashCommand } from "..";
import emojis from "../../constants/emojis";

export default {
  description: "Bean someone",
  options: [
    {
      type: "USER",
      name: "user",
      description: "The user you want to bean",
      required: true
    },
    {
      type: "STRING",
      name: "reason",
      description: "The reason for the bean"
    }
  ],
  execute: async (interaction, { user, reason }: { user: string, reason?: string }) => {
    const member = await interaction.guild?.members.fetch(user);
    if (!member) return; // this will never return

    return interaction.reply({ content: `${emojis.hammer} ${member.toString()} ${reason ? `, you've been beaned for *${reason}*!` : ", you've been beaned!"}` });
  }
} as SlashCommand;