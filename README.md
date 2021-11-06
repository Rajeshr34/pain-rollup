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
    --p-ext              Eslint Default Extensions  (default tsx,ts,js,css,md)
    -e, --eslint         Run Eslint Check and Fix
    --e-ext              Eslint Default Extensions  (default tsx,ts,js,css,md)
    --eslint-only        Run Eslint Only  (default false)
    --prettier-only      Run Prettier Only  (default false)
    --check-only         Instead of fixing eslint or prettier this only check and throws errors if found  (default false)
    -v, --version        Displays current version
    -h, --help           Displays this message

```

### API Setup

```javascript

```
