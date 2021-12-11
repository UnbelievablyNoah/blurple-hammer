import { MessageComponentInteraction } from "discord.js";

type ComponentInteractionCallback = (interaction: MessageComponentInteraction) => Promise<void>;
interface ComponentInteractionDetails {
  allowedUsers: Array<string> | null;
  callback: ComponentInteractionCallback;
}

export const components: Map<string, ComponentInteractionCallback | ComponentInteractionDetails> = new Map();

export default (interaction: MessageComponentInteraction): void => {
  const detailsOrCallback = components.get(interaction.customId);
  if (detailsOrCallback) {
    if (typeof detailsOrCallback == "function") {
      if (!interaction.message.interaction || interaction.message.interaction.user.id == interaction.user.id) detailsOrCallback(interaction);
    } else {
      const { allowedUsers, callback } = detailsOrCallback;
      if (allowedUsers == null || allowedUsers.includes(interaction.user.id)) callback(interaction);
    }
  }
};