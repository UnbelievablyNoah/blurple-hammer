import { ContextMenuCommand } from "..";
import emojis from "../../constants/emojis";
import { getPermissionLevel } from "../../constants/permissions";
import roles from "../../constants/roles";
import strips from "../../database/strips";

export default {
  execute: async interaction => {
    const member = await interaction.guild?.members.fetch(interaction.targetId);
    if (!member) return; // this will never return

    const strip = await strips.get(member.id);
    if (strip) {
      strips.unset(member.id);

      member.roles.add(strip as Array<string>, `Unstripped by ${interaction.user.tag} (${interaction.user.id})`);
      return interaction.reply({
        content: `${emojis.thumbsup} ${interaction.user.id == member.id ?
          "You're now unstripped. Welcome back." :
          `${member.toString()} is now unstripped.`
        }`,
        ephemeral: true
      });
    } else if (await getPermissionLevel(interaction.user) < 1) interaction.reply({
      content: `${emojis.thumbsdown} You don't have permission to strip.`,
      ephemeral: true
    }); else {
      const memberRoles = member.roles.cache.filter(r =>
        r.id !== roles.muted &&
        r.id !== interaction.guild?.roles.everyone.id &&
        !r.managed && (r.guild.me?.roles.highest.position || 0) > r.position
      ).map(r => r.id);
      strips.set(member.id, memberRoles);
      member.roles.remove(memberRoles, `Stripped by ${interaction.user.tag} (${interaction.user.id})`);
      return interaction.reply({
        content: `${emojis.thumbsup} ${interaction.user.id == member.id ?
          "You're now stripped. Farewell." :
          `${member.toString()} is now stripped.`
        }`,
        ephemeral: true
      });
    }
  }
} as ContextMenuCommand;