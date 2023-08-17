import fs from "fs/promises";
import { transcriptionsFolder } from "../utils/consts";
import { exec } from "child_process";
import path from "node:path";

export default async function CallWhisperCLI(audioFilePath: string): Promise<string> {

    const language = process.env.WHISPER_LANGUAGE || "Portuguese";
    const computeType = process.env.WHISPER_COMPUTE_TYPE || "int8";
    const model = process.env.WHISPER_MODEL || "small";

    const cli = process.env.WHISPER_CLI || "whisper";
    const cliCommands: {[key: string]: string} = {
        "whisper": `whisper --model ${model} --language ${language} --fp16 ${computeType.toLowerCase() === "float16" ? "True" : "False"} ${audioFilePath} --output_dir ${transcriptionsFolder} --output_format txt`,
        "whisper-ctranslate2": `whisper-ctranslate2 --model ${model} --language ${language} --compute_type ${computeType} ${audioFilePath} --output_dir ${transcriptionsFolder} --output_format txt`,
    };

    return new Promise((resolve, reject) => {

        exec(cliCommands[cli] || cliCommands["whisper"], async (err, stdout, stderr) => {
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