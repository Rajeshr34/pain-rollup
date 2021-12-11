import { BuildOptionsInterface, globalConfig } from '../interfaces'
import { getInputOptions } from './input.options'
import { cleanDist, loadPackageInfo, progressEstimator, rollUpConfig, setPaths } from './common'

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
