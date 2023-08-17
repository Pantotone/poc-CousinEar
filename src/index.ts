import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { recordingFolder, transcriptionsFolder } from "./utils/consts";
import { OnReady } from "./handlers/OnReady";
import createTemporaryFolders from "./utils/createTemporaryFolders";
import { server } from "./http";

createTemporaryFolders(recordingFolder, transcriptionsFolder);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.once(Events.ClientReady, OnReady);

client.login(process.env.DISCORD_TOKEN);
server.listen(process.env.PORT || 3000);