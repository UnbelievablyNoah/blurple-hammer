import { Message } from "discord.js";
import config from "../../config.json";
import { PrefixCommand } from "../commands";
import permissions from "../commands/prefix/_permissions";
import { emojiIds } from "../constants/emojis";
import { getPermissionLevel, ladder } from "../constants/permissions";
import fs from "fs";
import { join } from "path";

export const processCommand = async (message: Message): Promise<void> => {
  const contentNoPrefix = message.content.match(`^<@!?${message.client.user?.id}> `) ?
    message.content.split(" ").slice(1) :
    message.content.slice(config.prefix.length).split(" ");
  const commandOrAlias = contentNoPrefix.shift()?.toLowerCase() || "";
  const commandName = aliases.get(commandOrAlias) || commandOrAlias;

  const commandFile = commands.get(commandName);
  if (!commandFile) return;

  if (commandFile.mainOnly && message.guild?.id !== config.guild) return void message.channel.send("❌ This command only works in the main server.");

  const permissionLevel = await getPermissionLevel(message.author);
  if (permissionLevel < ladder[permissions[commandName]]) return void message.react(emojiIds.weewoo);

  const content = contentNoPrefix.join(" ");
  const args = (content.match(/"[^"]+"|[^ ]+/g) || []).map(arg => arg.startsWith("\"") && arg.endsWith("\"") ? arg.slice(1, -1) : arg);
  if (!commandFile.testArgs(args, permissionLevel)) return void message.react(emojiIds.thumbsdown);

  return commandFile.execute(message, args, { content });
};

const commands: Map<string, PrefixCommand> = new Map(), aliases: Map<string, string> = new Map();
fs.readdir(join(__dirname, "../commands/prefix"), async (err, files) => {
  if (err) return console.log(err);
  for (const file of files) if (!file.startsWith("_")) {
    const commandFile = await import(`../commands/prefix/${file}`);
    const fileName = file.slice(0, -3);
    commands.set(fileName, commandFile.default);
    if (commandFile.aliases) for (const alias of commandFile.aliases) aliases.set(alias, fileName);
  }
});