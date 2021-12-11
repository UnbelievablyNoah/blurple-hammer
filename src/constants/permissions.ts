import { GuildMember, User } from "discord.js";
import config from "../../config.json";
import roles from "./roles";

export type PermissionLevel = "NONE" | "BOT OWNER" | "PROJECT LEADS" | "EXECUTIVES" | "EXECUTIVE ASSISTANTS" | "MODERATOR" | "HELPER" | "PRODUCTION" | "ALL" | "COMMAND BANNED";

export const ladder: Record<PermissionLevel, number> = {
  "NONE": 8,
  "BOT OWNER": 7,
  "PROJECT LEADS": 6,
  "EXECUTIVES": 5,
  "EXECUTIVE ASSISTANTS": 4,
  "MODERATOR": 3,
  "HELPER": 2,
  "PRODUCTION": 1,
  "ALL": 0,
  "COMMAND BANNED": -1,
};

export const getPermissionLevel = async (user: User, rolesOverride?: Array<string>): Promise<number> => {
  if (config.owner == user.id) return 7;

  const guild = user.client.guilds.resolve(config.guild);
  const member = await guild?.members.fetch({ user, cache: true, force: false });

  if (member) {
    const memberRoles = rolesOverride || member.roles.cache.map(r => r.id);
    if (memberRoles.includes(roles.admin)) return 6;
    if (memberRoles.includes(roles.executive)) return 5;
    if (memberRoles.includes(roles.executive_assistant)) return 4;
    if (memberRoles.includes(roles.moderator)) return 3;
    if (memberRoles.includes(roles.helper)) return 2;
    if (memberRoles.includes(roles.production)) return 1;
    if (memberRoles.includes(roles.bot_ban)) return -1;
  }

  return 0;
};