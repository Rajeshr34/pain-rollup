import { copyFileFoldersInterface } from '../../interfaces'
import { copyFile } from '../common'

export const rollupPluginCopyFilesFolder = (items: copyFileFoldersInterface[] | undefined, hook?: string) => {
    return {
        name: 'copy-files-folder',
        [hook ?? 'buildEnd']: async () => {
            if (items) {
                items.forEach((i) => {
                    if (!i.isFolder) copyFile(i.source, i.target, i.modify)
                })
            }
        },
    }
}
