import { ESLint } from "eslint";
import { BuildOptionBundle } from "../interfaces/cli.interface";
import { extensions } from "./extensions";

export async function eslint(options: BuildOptionBundle) {
    try {
        const eslint = new ESLint({ fix: !options.checkOnly });
        const files = extensions(options["e-ext"]);
        const results = await eslint.lintFiles(files);
        const formatter = await eslint.loadFormatter("stylish");
        const resultText = formatter.format(results);
        console.log(resultText);
    } catch (error) {
        process.exitCode = 1;
        console.error(error);
    }
}
