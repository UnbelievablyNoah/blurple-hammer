import { PrefixCommand } from "..";
import emojis from "../../constants/emojis";
import { inspect } from "util";
import { Message } from "discord.js";

export default {
  description: "Run JavaScript code",
  aliases: [ "checkdupes", "dupes", "nodupes" ],
  testArgs: args => Boolean(args.length),
  execute: async ({ channel }, _, { content }) => {
    try {
      const evaled = eval(content);
      if (evaled instanceof Promise) {
        const start = Date.now();
        return void Promise.all([ channel.send("♨️ Running..."), evaled ]).then(([ message, output ]: [ Message, unknown ]) => {
          const inspected = typeof output != "string" ? inspect(output) : evaled;
          return void message.edit(`${emojis.thumbsup} Evaluated successfully (\`${Date.now() - start}ms\`).\n\`\`\`js\n${inspected}\`\`\``);
        });
      } else {
        const inspected = typeof evaled != "string" ? inspect(evaled) : evaled;
        return void channel.send(`${emojis.thumbsup} Evaluated successfully.\n\`\`\`js\n${inspected}\`\`\``);
      }
    } catch(e) {
      const err = typeof e == "string" ?
        e.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)) :
        e;
      return void channel.send(`${emojis.weewoo} JavaScript failed.\n\`\`\`fix\n${err}\`\`\``);
    }
  }
} as PrefixCommand;