import { DMChannel } from "discord.js";
import { ContextMenuCommand } from "..";
import emojis from "../../constants/emojis";

export default {
  execute: async interaction => {
    const message = await interaction.channel?.messages.fetch(interaction.targetId);
    if (message) {
      if (message.createdTimestamp < Date.now() - 1800000) return void interaction.reply({
        content: `${emojis.thumbsdown} You can only delete messages that are 30 minutes old. This limitation is not bypassable due to security reasons.`, ephemeral: true
      });

      Promise.all([
        (async () => {
          let processing = true, amount = 0;
          while (processing) {
            const messages = await (await interaction.channel?.messages.fetch({ limit: 100 }))?.filter(m => Boolean(
              m.type == "DEFAULT" && m.createdTimestamp >= message.createdTimestamp
            ));
            if (messages?.size && interaction.channel && !(interaction.channel.partial || interaction.channel instanceof DMChannel)) { // typescript is dumb
              amount += messages.size;
              await interaction.channel.bulkDelete(messages);
            } else processing = false;
          }
          return amount;
        })(),
        interaction.deferReply({ ephemeral: true })
      ]).then(([ amount ]) => interaction.editReply({
        content: `${emojis.tickyes} Deleted ${amount} messages.`
      }));
    } else return void interaction.reply({
      content: `${emojis.thumbsdown} Something went wrong and I couldn't fetch this message.`, ephemeral: true
    });
  }
} as ContextMenuCommand;