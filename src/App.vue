<script setup lang="ts">
import { Repl, type SFCOptions } from '@vue/repl'
import Monaco from '@vue/repl/monaco-editor'
import { type UserOptions } from '@/composables/store'

const loading = ref(true)

// enable experimental features
const sfcOptions: SFCOptions = {
  script: {
    reactivityTransform: true,
    defineModel: true
  }
}

const initialUserOptions: UserOptions = {}

const store = useStore({
  serializedState: location.hash.slice(1),
  userOptions: initialUserOptions
})

store.init().then(() => (loading.value = false))
if (!store.pr && store.userOptions.styleSource) {
  store.pr = store.userOptions.styleSource.split('-', 2)[1]
}
// eslint-disable-next-line no-console
console.log('Store:', store)

const handleKeydown = (evt: KeyboardEvent) => {
  if ((evt.ctrlKey || evt.metaKey) && evt.code === 'KeyS') {
    evt.preventDefault()
    return
  }
}

const dark = useDark()

// persist state
watchEffect(() => history.replaceState({}, '', `#${store.serialize()}`))
</script>

<template>
  <d-loading :loading="loading" size="50px" description="编辑器初始化中..." h-100vh>
    <div v-if="!loading" antialiased>
      <Header :store="store" />
      <Repl
        :theme="dark ? 'dark' : 'light'"
        :store="store"
        :editor="Monaco"
        show-compile-output
        auto-resize
        :sfc-options="sfcOptions"
        :clear-console="false"
        @keydown="handleKeydown"
      />
    </div>
  </d-loading>
</template>

<style>
body {
  --at-apply: m-none text-13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
  Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  --base: #444;
  --nav-height: 50px;
}

.vue-repl {
  height: calc(100vh - var(--nav-height)) !important;
}

.dark .vue-repl,
.vue-repl {
  --color-branding: var(--d-primary) !important;
}

.dark body {
  background-color: #1a1a1a;
  color: #fff;
}
</style>
