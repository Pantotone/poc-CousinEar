import fs from "node:fs";
import axios from "axios";
import FormData from "form-data";

export default async function CallOpenAIWhisper(audioFilePath: string): Promise<string> {
    const body = new FormData();
    body.append("file", fs.createReadStream(audioFilePath));
    body.append("model", "whisper-1");

    const data = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        body,
        {
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
                "Content-Type": "multipart/form-data"
            }
        }
    ).then(res => res.data);

    return data.text;
}