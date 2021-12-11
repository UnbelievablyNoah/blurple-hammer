import { SlashCommand } from "..";
import emojis from "../../constants/emojis";
import { msToTime } from "../../utils/time";

export default {
  description: "Get the latency of the bot",
  execute: async interaction => {
    const start = Date.now();
    interaction.deferReply().then(() => interaction.editReply({
      content: `${emojis.sparkle} Server latency is \`${Date.now() - start}ms\`, API latency is \`${Math.round(interaction.client.ws.ping)}ms\` and my uptime is \`${msToTime(interaction.client.uptime || 0)}\`.`
    }));
  }
} as SlashCommand;