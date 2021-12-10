import { Plugin } from 'rollup'

export const painConfig = async (pkgInfo: any, tagetPath: string) => {
    return {
        replace: {},
        plugins: (list: (Plugin | null | false | undefined)[]) => {
            return list
        },
        callbacks: {
            // onComplete: () => {},
        },
        copy: [{ source: 'README.md' }, { source: 'tsconfig.json', target: './config/tsconfig.json' }],
    }
}
