import { DMChannel, Message } from "discord.js";
import emojis from "../constants/emojis";

export const check = (message: Message): void => {
  const avatar = message.author.avatarURL({ format: "png", dynamic: true, size: 128 });
  if (!avatar) return void message.reply(`${emojis.tickno} You don't have an avatar!`).then(r => setTimeout(() =>
    message.channel.partial || message.channel instanceof DMChannel ? null : message.channel.bulkDelete([r, message]) // typescript is dumb, this will never be null since it's in a guild
  , 15000));

  message.channel.send({
    content: message.author.id,
    files: [ avatar ],
    components: [{
      type: "ACTION_ROW",
      components: [
        {
          type: "BUTTON",
          label: "Accept"
        }
      ]
    }]
  }).then(() => message.delete());
};