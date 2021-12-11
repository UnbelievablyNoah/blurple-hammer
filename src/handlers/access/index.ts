import { APIMessage } from "discord-api-types";
import { WebhookClient } from "discord.js";
import config from "../../../config.json";
import Handler from "..";
import checkAccess from "./checkAccess";

const enabled = false;

export default (enabled ? async client => {
  setInterval(async () => {
    const users: Array<string> = [];
    await Promise.all(client.guilds.cache.map(guild => guild.members.fetch().then(members => members.forEach(member => users.push(member.id)))));

    for (const id of users.filter((u, i, a) => a.indexOf(u) === i)) await checkAccess(await client.users.fetch(id));
  }, 60000);

  client.on("guildMemberAdd", member => {
    if (member.guild.id !== config.guild) checkAccess(member.user);
  });

  // express
} : () => {/*disabled*/}) as Handler;

const webhook = new WebhookClient({ url: config.accessLog });

export const log = (content: string): Promise<APIMessage> => webhook.send({ content, allowedMentions: { parse: [], users: [], roles: [] } });