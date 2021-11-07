#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const ts = require("typescript");

const TS_CONFIG_PATH = path.resolve("tsconfig.json");

const tsconfigDefaults = {
    target: "es2018",
    module: "commonjs",
    lib: ["dom", "es2015", "es2017"],
    allowJs: true,
};


function getCompilerOptionsJSONFollowExtends(filename) {
    let compopts = {};
    const config = ts.readConfigFile(filename, ts.sys.readFile).config;
    if (config.extends) {
        const rqrpath = path.resolve(config.extends);
        compopts = getCompilerOptionsJSONFollowExtends(rqrpath);
    }
    return {
        ...compopts,
        ...config.compilerOptions,
    };
}
const compilerOptions = fs.existsSync(TS_CONFIG_PATH) ? getCompilerOptionsJSONFollowExtends(TS_CONFIG_PATH) : {};



delete compilerOptions.exclude;
delete compilerOptions.include;
delete compilerOptions.lib;
require("ts-node").register({
    transpileOnly: true,
    compilerOptions: {
        ...compilerOptions,
        ...tsconfigDefaults,
        lib: [...tsconfigDefaults.lib, ...(compilerOptions && compilerOptions.lib ? compilerOptions.lib : [])],
    },
});

const pkg = require("../package.json");
require("../src").run(pkg.version);
