import { BuildOptions } from "aria-build";

export interface BuildOptionBundle extends BuildOptions {
    eslintOnly?: any;
    prettierOnly?: any;
    checkOnly?: any;
    "e-ext"?: string;
    "p-ext"?: string;
    p?: boolean;
    e?: boolean;
}
