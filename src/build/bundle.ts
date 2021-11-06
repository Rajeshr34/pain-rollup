import {
    BuildFormatOptions,
    bundle as AriaBundle,
    clean as AriaClean,
    CreateRollupConfigBuilderOptions,
    TSRollupConfig as AriaTSRollupConfig,
} from "aria-build";

export type BundleOptions = CreateRollupConfigBuilderOptions | BuildFormatOptions;
export type TSRollupConfig = AriaTSRollupConfig;
export const clean = AriaClean;

export async function bundle(options: BundleOptions) {
    return AriaBundle(options);
}
