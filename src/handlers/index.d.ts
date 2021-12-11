import { Client } from "discord.js";

type Handler = (client: Client<true>) => Promise<void>
export default Handler;