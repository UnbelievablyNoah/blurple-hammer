import { Message, Role } from "discord.js";
import Handler from ".";
import { emojiIds } from "../constants/emojis";

export default (async () => {/* no handler default */}) as Handler;

export const react = async (message: Message, sod: Role): Promise<void> => {
  await sod.setMentionable(false, `Role was pinged in channel ${message.channel.id}`);
  await message.react(emojiIds.weewoo);
  setTimeout(() => sod.setMentionable(true), 120000);
};