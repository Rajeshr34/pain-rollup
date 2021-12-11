import { BuildOptionsInterface, globalConfig } from '../interfaces'
import { watch } from 'rollup'
import {
    cleanDist,
    clearConsole,
    currentEarth,
    earth,
    loadPackageInfo,
    logError,
    logTsError,
    progressEstimator,
    rotateEarth,
    setPaths,
} from './common'
import { getInputOptions } from './input.options'

export const painWatch = async (options: BuildOptionsInterface) => {
    await setPaths(options)
    await loadPackageInfo()
    const { rollConfig, userConfig } = await getInputOptions(options)
    await cleanDist(globalConfig.targetDistFolderPath)
    //await build(options)
    const watcher = watch({ ...rollConfig, watch: { ...(userConfig.watch ? userConfig.watch : {}) } })
    watcher.on('event', (event) => {
        switch (event.code) {
            case 'START':
                break
            case 'BUNDLE_START':
                clearConsole()
                console.log(`${rotateEarth()} PainRollup building...`, '\n')
                break
            case 'BUNDLE_END':
                clearConsole()
                console.log(`${earth[currentEarth]} PainRollup build successful!`, '\n')
                console.log('Watching for changes...', '\n')
                break
            case 'END':
                break
            case 'ERROR':
                clearConsole()
                if (event.error.plugin === 'rpt2') {
                    logTsError({ message: event.error.message })
                } else {
                    logError({ fullError: event.error })
                }
                console.log('Watching for changes...', '\n')
                break
        }
    })
    await progressEstimator(Promise.resolve(), 'BUILD SUCCESS')
    if (userConfig?.callbacks?.onComplete) {
        await userConfig.callbacks.onComplete()
    }
}
