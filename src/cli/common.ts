import { emptyDir, mkdirSync } from 'fs-extra'
import createProgressEstimator from 'progress-estimator'
import { OutputOptions, rollup, RollupOptions } from 'rollup'
import { readFileSync, writeFileSync } from 'fs'
import { dirname, join, relative } from 'path'
import { globalConfig } from './build'

export const progressEstimator = createProgressEstimator()

export const cleanDist = async (dir = './dist') => {
    return progressEstimator(emptyDir(dir), 'Cleaning dist folder')
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
    let data = readFileSync(source, { encoding: 'utf-8' })
    if (modify) data = modify(data)
    writeFile(target, data)
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
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const hash = require('child_process')
        ?.execSync('git rev-parse HEAD', { cwd: globalConfig.targetPath })
        ?.toString()
        ?.trim()
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const branch = require('child_process')
        ?.execSync('git rev-parse --abbrev-ref HEAD', { cwd: globalConfig.targetPath })
        ?.toString()
        ?.trim()
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
