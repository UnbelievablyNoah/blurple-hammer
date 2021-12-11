import { PrefixCommand } from "..";
import emojis from "../../constants/emojis";
import { msToTime } from "../../utils/time";

export default {
  description: "Get the latency of the bot",
  aliases: [ "pong", "latency", "uptime" ],
  testArgs: args => !args.length,
  execute: async ({ client, channel }) => {
    const start = Date.now();
    return void channel.send(`${emojis.loading} Pinging...`).then(
      message => message.edit(`${emojis.sparkle} Server latency is \`${Date.now() - start}ms\`, API latency is \`${Math.round(client.ws.ping)}ms\` and my uptime is \`${msToTime(client.uptime || 0)}\`.`)
    );
  }
} as PrefixCommand;