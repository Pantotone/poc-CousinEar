import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";
import fs from "node:fs";
import { recordingFolder, transcriptionsFolder } from "./utils/consts";
import { OnReady } from "./handlers/OnReady";

[recordingFolder, transcriptionsFolder].forEach(path => {
    fs.mkdir(path, { recursive: true }, () => {
        console.log(`Created temporary folder - ${path}`);
    });
});

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.once(Events.ClientReady, OnReady);

client.login(process.env.DISCORD_TOKEN);