import {BuildOptionBundle} from "../interfaces/cli.interface";
import {extensions} from "./extensions";

export async function prettier(options: BuildOptionBundle) {
    try {
        let files = extensions(options["e-ext"]);
        if (!files || files.length === 0) {
            files = [options.entry];
        }
        if (files.length > 0) {
            /*            prettierPackage.format()
                        const results = await eslint.lintFiles(files);
                        const formatter = await eslint.loadFormatter("stylish");
                        const resultText = formatter.format(results);
                        console.log(resultText);*/
        } else {
            if (options.checkOnly) {
                throw Error("Required Files/Folder to run esLint please provide it by 'entry' key from object or path through argument")
            }
        }
    } catch (error) {
        process.exitCode = 1;
        console.error(error);
    }
}
