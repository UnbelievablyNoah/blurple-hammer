import { ApplicationCommandData, ApplicationCommandOption, ApplicationCommandOptionData, ApplicationCommandPermissionData, ApplicationCommandSubCommandData, ChatInputApplicationCommandData, MessageApplicationCommandData, UserApplicationCommandData } from "discord.js";
import Handler from "..";
import config from "../../../config.json";
import fs from "fs";
import { join } from "path";
import commandHandler from "./commands";
import contextMenuHandler from "./contextMenus";
import componentHandler from "./components";
import slashPermissions from "../../commands/slash/_permissions";
import userPermissions from "../../commands/user/_permissions";
import messagePermissions from "../../commands/message/_permissions";
import { ladder, PermissionLevel } from "../../constants/permissions";
import roles from "../../constants/roles";

export default (async (client) => {
  const guild = client.guilds.cache.get(config.guild);
  if (!guild) return;
  guild.commands.set(([
    ...(await nestCommands("../../commands/slash", "CHAT_INPUT")),
    ...(await nestCommands("../../commands/user", "USER")),
    ...(await nestCommands("../../commands/message", "MESSAGE")),
  ] as Array<ApplicationCommandData>).map(c => {
    c.defaultPermission = ladder[slashPermissions[c.name] || userPermissions[c.name] || messagePermissions[c.name] || "NONE"] == 0;
    return c;
  })).then(commands => guild.commands.permissions.set({ fullPermissions: commands.map(({ name, id }) => ({ id, permissions: getPermissions(slashPermissions[name] || userPermissions[name] || messagePermissions[name]) })) }));

  client.on("interactionCreate", async interaction => {
    if (interaction.isMessageComponent()) return componentHandler(interaction);
    if (interaction.isCommand()) return commandHandler(interaction);
    if (interaction.isContextMenu()) return contextMenuHandler(interaction);
  });
}) as Handler;

function nestCommands(relativePath: string, type: string): Promise<Array<ApplicationCommandData | ApplicationCommandOption>> {
  return new Promise(resolve => fs.readdir(join(__dirname, relativePath), async (err, files) => {
    if (err) return console.log(err);

    const arr = [];
    for (const file of files) {
      if (file.endsWith(".js") && !file.startsWith("_")) {

        const { description, options }: {
          description?: string;
          options?: Array<ApplicationCommandOption>;
        } = (await import(`${relativePath}/${file}`)).default;

        const name = file.replace(".js", "");

        if (type == "USER") arr.push({
          type: "USER", name
        } as UserApplicationCommandData);

        else if (type == "MESSAGE") arr.push({
          type: "MESSAGE", name
        } as MessageApplicationCommandData);

        else if (type == "CHAT_INPUT") arr.push({
          type: "CHAT_INPUT", name,
          description: description || "No description",
          options: options || []
        } as ChatInputApplicationCommandData);

        else if (type == "SUB_COMMAND") arr.push(({
          type: "SUB_COMMAND", name,
          description: description || "No description",
          options: options || []
        } as ApplicationCommandOptionData & ApplicationCommandSubCommandData) as ApplicationCommandOption);

      } else if (!file.includes(".")) {
        if (type == "SUB_COMMAND") type = "SUB_COMMAND_GROUP";
        const options = await nestCommands(`${relativePath}/${file}`, "SUB_COMMAND") as Array<ApplicationCommandOption>;
        arr.push({ name: file, description: "Sub-command.", options, type } as ChatInputApplicationCommandData);
      }
    }
    return resolve(arr);
  }));
}

function getPermissions(permission: PermissionLevel = "ALL") {
  const ranking = ladder[permission] || ladder["NONE"];
  const permissions: Array<ApplicationCommandPermissionData> = [];

  if (ranking != 0) {
    if (ranking <= 7) permissions.push({ type: "USER", id: config.owner,              permission: true });
    if (ranking <= 6) permissions.push({ type: "ROLE", id: roles.admin,               permission: true });
    if (ranking <= 5) permissions.push({ type: "ROLE", id: roles.executive,           permission: true });
    if (ranking <= 4) permissions.push({ type: "ROLE", id: roles.executive_assistant, permission: true });
    if (ranking <= 3) permissions.push({ type: "ROLE", id: roles.moderator,           permission: true });
    if (ranking <= 2) permissions.push({ type: "ROLE", id: roles.helper,              permission: true });
    if (ranking <= 1) permissions.push({ type: "ROLE", id: roles.production,          permission: true });
  }

  return permissions;
}