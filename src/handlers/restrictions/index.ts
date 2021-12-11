import Handler from "..";
import nickname from "./nickname";

export default (async (client) => {
  nickname(client);
}) as Handler;