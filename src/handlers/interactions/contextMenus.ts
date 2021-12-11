import { ContextMenuInteraction } from "discord.js";
import { ContextMenuCommand } from "../../commands";

export default async (interaction: ContextMenuInteraction): Promise<void> => {
  const contextMenuFile = (await import(`../../commands/${interaction.targetType.toLowerCase()}/${interaction.commandName}`)).default as ContextMenuCommand;
  contextMenuFile.execute(interaction);
};