import { GuildChannel } from "discord.js";
import { SlashCommand } from "..";
import channels from "../../constants/channels";
import emojis from "../../constants/emojis";

export default {
  description: "Unlock the current channel, or all public channels",
  options: [{
    type: "BOOLEAN",
    name: "all",
    description: "Unlock all public channels"
  }],
  execute: async (interaction, { all = false }: { all: boolean; }) => {
    if (all) {
      const publicChannels = interaction.guild?.channels.cache.filter(ch => channels.public.includes(ch.id));
      if (!publicChannels) return; // this will never return

      return Promise.all([
        interaction.deferReply().then(() => true),
        ...publicChannels.map(ch => unlock(ch as GuildChannel))
      ]).then(() => interaction.editReply({
        content: `${emojis.thumbsup} All public channels have been unlocked.`
      }));
    } else {
      const success = await unlock(interaction.channel as GuildChannel);
      interaction.reply({
        content: success ?
          `${emojis.thumbsup} *This channel has been unlocked.*` :
          `${emojis.tickno} This channel is not locked.`,
        ephemeral: success ? false : true
      });
    }
  }
} as SlashCommand;

async function unlock(channel: GuildChannel): Promise<boolean> {
  const permissions = channel.permissionOverwrites.cache.find(po => po.id == channel.guild.roles.everyone.id);
  if (!permissions?.deny.has("SEND_MESSAGES")) return false;

  await channel.permissionOverwrites.edit(channel.guild.roles.everyone, { "SEND_MESSAGES": null, "ADD_REACTIONS": null });
  return true;
}