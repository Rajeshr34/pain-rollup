import { BuildOptionsInterface, GlobalConfigInterface } from '../interfaces/cli.interface'
import { getInputOptions } from './input.options'
import { dirname, join, resolve } from 'path'
import { existsSync, readFileSync } from 'fs'
import { cleanDist, progressEstimator, rollUpConfig } from './common'

export const globalConfig: GlobalConfigInterface = {
    packageInfo: {},
    targetPath: '',
    cliPath: '',
    targetDistFolderPath: '',
}

export const build = async (options: BuildOptionsInterface) => {
    await setPaths(options)
    await loadPackageInfo()
    const { rollConfig, userConfig } = await getInputOptions(options)
    await cleanDist(globalConfig.targetDistFolderPath)
    await rollUpConfig(rollConfig)
    await progressEstimator(Promise.resolve(), 'BUILD SUCCESS')
    if (userConfig?.callbacks?.onComplete) {
        await userConfig.callbacks.onComplete()
    }
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
