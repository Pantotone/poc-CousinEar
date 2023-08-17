import { temporaryFolder } from "../utils/consts";
import { exec } from "child_process";

export default async function CallWhisperCLI(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {

        exec(`whisper-ctranslate2 --model small --language Portuguese --compute_type int8 ${filePath} --output_dir ${temporaryFolder} --output_format txt`, (err, stdout, stderr) => {
            if(err || stderr) {
                reject();
            }

            const processedText = stdout
                .replace(/\[\d{2}:\d{2}.\d{3}\s-->\s\d{2}:\d{2}.\d{3}\]/gm, "")
                .split("\n")
                .slice(1, -2)
                .join("\n");

            resolve(processedText);
        });

    });
}