import { CommandInteraction, CommandInteractionOption, CommandInteractionOptionResolver } from "discord.js";
import { getPermissionLevel, ladder } from "../../constants/permissions";
import permissions from "../../commands/slash/_permissions";
import { SlashCommand } from "../../commands";

export default async (interaction: CommandInteraction): Promise<void> => {
  const command = interaction.guild?.commands.cache.find(c => c.name == interaction.commandName);

  if (command && interaction.guild) {
    const permissionLevel = await getPermissionLevel(interaction.user);
    if (permissionLevel < ladder[permissions[command.name] || "NONE"]) return;

    const path = [ command.name ];

    const subCommandOrGroup = command.options.find(o => o.type == "SUB_COMMAND" || o.type == "SUB_COMMAND_GROUP");
    if (subCommandOrGroup) {
      path.push(subCommandOrGroup.name);
      const subCommand = subCommandOrGroup.options?.find(o => o.type == "SUB_COMMAND");
      if (subCommand) path.push(subCommand.name);
    }

    const commandFile = (await import(`../../commands/slash/${path.join("/")}`)).default as SlashCommand;
    commandFile.execute(interaction, getSlashArgs(interaction.options.data));
  }
};

export type SlashArgs = { [arg: string]: CommandInteractionOption["value"] };

function getSlashArgs(options: CommandInteractionOptionResolver["data"]): SlashArgs {
  if (!options[0]) return {};
  if (options[0].options) return getSlashArgs(options[0].options);

  const args: SlashArgs = {};
  for (const o of options) args[o.name] = o.value;
  return args;
}