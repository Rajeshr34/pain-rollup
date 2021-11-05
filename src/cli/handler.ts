import { BuildOptionBundle } from "../interfaces/cli.interface";
import { handler as ariaHandler } from "aria-build";

export async function handler(options: BuildOptionBundle) {
    console.log(options);
    await ariaHandler(options);
}
