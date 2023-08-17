import fs from "node:fs/promises";
import path from "node:path";

export default function createTemporaryFolders(...directories: string[]) {
    directories.forEach(async directory => {
        try {
            await fs.mkdir(directory, { recursive: true }); 

            const files = await fs.readdir(directory);
            const deletePromises = files.map(file =>
                fs.unlink(path.join(directory, file)),
            );
    
            await Promise.allSettled(deletePromises);
            console.log(`Created temporary folder - ${directory}`);
        } catch(e) {
            console.error(`Error while cleaning/creating temporary folder - ${directory}`);
        }
    });
}