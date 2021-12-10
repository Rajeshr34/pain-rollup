import { globalConfig } from '../build'
import { existsSync, symlinkSync } from 'fs'
import { mkdirSync } from 'fs-extra'
import { dirname } from 'path'

export const rollupPluginLinkPackages = (hook?: string) => {
    return {
        name: 'link-packages',
        [hook ?? 'buildEnd']: async () => {
            const targetDir = globalConfig.targetDistFolderPath
            if (globalConfig.packageInfo.dependencies) {
                const keys = Object.keys(globalConfig.packageInfo.dependencies)
                keys.forEach((i) => {
                    const dest = `${targetDir}/node_modules/${i}`
                    const packageFolder = `${globalConfig.targetPath}/node_modules/${i}`
                    const isDirExist = existsSync(packageFolder)
                    if (isDirExist) {
                        mkdirSync(dirname(dest), { recursive: true })
                        symlinkSync(packageFolder, dest)
                    }
                })
            }
        },
    }
}
