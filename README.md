# @pain-org/rollup

```
 yarn add @pain-org/rollup
```

## `pain-rollup build --help`

##### `eg: pain-rollup build -f cjs -v true -s true`

##### `eg: pain-rollup build -f "cjs,es,umd" -v true`

```
Usage: build [options]

Options:
  -t --target <value>                       Specify Target File (default: "./src/index.ts")
  -f --format <amd,cjs,es,iife,umd,system>  Build specified formats (default: ["es","cjs"])
  -rc --pain-config <item>                  config file of pain-rollup. i.e pain.config.ts
  -d --declaration <true|false>             Generates corresponding .d.ts file (default: true)
  -o --output <item>                        Generate source map (default: "dist")
  -c --compress <true|false>                Compress or minify the output (default: true)
  -s --sourcemap <true|false>               Generate source map (default: false)
  -v --visualizer <true|false>              Visualize and analyze your Rollup bundle to see which modules are taking up space. (default: false)
  -r --resolve <true|false>                 Resolve dependencies (default: false)
  -p --preserve-modules <true|false>        Keep directory structure and files (default: false)
  -h, --help                                display help for command
```

## `pain-rollup watch --help`

Watch rebuilds your bundle when it detects that the individual modules have changed on disk.

##### `eg: pain-rollup watch -f cjs -v true -s true`

##### `eg: pain-rollup watch -f "cjs,es,umd" -v true`

```
Usage: build [options]

Options:
  -t --target <value>                       Specify Target File (default: "./src/index.ts")
  -f --format <amd,cjs,es,iife,umd,system>  Build specified formats (default: ["es","cjs"])
  -rc --pain-config <item>                  config file of pain-rollup. i.e pain.config.ts
  -d --declaration <true|false>             Generates corresponding .d.ts file (default: true)
  -o --output <item>                        Generate source map (default: "dist")
  -c --compress <true|false>                Compress or minify the output (default: true)
  -s --sourcemap <true|false>               Generate source map (default: false)
  -v --visualizer <true|false>              Visualize and analyze your Rollup bundle to see which modules are taking up space. (default: false)
  -r --resolve <true|false>                 Resolve dependencies (default: false)
  -p --preserve-modules <true|false>        Keep directory structure and files (default: false)
  -h, --help                                display help for command
```

#### bundling can control with `pain.config.ts` file on root folder

```
import { Plugin } from 'rollup'
import { PainCustomConfigInterface, PackageInfoInterface } from '@pain-org/rollup'

export const painConfig = async (pkgInfo: PackageInfoInterface, tagetPath: string): Promise<PainCustomConfigInterface> => {
    return <PainCustomConfigInterface>{
        replace: {
            //search and replace,
        },
        plugins: (list: (Plugin | null | false | undefined)[]) => {
            // modifiy plugins add/remove and return the list
            return list
        },
        callbacks: {
            // onComplete: async() => {},
            // onStart: async() => {},
        },
        // copy: [{ source: 'README.md' }, { source: 'tsconfig.json', target: './config/tsconfig.json' }],
        // watch: {}, //additional watch configuration (https://rollupjs.org/guide/en/#watchoptions)
    }
}
```

### Default Search and replace

```
{
    __buildDate__: "Replaces With Current Date"
    __buildVersion__: "Replaces with package.json version"
    __git_hash__: "Replaces with your last commit id from the current branch"
    __git_branch__: "Replaces with your current branch"
}
```
