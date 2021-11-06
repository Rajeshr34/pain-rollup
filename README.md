# @pain-org/rollup

## Installation

```
npm install --save-dev @pain-org/rollup typescript tslib@1.13.0
npm install --save-dev @pain-org/eslint-config eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-scope
```

### .eslintrc.js

```
module.exports = {
    extends: "@pain-org/eslint-config"
};

```

### Usage

```
pain-rollup -d -f es --compress
```

####Fix Eslint through lint-staged eg:

```
"lint-staged": {
  "*.{tsx,ts,js,css}": [
    "pain-rollup --eslint-only --e-ext=ts,tsx,js,css"
  ]
}
```

####Fix Eslint through path eg:

```
pain-rollup --eslint-only --e-ext=ts,tsx,js,css ./src
```

### CLI Options

```
  Usage
    $ pain-rollup [options]

  Options
    -i, --entry          Entry modules
    -d, --declaration    Generates corresponding .d.ts file  (default false)
    -f, --format         Build specified formats  (default es,cjs)
    -o, --output         Directory to place build files into  (default dist)
    -c, --config         config file of aria-build. i.e aria.config.ts
    -w, --watch          Rebuilds on any change  (default false)  (default false)
    --dts-only           Generate Declation types only  (default false)
    --external           Specify external dependencies  (default )
    --name               Specify name exposed in UMD builds
    --globals            Specify global dependencies
    --compress           Compress or minify the output
    --sourcemap          Generate sourcemap  (default false)
    --resolve            Resolve dependencies
    --target             Target framework or library to build (i.e react or vue)
    --clean              Clean the dist folder default (dist)  (default dist)
    --write              Write the output to disk default to true  (default true)
    --bundler            Bundler to enabled default (esbuild), esbuild | swc | ts  (default esbuild)
    --esbuild            Enabled esbuild plugin to use transform ts,js,jsx,tsx
    --swc                Enabled swc plugin to transform ts,js,jsx,tsx
    -p, --prettier       Run Prettier Check and Fix
    --p-ext              Eslint Default Extensions  (default tsx,ts,js,css)
    -e, --eslint         Run Eslint Check and Fix
    --e-ext              Eslint Default Extensions  (default tsx,ts,js,css)
    --eslint-only        Run Eslint Only  (default false)
    --prettier-only      Run Prettier Only  (default false)
    --check-only         Instead of fixing eslint or prettier this only check and throws errors if found  (default false)
    -v, --version        Displays current version
    -h, --help           Displays this message

```

### API Setup

```javascript
import { bundle, BundleOptions, clean, eslint, TSRollupConfig } from "@pain-org/rollup";

(async function () {
    const pkg = require("./package.json");

    const external = [...Object.keys(pkg.dependencies)];

    const config: TSRollupConfig = {
        input: "./src/index.ts",
        external,
        output: [
            {
                file: "./dist/<package>-build.es.js",
                format: "es",
            },
            {
                file: "./dist/<package>-build.js",
                format: "cjs",
            },
        ],
        tsconfig: {
            compilerOptions: {
                declaration: true,
            },
        },
    };
    const overRideOptions: BundleOptions = { config, esbuild: true, write: true };
    // const opts = await createOptions(overRideOptions);
    await eslint({
        eslintOnly: false,
        "e-ext": "ts,tsx,js,json",
    });
    await clean("dist");
    await bundle(overRideOptions);
})();
```
