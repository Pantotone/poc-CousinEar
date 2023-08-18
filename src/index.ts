import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { recordingFolder, transcriptionsFolder } from "@cousinear/utils/consts";
import { OnReady } from "@cousinear/events/OnReady";
import createTemporaryFolders from "@cousinear/utils/createTemporaryFolders";
import { server } from "./http";

createTemporaryFolders(recordingFolder, transcriptionsFolder);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.once(Events.ClientReady, OnReady);

client.login(process.env.DISCORD_TOKEN);
server.listen(process.env.PORT || 3000);