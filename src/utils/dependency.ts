import { watchEffect } from 'vue'
import { type MaybeRef } from '@vueuse/core'
import { type Versions } from '@/composables/store'
import { type ImportMap } from '@/utils/import-map'

export interface Dependency {
  pkg?: string
  version?: string
  path: string
}

export type Cdn = 'unpkg' | 'jsdelivr' | 'jsdelivr-fastly'
export const cdn = useLocalStorage<Cdn>('setting-cdn', 'jsdelivr-fastly')

export const genCdnLink = (
  pkg: string,
  version: string | undefined,
  path: string
) => {
  version = version ? `@${version}` : ''
  switch (cdn.value) {
    case 'jsdelivr':
      return `https://cdn.jsdelivr.net/npm/${pkg}${version}${path}`
    case 'jsdelivr-fastly':
      return `https://fastly.jsdelivr.net/npm/${pkg}${version}${path}`
    case 'unpkg':
      return `https://unpkg.com/${pkg}${version}${path}`
  }
}

export const genVueLink = (version: string) => {
  const compilerSfc = genCdnLink(
    '@vue/compiler-sfc',
    version,
    '/dist/compiler-sfc.esm-browser.js'
  )
  const runtimeDom = genCdnLink(
    '@vue/runtime-dom',
    version,
    '/dist/runtime-dom.esm-browser.js'
  )
  return {
    compilerSfc,
    runtimeDom
  }
}

export const genImportMap = (
  { vue, dlui, dlCommon }: Partial<Versions> = {}
): ImportMap => {
  const deps: Record<string, Dependency> = {
    vue: {
      pkg: '@vue/runtime-dom',
      version: vue,
      path: '/dist/runtime-dom.esm-browser.js'
    },
    '@vue/shared': {
      version: vue,
      path: '/dist/shared.esm-bundler.js'
    },
    '@xuanmo/dl-ui': {
      pkg: '@xuanmo/dl-ui',
      version: dlui,
      path: '/dist/index.es.js'
    },
    '@xuanmo/dl-common': {
      pkg: '@xuanmo/dl-common',
      version: dlCommon,
      path: '/dist/index.es.js'
    }
  }

  return {
    imports: Object.fromEntries(
      Object.entries(deps).map(([key, dep]) => [
        key,
        genCdnLink(dep.pkg ?? key, dep.version, dep.path)
      ])
    )
  }
}

export const useVersions = (pkg: MaybeRef<string>, cb: (versions: string[]) => void) => {
  const url = computed(() => `https://data.jsdelivr.com/v1/package/npm/${unref(pkg)}`)
  watchEffect(async () => {
    const response = await fetch(url.value)
    const data = (await response.json()).versions
    cb(data)
  })
}
