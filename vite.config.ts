import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Inspect from 'vite-plugin-inspect'
import Mkcert from 'vite-plugin-mkcert'
import { getPackageInfo } from 'local-pkg'
import pkg from './package.json'

const pathSrc = path.resolve(__dirname, 'src')

export default defineConfig(async () => {
  const repl = await getPackageInfo('@vue/repl')
  return {
    resolve: {
      alias: {
        '@': pathSrc
      }
    },
    define: {
      'import.meta.env.APP_VERSION': JSON.stringify(pkg.version),
      'import.meta.env.REPL_VERSION': JSON.stringify(repl!.version)
    },
    build: {
      rollupOptions: {
        external: ['typescript']
      }
    },
    server: {
      https: true,
      host: true
    },
    plugins: [
      vue({
        script: {
          defineModel: true,
          propsDestructure: true,
          fs: {
            fileExists: fs.existsSync,
            readFile: (file) => fs.readFileSync(file, 'utf-8')
          }
        }
      }),
      AutoImport({
        dirs: [path.resolve(pathSrc, 'composables')],
        imports: ['vue', '@vueuse/core'],
        dts: path.resolve(pathSrc, 'auto-imports.d.ts')
      }),
      Components({
        dirs: [path.resolve(pathSrc, 'components')],
        dts: path.resolve(pathSrc, 'components.d.ts')
      }),
      Unocss(),
      Mkcert(),
      Inspect()
    ],
    optimizeDeps: {
      exclude: ['@vue/repl']
    }
  }
})
