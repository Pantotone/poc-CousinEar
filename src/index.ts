import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";
import fs from "node:fs";
import { recordingFolder } from "./utils/consts";
import { OnReady } from "./handlers/OnReady";

fs.mkdir(recordingFolder, { recursive: true }, () => {
    console.log(`Created temporary recording folder - ${recordingFolder}`);
});

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.once(Events.ClientReady, OnReady);

client.login(process.env.DISCORD_TOKEN);