import fs from "fs/promises";
import { transcriptionsFolder } from "../utils/consts";
import { exec } from "child_process";
import path from "node:path";

export default async function CallWhisperCLI(audioFilePath: string): Promise<string> {
    return new Promise((resolve, reject) => {

        exec(`whisper-ctranslate2 --model small --language Portuguese --compute_type int8 ${audioFilePath} --output_dir ${transcriptionsFolder} --output_format txt`, async (err, stdout, stderr) => {
            if(err || stderr) {
                reject();
            }

            const id = path.basename(audioFilePath, path.extname(audioFilePath));
            const transcriptionsFilePath = path.join(transcriptionsFolder, `${id}.txt`);
            const processedText = await fs.readFile(transcriptionsFilePath, { encoding: "utf-8" });

            resolve(processedText);
        });

    });
}