import { SlashCommand } from "..";
import { Subserver } from "../../constants";
import emojis from "../../constants/emojis";
import db from "../../database/oauth";
import config from "../../../config.json";
import oauth from "../../utils/oauth";
import subservers from "../../constants/subservers";

export default {
  description: "Join a subserver (requires staff authentication set up)",
  options: [{
    type: "STRING",
    name: "subserver",
    description: "The subserver you want to join",
    required: true,
    choices: subservers.map(sub => ({
      name: sub.name, value: sub.acronym
    }))
  }],
  execute: async (interaction, { subserver }: { subserver: Subserver["acronym"] }) => {
    const tokens = await db.get(interaction.user.id);

    if (!tokens) return interaction.reply({
      content: `${emojis.tickno} Your authentication is not set up, click [here](${config.auth.link}) to authenticate.`,
      ephemeral: true
    });

    oauth.tokenRequest({
      refreshToken: tokens.refresh_token,
      grantType: "refresh_token",
      scope: tokens.scope
    }).then(async ({ access_token, refresh_token, scope }) => {
      db.set(interaction.user.id, { access_token, refresh_token, scope: scope.split(" ") });

      const server = subservers.find(sub => sub.acronym === subserver);
      // todo
    });
  }
} as SlashCommand;