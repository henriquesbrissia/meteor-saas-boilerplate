import { createClient } from "grubba-rpc";
import { Server } from "/server/main";

export const api = createClient<Server>()