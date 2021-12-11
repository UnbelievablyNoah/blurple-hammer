import { ContextMenuCommand } from "..";
import emojis from "../../constants/emojis";
import roles from "../../constants/roles";

export default {
  execute: async interaction => {
    const member = await interaction.guild?.members.fetch(interaction.targetId);
    if (!member) return; // this will never return

    if (member.roles.cache.has(roles.blurple_users)) {
      member.roles.remove(roles.blurple_users, `Removed by ${interaction.user.tag} (${interaction.user.id})`);
      return interaction.reply({ content: `${emojis.thumbsup} User ${member.toString()} no longer has the <@&${roles.blurple_users}> role.`, ephemeral: true });
    } else {
      member.roles.add(roles.blurple_users, `Added by ${interaction.user.tag} (${interaction.user.id})`);
      return interaction.reply({ content: `${emojis.thumbsup} User ${member.toString()} now has the <@&${roles.blurple_users}> role.`, ephemeral: true });
    }
  }
} as ContextMenuCommand;