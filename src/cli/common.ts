import { emptyDir, mkdirSync, copySync } from 'fs-extra'
import createProgressEstimator from 'progress-estimator'
import { OutputOptions, rollup, RollupOptions } from 'rollup'
import { existsSync, lstatSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join, relative, resolve } from 'path'
import { BuildOptionsInterface, globalConfig } from '../interfaces'
import { makeHtmlAttributes, RollupHtmlTemplateOptions } from '@rollup/plugin-html'

export const progressEstimator = createProgressEstimator()

export const cleanDist = async (dir = './dist') => {
    return progressEstimator(emptyDir(dir), 'Cleaning dist folder')
}

export const writeWarnings = () => {
    if (globalConfig.warnings && globalConfig.warnings.length > 0) {
        console.warn('######################################################################################')
        globalConfig.warnings.forEach((i) => {
            console.warn(`####     ` + i)
        })
        console.warn('######################################################################################')
    }
}

export const rollUpConfig = async (rollUpConfigData: RollupOptions) => {
    const bundle = await progressEstimator(rollup(rollUpConfigData), 'RollUp Initializing')
    return Promise.all(
        (rollUpConfigData.output as OutputOptions[]).map((i) => {
            return progressEstimator(bundle.write(i), 'Writing: ' + i.format + ' Files/Build')
        })
    )
}

export const appError = (data: object) => {
    throw new Error(JSON.stringify(data))
}

export const copyFile = (source: string, target?: string, modify?: (data: string) => string) => {
    if (source.startsWith('.')) {
        source = join(globalConfig.targetPath, source)
    }

    if (!target) {
        target = join(globalConfig.targetDistFolderPath, relative(globalConfig.targetPath, source))
    } else if (target.startsWith('.')) {
        target = join(globalConfig.targetDistFolderPath, target)
    }
    mkdirSync(dirname(target), { recursive: true })
    if (isDir(resolve(source))) {
        copySync(resolve(source), target)
    } else {
        let data = readFileSync(source, { encoding: 'utf-8' })
        if (modify) data = modify(data)
        writeFile(target, data)
    }
}

export const writeFile = (targetPath: string, content: string) => {
    writeFileSync(targetPath, content, { encoding: 'utf-8' })
}

export const objectPrefixSuffix = <T>(content: T, prefix?: string, suffix?: string) => {
    if (!prefix && !suffix) return content
    const keys = Object.keys(content)
    const returnItems = {}
    keys.forEach((i) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        returnItems[(prefix ?? '') + i + (suffix ?? '')] = content[i]
    })
    return returnItems
}

export const commonReplace = () => {
    let hash
    let branch
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        hash = require('child_process')
            ?.execSync('git rev-parse HEAD', { cwd: globalConfig.targetPath })
            ?.toString()
            ?.trim()
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        branch = require('child_process')
            ?.execSync('git rev-parse --abbrev-ref HEAD', { cwd: globalConfig.targetPath })
            ?.toString()
            ?.trim()
    } catch (e) {
        console.log(e)
    }
    return objectPrefixSuffix(
        {
            buildDate: new Date().toString(),
            buildVersion: globalConfig.packageInfo.version,
            git_hash: hash,
            git_branch: branch,
        },
        '__',
        '__'
    )
}

export const nearestPackageFile = (folder: string, limit = 10): string => {
    if (limit === 0) return folder
    if (existsSync(join(folder, 'package.json'))) {
        return folder
    } else {
        return nearestPackageFile(dirname(folder), limit - 1)
    }
}

export const setPaths = async (options: BuildOptionsInterface) => {
    globalConfig.targetPath = resolve()
    globalConfig.cliPath = nearestPackageFile(dirname(__filename))
    globalConfig.targetDistFolderPath = join(globalConfig.targetPath, options.output)
}

export const loadPackageInfo = async () => {
    globalConfig.packageInfo = JSON.parse(readFileSync(join(globalConfig.targetPath, 'package.json'), 'utf-8'))
    globalConfig.packageInfo.nameWithoutScope = globalConfig.packageInfo.name?.split('/').pop()
}

export const clearConsole: () => void = () => {
    process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H')
}

export const earth = ['🌎', '🌏', '🌍']
export let currentEarth = 2

export const rotateEarth = () => {
    if (currentEarth === 2) currentEarth = 0
    else {
        currentEarth = currentEarth + 1
    }
    return earth[currentEarth]
}

export const logTsError: (error: { failedAt?: string; message: unknown }) => void = ({ failedAt, message }) => {
    logError({
        failedAt,
        message: `TypeScript Error: ${message}`,
    })
}

export const logError: (error: { failedAt?: string; message?: unknown; fullError?: unknown }) => void = ({
    failedAt,
    message,
    fullError,
}) => {
    if (failedAt) console.error(`✗ FAILED AT: ${failedAt}`, '\n')
    if (message) console.error(message, '\n')
    if (fullError) console.error(fullError, '\n')
}

export const isDir = (dirPath: string) => {
    try {
        const stat = lstatSync(dirPath)
        return stat.isDirectory()
    } catch (e) {
        // lstatSync throws an error if path doesn't exist
        return false
    }
}

export const rollupHtmlGen = (filePath: string, templateoptions?: RollupHtmlTemplateOptions) => {
    let htmlData = readFileSync(filePath, 'utf-8')
    const scripts = (templateoptions?.files.js || [])
        .map(({ fileName }) => {
            const attrs = makeHtmlAttributes(templateoptions?.attributes.script)
            return `<script src="${templateoptions?.publicPath}${fileName}"${attrs}></script>`
        })
        .join('\n')
    const links = (templateoptions?.files.css || [])
        .map(({ fileName }) => {
            const attrs = makeHtmlAttributes(templateoptions?.attributes.link)
            return `<link href="${templateoptions?.publicPath}${fileName}" rel="stylesheet"${attrs}>`
        })
        .join('\n')
    const items: any = { scripts, links, title: templateoptions?.title }
    Object.keys(items).map((i) => {
        htmlData = htmlData.replace('${' + i + '}', items[i])
        return i
    })
    return htmlData
}
