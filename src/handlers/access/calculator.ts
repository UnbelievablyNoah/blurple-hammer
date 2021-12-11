import { Guild, GuildMember, User } from "discord.js";
import { Subserver } from "../../constants";
import config from "../../../config.json";
import { accessLadder } from "../../constants/subservers";
import accessOverrides, { OverrideData } from "../../database/accessOverrides";
import strips from "../../database/strips";

type AccessData = {
  server: Guild;
  member: GuildMember;
  access: number;
  override: OverrideData;
  addRoles: Array<string>;
  removeRoles: Array<string>;
};

export default async (user: User, subserver: Subserver): Promise<AccessData> => {
  const mainGuild = user.client.guilds.cache.get(config.guild);
  const mainMember = await mainGuild?.members.fetch(user);
  const mainRoles = [
    ...(mainMember?.roles.cache.map(r => r.id) || []),
    ...(await strips.get(user.id) || []),
    user.id
  ];

  const server = user.client.guilds.cache.get(subserver.id);
  const member = await server?.members.fetch(user);
  const roles = member ? member.roles.cache.map(r => r.id) : [];

  const access = Math.max(0, ...mainRoles.map(id => subserver.staffAccess[id] ? accessLadder[subserver.staffAccess[id].access] : 0));
  const override = (await accessOverrides.get(user.id) || []).find(o => o.subserver == subserver.id);

  const subRoles: Array<string> = []; Object.values(subserver.staffAccess).forEach(staffRoles => subRoles.push(...staffRoles.roles));
  const allowedRoles: Array<string> = []; mainRoles.map(id => subserver.staffAccess[id] ? subserver.staffAccess[id].roles : []).forEach(roles => allowedRoles.push(...roles));

  const addRoles = allowedRoles.filter((id, i, arr) => !roles.includes(id) && arr.indexOf(id) === i);
  const removeRoles = roles.filter((id, i, arr) => !allowedRoles.includes(id) && arr.indexOf(id) === i);

  return { server, member, access, override, addRoles, removeRoles } as AccessData;
};