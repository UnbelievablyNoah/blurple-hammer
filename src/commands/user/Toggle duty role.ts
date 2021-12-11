import { ContextMenuCommand } from "..";
import emojis from "../../constants/emojis";
import { getPermissionLevel, ladder } from "../../constants/permissions";
import roles from "../../constants/roles";

export default {
  execute: async interaction => {
    const member = await interaction.guild?.members.fetch(interaction.targetId);
    if (!member) return; // this will never return

    if (await getPermissionLevel(member.user) < ladder["HELPER"]) return interaction.reply({
      content: `${emojis.weewoo} You can't toggle the duty role of a user with a permission level lower than HELPER.`,
      ephemeral: true
    });

    if (member.roles.cache.has(roles.staff_on_duty)) {
      member.roles.remove(roles.staff_on_duty, `Removed by ${interaction.user.tag} (${interaction.user.id})`);
      return interaction.reply({ content: `${emojis.thumbsup} User ${member.toString()} no longer has the <@&${roles.staff_on_duty}> role.`, ephemeral: true });
    } else {
      member.roles.add(roles.staff_on_duty, `Added by ${interaction.user.tag} (${interaction.user.id})`);
      return interaction.reply({ content: `${emojis.thumbsup} User ${member.toString()} now has the <@&${roles.staff_on_duty}> role.`, ephemeral: true });
    }
  }
} as ContextMenuCommand;