#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const ts = require('typescript')

const TS_CONFIG_PATH = path.resolve('tsconfig.json')

const tsconfigDefaults = {
    target: 'es2019',
    module: 'commonjs',
    lib: ['dom', 'es2015', 'es2017', 'es2018', 'es2019'],
    moduleResolution: 'node',
    resolveJsonModule: true,
    importHelpers: true,
    allowJs: true,
}

function getCompilerOptionsJSONFollowExtends(filename) {
    let compopts = {}
    const config = ts.readConfigFile(filename, ts.sys.readFile).config
    if (config.extends) {
        const rqrpath = path.resolve(config.extends)
        compopts = getCompilerOptionsJSONFollowExtends(rqrpath)
    }
    return {
        ...compopts,
        ...config.compilerOptions,
    }
}

const compilerOptions = fs.existsSync(TS_CONFIG_PATH) ? getCompilerOptionsJSONFollowExtends(TS_CONFIG_PATH) : {}

delete compilerOptions.exclude
delete compilerOptions.include
delete compilerOptions.lib
const registerOptions = {
    transpileOnly: true,
    compilerOptions: {
        ...compilerOptions,
        ...tsconfigDefaults,
        lib: [...tsconfigDefaults.lib, ...(compilerOptions && compilerOptions.lib ? compilerOptions.lib : [])],
    },
}
require('ts-node').register(registerOptions)
/* eslint @typescript-eslint/no-var-requires: "off" */
require('./../{FILE}').run(process.env.npm_package_version)
