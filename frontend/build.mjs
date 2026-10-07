import { cp, mkdir, writeFile } from "node:fs/promises";

const apiBaseUrl = process.env.API_BASE_URL;
const maptilerKey = process.env.MAPTILER_KEY;

if ( !apiBaseUrl || !maptilerKey ) {
    throw new Error('missing api url or maptiler key')
}

await mkdir("dist", { recursive: true });
await cp("index.html", "dist/index.html");
await cp("css/", "dist/css/", { recursive: true });
await cp("components/", "dist/components/", { recursive: true });

const configContents = `
    export const API_BASE_URL = ${JSON.stringify(apiBaseUrl)};
    export const MAPTILER_KEY = ${JSON.stringify(maptilerKey)};
`;

await writeFile("dist/config.js", configContents, "utf8");