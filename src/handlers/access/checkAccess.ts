import { User } from "discord.js";
import { log } from ".";
import config from "../../../config.json";
import emojis from "../../constants/emojis";
import subservers from "../../constants/subservers";
import oauth from "../../utils/oauth";
import db from "../../database/oauth";
import calculator from "./calculator";

export default async (user: User): Promise<void> => {
  if (user.bot) return;

  const mainGuild = user.client.guilds.cache.get(config.guild);
  const mainMember = await mainGuild?.members.fetch(user);

  if (!mainMember) for (const subserver of subservers) {
    const server = user.client.guilds.cache.get(subserver.id);
    const member = await server?.members.fetch(user);
    if (member) await member.kick("Not in main server").then(() =>
      log(`${emojis.weewoo} User ${user.toString()} was kicked from **${subserver.name}** because they're not in the main server.`)
    );
  }

  else for (const subserver of subservers) {
    const { server, member, access, override, addRoles, removeRoles } = await calculator(user, subserver);

    if (!access && !override && member) await member.kick("User has no access and no override present").then(() =>
      log(`${emojis.weewoo} User ${user.toString()} was kicked from **${subserver.name}** because they don't have access and no override was present.`)
    );

    else if (access == 2 && !member) await new Promise(resolve => db.get(user.id).then(async tokens => oauth.tokenRequest({
      refreshToken: tokens.refresh_token,
      grantType: "refresh_token",
      scope: tokens.scope
    }).then(async ({ access_token, refresh_token, scope }) => {
      await db.set(user.id, { access_token, refresh_token, scope: scope.split(" ") });

      oauth.addMember({
        accessToken: access_token,
        botToken: user.client.token || config.token,
        guildId: server.id,
        userId: user.id,
        roles: addRoles
      })
        .then(() => resolve(log(`${emojis.weewoo} User ${user.toString()} was force-added to **${subserver.name}**.`)))
        .catch(resolve);
    }).catch(resolve)));
    else {
      if (access && member && addRoles.length) await member.roles.add(addRoles).then(() =>
        log(`${emojis.weewoo} User ${user.toString()} was given roles in **${subserver.name}**:\n> ${addRoles.map(r => `\`${r}\``).join(", ")}`)
      );
      if (access && member && removeRoles.length) await member.roles.remove(removeRoles).then(() =>
        log(`${emojis.weewoo} User ${user.toString()} had roles removed in **${subserver.name}**:\n> ${removeRoles.map(r => `\`${r}\``).join(", ")}`)
      );
    }
  }
};