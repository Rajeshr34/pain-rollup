import { getCliOptions } from "aria-build";

export const getOptions = () => {
    const op = getCliOptions();
    op.package = "pain-rollup";
    op.options.push(
        ...[
            { alias: "-p, --prettier", description: "Run Prettier Check and Fix" },
            { alias: "--p-ext", description: "Eslint Default Extensions", defaultValue: "tsx,ts,js,css,md" },
            { alias: "-e, --eslint", description: "Run Eslint Check and Fix" },
            { alias: "--e-ext", description: "Eslint Default Extensions", defaultValue: "tsx,ts,js,css,md" },
            { alias: "--eslint-only", description: "Run Eslint Only", defaultValue: false },
            { alias: "--prettier-only", description: "Run Prettier Only", defaultValue: false },
            {
                alias: "--check-only",
                description: "Instead of fixing eslint or prettier this only check and throws errors if found",
                defaultValue: false,
            },
        ]
    );
    return op;
};
