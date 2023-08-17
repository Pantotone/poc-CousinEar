import path from "node:path";
import os from "node:os";

export const temporaryFolder = path.join(os.tmpdir(), "cousinear");
export const recordingFolder = path.join(temporaryFolder, "recordings");

export const frameSize = 16000;
export const channels = 1;
export const rate = 16000;