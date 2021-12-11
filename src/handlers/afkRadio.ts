import Handler from ".";
import channels from "../constants/channels";

const bot = "837825364540915762";

export default (async (client) => {
  client.on("voiceStateUpdate", (_, voice) => {
    if (
      voice.member?.id == bot &&
      voice.channel?.id == channels.afkVoice &&
      voice.serverMute
    ) voice.setMute(false);
  });
}) as Handler;