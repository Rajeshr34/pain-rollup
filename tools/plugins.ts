import { copy, replaceContent } from "aria-build";

export async function replace(filename: string) {
    await replaceContent({
        filename,
        strToFind: "../src",
        strToReplace: "../rollup",
        extensions: [".mjs"],
    });
    return replaceContent({
        filename,
        strToFind: "./bin/exec.mjs",
        strToReplace: "./node_modules/rollup/bin/exec.mjs",
    });
}

export const plugins = [
    copy({
        targets: [{ src: "bin/*", dest: "dist/bin", replace }],
    }),
];
