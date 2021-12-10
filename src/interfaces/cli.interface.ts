import { Plugin } from 'rollup'

export interface BuildOptionsInterface {
    target: string
    format: string[]
    declaration: boolean
    output: string
    compress: boolean
    sourcemap: boolean
    visualizer: boolean
    resolve: boolean
    preserveModules: boolean
}

export type WatchOptionsInterface = BuildOptionsInterface

export interface PackageInfoInterface {
    name?: string
    nameWithoutScope?: string
    version?: string
    description?: string
    main?: string
    keywords?: string[]
    author?: string
    license?: string
    config?: {
        'pain-cli': boolean
    }
    bin?: { [index: string]: string }
    'lint-staged'?: object
    dependencies?: { [index: string]: string }
    devDependencies?: { [index: string]: string }
    scripts?: { [index: string]: string }
}

export interface GlobalConfigInterface {
    packageInfo: PackageInfoInterface
    targetPath: string
    targetDistFolderPath: string
    cliPath: string
}

export interface PainCustomConfigInterface {
    replace?: {
        [str: string]: string | number
    }
    plugins?: (list: (Plugin | null | false | undefined)[]) => (Plugin | null | false | undefined)[]
    callbacks?: {
        onStart?: () => Promise<void>
        onComplete?: () => Promise<void>
    }
    copy?: copyFileFoldersInterface[]
}

export interface copyFileFoldersInterface {
    source: string
    isFolder?: boolean
    target?: string
    modify?: (data: string) => string
}
