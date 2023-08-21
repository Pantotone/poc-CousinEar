import path from "node:path";
import * as consts from "@cousinear/utils/consts";
import { GuildMember } from "discord.js";
import * as prism from "prism-media";
import { pipeline } from "node:stream";
import {createWriteStream} from "node:fs";
import fs from "node:fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import recordMemberStream from "@cousinear/utils/recordMemberStream";
import { AllowedTypeChannels } from "@cousinear/types";
const execAwait = promisify(exec);

export async function RecordVoiceToMP3(voiceChannel: AllowedTypeChannels, member: GuildMember): Promise<string> {
    const startTime = Date.now();
    const id = `${member.id}-${startTime}`;
    
    const opusStream = recordMemberStream(voiceChannel, member);
    
    const pcmStream = new prism.opus.Decoder({
        frameSize: consts.frameSize, 
        channels: consts.channels, 
        rate: consts.rate
    });

    const rawRecordingFilePath = path.join(consts.recordingFolder, `${id}.pcm`);
    const pcmOutStream = createWriteStream(rawRecordingFilePath);

    return new Promise((resolve, reject) => {
        pipeline(opusStream, pcmStream, pcmOutStream, async (err) => {

            if(err) reject(`Error recording file ${rawRecordingFilePath} - ${err.message}`);

            try {
                const mp3Path = path.join(consts.recordingFolder, `${id}.mp3`);

                await execAwait(`ffmpeg -f s16le -ar ${consts.frameSize} -ac ${consts.channels} -i ${rawRecordingFilePath} ${mp3Path}`);
                resolve(mp3Path);
                
                fs.rm(rawRecordingFilePath);
            } catch(e) {
                console.error(e);
                reject(e);
            }
        });
    });

}