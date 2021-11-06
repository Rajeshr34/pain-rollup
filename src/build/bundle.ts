import * as ariaBuild from "aria-build";

export type BundleOptions = ariaBuild.CreateRollupConfigBuilderOptions | ariaBuild.BuildFormatOptions;
export type TSRollupConfig = ariaBuild.TSRollupConfig;
export const clean = ariaBuild.clean;
export const createOptions = ariaBuild.createOptions;

export async function bundle(options: BundleOptions) {
    return ariaBuild.bundle(options);
}
