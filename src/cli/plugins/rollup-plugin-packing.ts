import { join } from 'path'
import { copyFile, writeFile } from '../common'
import { globalConfig } from '../../interfaces'

export const rollupPluginPacking = (hook?: string) => {
    return {
        name: 'packing-packages',
        [hook ?? 'buildEnd']: async () => {
            const targetDir = globalConfig.targetDistFolderPath
            const pkData = { ...globalConfig.packageInfo }
            delete pkData.devDependencies
            delete pkData.scripts
            delete pkData.nameWithoutScope
            delete pkData.config
            delete pkData['lint-staged']
            writeFile(join(targetDir, 'package.json'), JSON.stringify(pkData, null, 2))
            writeFile(join(targetDir, '.npmignore'), `pain-package-stats.html`)

            if (globalConfig?.packageInfo?.config?.['pain-cli'] && globalConfig.packageInfo.bin) {
                Object.entries(globalConfig.packageInfo.bin).forEach(([, value]) => {
                    const binFile = join(globalConfig.targetPath, value)
                    // const targetBinFile = join(globalConfig.targetDistFolderPath, value)
                    copyFile(binFile, undefined, (data) => {
                        data = data.replace('{FILE}', globalConfig?.packageInfo?.nameWithoutScope || '')
                        return data
                    })
                })
            }
        },
    }
}
