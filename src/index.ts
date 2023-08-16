import "dotenv/config";
import { Client, Events, GatewayIntentBits, VoiceChannel } from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);

    const voiceChannel = process.env.DISCORD_TEST_VOICECHANNEL_ID ? await client.channels.fetch(process.env.DISCORD_TEST_VOICECHANNEL_ID) as VoiceChannel : undefined;
    const guild = process.env.DISCORD_TEST_GUILD_ID ? await client.guilds.fetch(process.env.DISCORD_TEST_GUILD_ID) : undefined;

    if(guild && voiceChannel) {
        joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: true,
        });
    }
});

client.login(process.env.DISCORD_TOKEN);