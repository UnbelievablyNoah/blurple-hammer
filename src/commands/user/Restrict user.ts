import { GuildMember, MessageActionRowOptions, MessageEmbedOptions } from "discord.js";
import { ContextMenuCommand } from "..";
import emojis from "../../constants/emojis";
import restrictions from "../../constants/restrictions";
import { components } from "../../handlers/interactions/components";

const alreadyEditing: Map<string, {
  moderator: GuildMember;
  timestamp: number;
  kick: (kickedBy: GuildMember) => void;
}> = new Map();

export default {
  execute: async interaction => {
    const editing = alreadyEditing.get(interaction.targetId);
    if (editing) {
      components.set(`${interaction.id}:kick_user`, async i => {
        if (alreadyEditing.get(interaction.targetId) == editing) {
          editing.kick(interaction.member as GuildMember);
          alreadyEditing.delete(interaction.targetId);
        }
        i.update({ content: `${emojis.thumbsup} You can now edit the user's restrictions.`, components: [] });
      });
      interaction.reply({
        content: `${emojis.weewoo} Staff member ${editing.moderator.toString()} is already editing <@${interaction.targetId}>'s restrictions (as of <t:${Math.round(editing.timestamp / 1000)}:R>).`,
        components: [{
          type: "ACTION_ROW",
          components: [{
            type: "BUTTON",
            label: `Kick ${editing.moderator.displayName} from editor`,
            customId: `${interaction.id}:kick_user`,
            style: "DANGER"
          }]
        }],
        ephemeral: true
      });
    } else {
      alreadyEditing.set(interaction.targetId, {
        moderator: interaction.member as GuildMember,
        timestamp: Date.now(),
        kick: kickedBy => interaction.editReply({
          content: `${emojis.tickno} Staff member ${kickedBy.toString()} kicked you from the editor.`,
          embeds: [], components: []
        })
      });

      const member = await interaction.guild?.members.fetch(interaction.targetId);
      if (!member) return; // this will never return
      const roles = new Set(member.roles.cache.filter(r => Boolean(restrictions.find(re => re.role == r.id))).map(r => r.id));

      restrictions.forEach(r => components.set(`${interaction.id}:toggle_${r.role}`, async i => {
        if (roles.has(r.role)) roles.delete(r.role); else roles.add(r.role);
        i.update({ embeds: [ createEmbed(roles, member) ], components: createComponents(roles, interaction.id) });
      }));

      components.set(`${interaction.id}:apply`, async i => {
        member.roles.set([ ...member.roles.cache.filter(r => Boolean(!restrictions.find(re => re.role == r.id))).map(r => r.id), ...Array.from(roles) ], `Role restrictions applied by ${interaction.user.tag} (${interaction.user.id})`);
        i.update({ content: `${emojis.thumbsup} Restrictions have been applied to user ${member.toString()} successfully.`, components: [] });
        alreadyEditing.delete(interaction.targetId);
      });

      components.set(`${interaction.id}:cancel`, async i => {
        i.update({ content: `${emojis.thumbsup} Cancelled and closed the restriction editor.`, embeds: [], components: [] });
        alreadyEditing.delete(interaction.targetId);
      });

      interaction.reply({
        content: `${emojis.hammer} Restricting user ${member.toString()}:`,
        embeds: [ createEmbed(roles, member) ],
        components: createComponents(roles, interaction.id),
        ephemeral: true
      });
    }
  }
} as ContextMenuCommand;

function createComponents(roles: Set<string>, identifier: string): Array<MessageActionRowOptions> {
  return [
    ...group(restrictions.map(r => ({
      type: "BUTTON",
      label: r.name,
      customId: `${identifier}:toggle_${r.role}`,
      style: roles.has(r.role) ? "PRIMARY" : "SECONDARY"
    })), 5).map(g => ({
      type: "ACTION_ROW",
      components: g
    })),
    {
      type: "ACTION_ROW",
      components: [
        {
          type: "BUTTON",
          label: "Apply and close",
          customId: `${identifier}:apply`,
          style: "SUCCESS"
        },
        {
          type: "BUTTON",
          label: "Cancel",
          customId: `${identifier}:cancel`,
          style: "DANGER"
        }
      ]
    }
  ] as Array<MessageActionRowOptions>;
}

function createEmbed(roles: Set<string>, member: GuildMember): MessageEmbedOptions {
  return {
    author: {
      name: member.user.tag,
      iconURL: member.user.displayAvatarURL({ format: "png", size: 64 })
    },
    description: restrictions.map(r => roles.has(r.role) ? `${emojis.weewoo} **${r.disallowed}**` : `${emojis.blank} ${r.allowed}`).join("\n"),
  };
}

function group<Type extends unknown>(list: Array<Type>, groupSize: number): Array<Array<Type>> {
  const res: Array<Array<Type>> = [];
  let i = 0;
  while (i + groupSize <= list.length) {
    res.push(list.slice(i, i + groupSize));
    i += groupSize;
  }
  return res;
}