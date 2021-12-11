import { copyFileFoldersInterface, globalConfig } from '../../interfaces'
import { copyFile } from '../common'
import { join, resolve } from 'path'

export const rollupPluginCopyFilesFolder = (items: copyFileFoldersInterface[] | undefined, hook?: string) => {
    return {
        name: 'copy-files-folder',
        buildStart() {
            if (items) {
                for (const i of items) {
                    let source = i.source
                    if (source.startsWith('.')) {
                        source = join(globalConfig.targetPath, source)
                    } else {
                        source = resolve(source)
                    }
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    this.addWatchFile(source)
                }
            }
        },
        [hook ?? 'buildEnd']: async () => {
            if (items) {
                items.forEach((i) => {
                    copyFile(i.source, i.target, i.modify)
                })
            }
        },
    }
}
