import { Permissions } from "..";

export default {
  "Restrict user": "MODERATOR",
  "Strip user": "ALL", // stripped users doesn't have permission to unstrip themselves if they don't have any roles. the strip command has a check built-in already.
  "Toggle blurple role": "HELPER",
  "Toggle duty role": "HELPER",
} as Permissions;