import { Command, Option } from 'commander'
import { build } from './build'
import { outputFormats } from './input.options'
import { BuildOptionsInterface, WatchOptionsInterface } from '../interfaces/cli.interface'
import { painWatch } from './watch'

function splitSeparateList(value: string, defaultValue?: string | undefined): string | undefined {
    if (value) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return value.split(',')
    }
    return defaultValue
}

function booleanValue<T>(value: string, previous: T) {
    if (value === undefined) return previous
    switch (value.toLowerCase().trim()) {
        case 'true':
        case 'yes':
        case '1':
            return true

        case 'false':
        case 'no':
        case '0':
        case null:
            return false
        default:
            return Boolean(value)
    }
}

export function commonCommand(item: Command) {
    item.addOption(
        new Option('-t --target <value>', 'Specify Target File').default('./src/index.ts').makeOptionMandatory(true)
    )
    item.addOption(
        new Option(`-f --format <${outputFormats.join(',')}>`, 'Build specified formats')
            .default(['es', 'cjs'])
            .makeOptionMandatory(true)
            .argParser(splitSeparateList)
    )
    item.addOption(new Option('-rc --pain-config <item>', 'config file of pain-rollup. i.e pain.config.ts'))
    item.addOption(
        new Option('-d --declaration <true|false>', 'Generates corresponding .d.ts file')
            .default(true)
            .argParser(booleanValue)
    )
    item.addOption(new Option('-o --output <item>', 'Generate source map').default('dist'))
    item.addOption(
        new Option('-c --compress <true|false>', 'Compress or minify the output').default(true).argParser(booleanValue)
    )
    item.addOption(
        new Option('-s --sourcemap <true|false>', 'Generate source map').default(false).argParser(booleanValue)
    )
    item.addOption(
        new Option(
            '-v --visualizer <true|false>',
            'Visualize and analyze your Rollup bundle to see which modules are taking up space.'
        )
            .default(false)
            .argParser(booleanValue)
    )
    item.addOption(
        new Option('-r --resolve <true|false>', 'Resolve dependencies').default(false).argParser(booleanValue)
    )
    item.addOption(
        new Option('-p --preserve-modules <true|false>', 'Keep directory structure and files')
            .default(false)
            .argParser(booleanValue)
    )
}

export async function run(version: string) {
    const program = new Command()
    program.version(version)

    const buildCmd = new Command('build')
    commonCommand(buildCmd)
    buildCmd.action(async (item: BuildOptionsInterface) => {
        await build(item)
    })

    const watchCmd = new Command('watch')
    commonCommand(watchCmd)
    watchCmd.action(async (args: WatchOptionsInterface) => {
        await painWatch(args)
    })

    program.addCommand(buildCmd)
    program.addCommand(watchCmd)
    program.parse(process.argv)
}
