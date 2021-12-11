import { GuildChannel, GuildMember } from "discord.js";
import { SlashCommand } from "..";
import channels from "../../constants/channels";
import emojis from "../../constants/emojis";
import roles from "../../constants/roles";

export default {
  description: "Lock the current channel, or all public channels",
  options: [{
    type: "BOOLEAN",
    name: "all",
    description: "Lock all public channels"
  }],
  execute: async (interaction, { all = false }: { all: boolean; }) => {
    if (all) {
      const publicChannels = interaction.guild?.channels.cache.filter(ch => channels.public.includes(ch.id));
      if (!publicChannels) return; // this will never return

      return Promise.all([
        interaction.deferReply().then(() => true),
        ...publicChannels.map(ch => lock(ch as GuildChannel))
      ]).then(() => interaction.editReply({
        content: `${emojis.weewoo} ***All public channels have been locked.***`
      }));
    } else {
      const success = await lock(interaction.channel as GuildChannel);
      interaction.reply({
        content: success ?
          `${emojis.weewoo} ***This channel has been locked.***` :
          `${emojis.tickno} This channel is already locked.`,
        ephemeral: success ? false : true
      });
    }
  }
} as SlashCommand;

async function lock(channel: GuildChannel): Promise<boolean> {
  const permissions = channel.permissionOverwrites.cache.find(po => po.id == channel.guild.roles.everyone.id);
  if (permissions?.deny.has("SEND_MESSAGES")) return false;

  await channel.permissionOverwrites.edit(channel.guild.me as GuildMember, { "SEND_MESSAGES": true });
  await channel.permissionOverwrites.edit(roles.moderator, { "SEND_MESSAGES": true });
  await channel.permissionOverwrites.edit(channel.guild.roles.everyone, { "SEND_MESSAGES": false, "ADD_REACTIONS": false });
  return true;
}