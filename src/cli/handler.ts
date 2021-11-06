import { BuildOptionBundle } from "../interfaces/cli.interface";
import { handler as ariaHandler } from "aria-build";
import { eslint } from "../build/eslint";
import { prettier } from "../build/prettier";

export async function handler(options: BuildOptionBundle) {
    options.eslintOnly = options["eslint-only"] || options.eslintOnly;
    options.prettierOnly = options["prettier-only"] || options.prettierOnly;
    options.checkOnly = options["check-only"] || options.checkOnly;

    options.e = options.e || options.eslintOnly;
    options.p = options.p || options.prettierOnly;

    if (options.e) {
        await eslint(options);
    }

    if (options.p) {
        await prettier(options);
    }

    if (options.eslintOnly || options.prettierOnly) {
        return Promise.resolve();
    }
    await ariaHandler(options);
}
