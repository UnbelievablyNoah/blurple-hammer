import { createDatabase } from ".";

export type OAuthData = {
  access_token: string;
  refresh_token: string;
  scope: Array<string>;
}

export default createDatabase<OAuthData>("oauth");