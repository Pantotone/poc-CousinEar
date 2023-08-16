import "dotenv/config";
import { Client, Events, GatewayIntentBits, GuildMember, VoiceChannel } from "discord.js";
import { EndBehaviorType, getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import path from "node:path";
import { pipeline } from "node:stream";
import os from "node:os";
import fs from "node:fs";
import { exec } from "child_process";
import { promisify } from "util";
import * as prism from "prism-media";
const execAwait = promisify(exec);

const temporaryFolder = path.join(os.tmpdir(), "cousinear");
const recordingFolder = path.join(temporaryFolder, "recordings");

fs.mkdir(recordingFolder, { recursive: true }, () => {
    console.log(`Created temporary recording folder - ${recordingFolder}`);
});

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.once(Events.ClientReady, async c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);

    const voiceChannel = process.env.DISCORD_TEST_VOICECHANNEL_ID ? await client.channels.fetch(process.env.DISCORD_TEST_VOICECHANNEL_ID) as VoiceChannel : undefined;
    const guild = process.env.DISCORD_TEST_GUILD_ID ? await client.guilds.fetch(process.env.DISCORD_TEST_GUILD_ID) : undefined;

    if(guild && voiceChannel) {
        const voiceConnection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: true,
        });
        
        voiceConnection.receiver.speaking.on("start", userId => {
            const member = voiceChannel.members.get(userId);
            if(!member) return;
            
            record(guild.id, member);
        });
    }
});


function record(guildId: string, member: GuildMember) {
    const voiceConnection = getVoiceConnection(guildId);
    if(!voiceConnection) throw new Error(`There's no voice connection with guild ${guildId}`);

    const startTime = Date.now();
    const recordingFilePath = path.join(recordingFolder, `${member.id}-${startTime}.pcm`);

    const opusStream = voiceConnection.receiver.subscribe(member.id, {
        end: {
            behavior: EndBehaviorType.AfterSilence,
            duration: 1000
        }
    });

    const frameSize = 16000;
    const channels = 1;
    const rate = 16000;

    const pcmStream = new prism.opus.Decoder({
        frameSize, channels, rate
    });

    const out = fs.createWriteStream(recordingFilePath);

    // console.log(`Started recording: ${member.user.displayName} - ${startTime}`);

    pipeline(opusStream, pcmStream, out, async (err) => {
        if (err) {
            console.warn(`Error recording file ${recordingFilePath} - ${err.message}`);
        } else {
            const mp3 = recordingFilePath.replace(".pcm", ".mp3");
            await execAwait(`ffmpeg -f s16le -ar ${frameSize} -ac ${channels} -i ${recordingFilePath} ${mp3}`);

            const { stdout } = await execAwait(`whisper --model base --language pt --fp16 False ${mp3} --output_dir ${temporaryFolder} --output_format txt`);

            console.log(`${member.user.displayName}: ${stdout}`);
        }
    });
}

client.login(process.env.DISCORD_TOKEN);