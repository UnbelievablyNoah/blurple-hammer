import { SlashCommand } from "..";
import emojis from "../../constants/emojis";
import db from "../../database/oauth";
import config from "../../../config.json";
import oauth from "../../utils/oauth";

export default {
  description: "Check if your staff authentication is set up correctly",
  execute: async interaction => {
    const tokens = await db.get(interaction.user.id);

    if (!tokens) return interaction.reply({
      content: `${emojis.tickno} Your authentication is not set up, click [here](${config.auth.link}) to authenticate.`,
      ephemeral: true
    });

    oauth.tokenRequest({
      refreshToken: tokens.refresh_token,
      grantType: "refresh_token",
      scope: tokens.scope
    }).then(({ access_token, refresh_token, scope }) => {
      db.set(interaction.user.id, { access_token, refresh_token, scope: scope.split(" ") });
      interaction.reply({
        content: `${emojis.thumbsup} Your authentication is working. Join subservers with \`/join\``,
        ephemeral: true
      });
      // todo check member access
    }).catch(() => interaction.reply({
      content: `${emojis.weewoo} Your authentication is not working, click [here](${config.auth.link}) to re-authenticate.`,
      ephemeral: true
    }));
  }
} as SlashCommand;