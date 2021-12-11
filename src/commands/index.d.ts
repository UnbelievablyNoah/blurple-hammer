import { ApplicationCommandOptionData, CommandInteraction, ContextMenuInteraction, Message } from "discord.js";
import { PermissionLevel } from "../constants/permissions";
import { SlashArgs } from "../handlers/interactions/commands";

export type Permissions = {
  [commandName: string]: PermissionLevel;
};

export type PrefixCommand = {
  description: string;
  usage?: {
    [arg: string]: string;
  };
  aliases?: Array<string>;
  testArgs(args: Array<string>, permissionLevel: number): boolean;
  mainOnly?: boolean;
  execute(message: Message, args: Array<string>, details: { content: string; }): Promise<void>;
};

export type SlashCommand = {
  description: string;
  options?: Array<ApplicationCommandOptionData>;
  execute(interaction: CommandInteraction, args: SlashArgs): Promise<void>;
};

export type ContextMenuCommand = {
  execute(interaction: ContextMenuInteraction): Promise<void>;
};