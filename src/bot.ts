import { Client, Options } from "discord.js";
import config from "../config.json";
import fs from "fs";
import Handler from "./handlers";
import { emojiIds } from "./constants/emojis";
import { react as dutyPing } from "./handlers/dutyPing";
import { processCommand as messageCommand } from "./handlers/messageCommands";
import { join } from "path";
import { check as blurpleCheck } from "./handlers/manualBlurpleCheck";
import channels from "./constants/channels";
import roles from "./constants/roles";

const client = new Client({
  makeCache: Options.cacheWithLimits({
    MessageManager: 50,
  }),
  partials: [ "USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION" ],
  userAgentSuffix: [ "https://projectblurple.com" ],
  presence: { status: "online" },
  intents: [ "GUILDS", "GUILD_MESSAGES" ] // todo
});

const handlers: Array<Handler> = [];
fs.readdir(join(__dirname, "./handlers"), async (err, files) => err ? console.log(err) : handlers.push(...(await Promise.all(files.map(async f => await import(`./handlers/${f}`)))).filter(handler => typeof handler.default == "function").map(handler => handler.default)));

client.once("ready", client => {
  console.log(`Ready as ${client.user.tag}!`);
  handlers.forEach(handler => handler(client));
});

client.on("messageCreate", async message => {
  if (
    !message.guild ||
    message.type !== "DEFAULT" ||
    message.author.bot
  ) return;

  if (message.channel.id == channels.manualCheck) return blurpleCheck(message);

  // duty ping handler
  const sod = message.mentions.roles.find(r => r.id == roles.staff_on_duty);
  if (sod) dutyPing(message, sod);

  // commands handler
  if (message.content.startsWith(config.prefix) || message.content.match(`^<@!?${client.user?.id}> `)) messageCommand(message);
  else if (message.content.match(`^<@!?${client.user?.id}>`)) await message.react(emojiIds.wave);
});

client.login(config.token);

process.on("unhandledRejection", console.log);