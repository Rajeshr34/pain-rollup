import { BuildOptionsInterface, PainCustomConfigInterface } from '../interfaces/cli.interface'
import { ModuleFormat, OutputOptions, Plugin, RollupOptions } from 'rollup'
import { globalConfig } from './build'
import { terser } from 'rollup-plugin-terser'
import { join } from 'path'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import { existsSync } from 'fs'
import progress from 'rollup-plugin-progress'
import { visualizer } from 'rollup-plugin-visualizer'
import eslint from '@rollup/plugin-eslint'
import { appError, commonReplace } from './common'
import ts from 'rollup-plugin-ts'
import { rollupPluginLinkPackages } from './plugins/rollup-plugin-link-packages'
import { rollupPluginPacking } from './plugins/rollup-plugin-packing'
import { rollupPluginCopyFilesFolder } from './plugins/rollup-plugin-copy-files-folder'

export const outputFormats = 'amd,cjs,es,iife,umd,system'.split(',')

export async function getPainConfig(isCliConfig = false, config?: string): Promise<PainCustomConfigInterface> {
    const ROLLUP_CONFIG_PATH = join(
        isCliConfig ? globalConfig.cliPath : globalConfig.targetPath,
        config ?? 'pain.config.ts'
    )
    if (existsSync(ROLLUP_CONFIG_PATH)) {
        const { painConfig } = await import(ROLLUP_CONFIG_PATH)
        return painConfig ? await painConfig(globalConfig.packageInfo, globalConfig.targetPath) : null
    }
    return {}
}

export const mergeObject = <T>(source: T, target: T): T => {
    for (const [key, val] of Object.entries(source)) {
        if (val !== null && typeof val === `object`) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (target[key] === undefined) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                target[key] = new val.__proto__.constructor()
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            mergeObject(val, target[key])
        } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            target[key] = val
        }
    }
    return target // we're replacing in-situ, so this is more for chaining than anything else
}

export const getInputOptions = async (
    options: BuildOptionsInterface
): Promise<{ rollConfig: RollupOptions; userConfig: PainCustomConfigInterface }> => {
    const painConfigData = await getPainConfig()
    if (painConfigData?.callbacks?.onStart) await painConfigData.callbacks.onStart()
    const item: RollupOptions = {}
    const appName = globalConfig.packageInfo.nameWithoutScope
    item.input = join(globalConfig.targetPath, options.target)
    const outputItems: OutputOptions[] = []
    options.format.forEach((i) => {
        const castItem: ModuleFormat = <ModuleFormat>i
        if (outputFormats.includes(i)) {
            outputItems.push({
                file: !options.preserveModules
                    ? join(
                          globalConfig.targetDistFolderPath,
                          `${appName}${castItem === 'cjs' ? `` : `.${castItem}`}.js`
                      )
                    : undefined,
                format: castItem,
                dir: options.preserveModules ? join(globalConfig.targetDistFolderPath, i) : undefined,
                name: castItem === 'umd' ? appName : undefined,
                sourcemap: options.sourcemap,
                preserveModules: options.preserveModules,
            })
        }
    })
    if (outputItems.length <= 0) {
        appError({ msg: 'Required valid format settings,', givenFormat: options.format })
    }
    item.output = outputItems
    item.onwarn = () => {
        // console.log(msg)
    }
    item.plugins = [
        eslint({
            fix: true,
            throwOnWarning: false,
        }),
        ...[options.resolve ? nodeResolve() : null],
        commonjs(),
        json(),
        ts({
            tsconfig: (resolvedConfig) => ({ ...resolvedConfig, declaration: options.declaration }),
        }),
        options.compress && terser({ compress: true }),
        replace({
            preventAssignment: true,
            ...commonReplace(),
            ...(painConfigData?.replace ? painConfigData.replace : {}),
        }),
        progress({
            clearLine: true, // default: true
        }),
        ...[
            options.visualizer
                ? visualizer({
                      filename: join(globalConfig.targetDistFolderPath, 'pain-package-stats.html'),
                      gzipSize: true,
                      brotliSize: true,
                  })
                : null,
        ],
        rollupPluginLinkPackages(),
        rollupPluginPacking(),
        rollupPluginCopyFilesFolder(painConfigData?.copy),
    ].filter(Boolean) as Plugin[]

    if (painConfigData?.plugins) {
        item.plugins = painConfigData.plugins(item.plugins)
    }
    return { rollConfig: item, userConfig: painConfigData }
}
