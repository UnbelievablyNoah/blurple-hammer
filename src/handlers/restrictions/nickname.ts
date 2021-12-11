import { User } from "discord.js";
import Handler from "..";
import config from "../../../config.json";
import restrictions from "../../constants/restrictions";

export default (async (client) => {
  const restriction = restrictions.find(r => r.name == "nick");
  if (!restriction) return;

  const role = client.guilds.cache.get(config.guild)?.roles.cache.get(restriction.role);
  if (role) client.on("guildMemberUpdate", async (old, member) => {
    if (
      old.nickname !== member.nickname &&
      member.roles.cache.has(role.id)
    ) {
      const audits = await member.guild.fetchAuditLogs({ type: "MEMBER_UPDATE", user: member });
      const entry = audits.entries.sort((a, b) => b.createdTimestamp - a.createdTimestamp).find(e => Boolean(
        e.target instanceof User && e.target.id == member.id && e.changes?.find(ch => ch.key == "nick")
      ));

      if (entry?.executor?.id == member.id) member.edit({ nick: old.nickname });
    }
  });
}) as Handler;