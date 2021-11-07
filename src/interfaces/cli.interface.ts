import { BuildOptions } from "aria-build";

export interface BuildOptionBundle extends BuildOptions {
    eslintOnly?: boolean;
    prettierOnly?: boolean;
    checkOnly?: boolean;
    "e-ext"?: string;
    "p-ext"?: string;
    p?: boolean;
    e?: boolean;
}
