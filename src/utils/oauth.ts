import OAuth from "discord-oauth2";
import config from "../../config.json";

export default new OAuth({
  clientId: config.oauth.clientId,
  clientSecret: config.oauth.clientSecret,
  credentials: Buffer.from(`${config.oauth.clientId}:${config.oauth.clientSecret}`).toString("base64")
});