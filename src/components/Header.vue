<script setup lang="ts">
import { MessagePlugin } from '@xuanmo/dl-common'
import { type ReplStore, type VersionKey } from '@/composables/store'
import { ShareOutlined, LightOutlined, GithubOutlined, DarkOutlined } from '@xuanmo/dl-icons'

const appVersion = import.meta.env.APP_VERSION
const replVersion = import.meta.env.REPL_VERSION

const dark = useDark()
const toggleDark = useToggle(dark)

const { store } = defineProps<{
  store: ReplStore
}>()

interface Version {
  text: string
  active: string
}

const versions = computed<Record<VersionKey, Version>>(() => ({
  dlCommon: {
    text: 'DLCommon',
    active: store.versions.dlCommon
  },
  dlui: {
    text: 'DLUI',
    active: store.versions.dlui
  },
  vue: {
    text: 'Vue',
    active: store.versions.vue
  },
  typescript: {
    text: 'TypeScript',
    active: store.versions.typescript
  }
}))

async function copyLink() {
  await navigator.clipboard.writeText(location.href)
  MessagePlugin.success('Sharable URL has been copied to clipboard.')
}
</script>

<template>
  <nav>
    <div leading="[var(--nav-height)]" m-0 flex items-center font-medium>
      <img
        h-24px
        relative
        mr-2
        v="mid"
        top="-2px"
        alt="logo"
        src="https://upyun.xuanmo.xin/logo/dl-ui.svg"
      />
      <div lt-sm-hidden flex="~ gap-1" items-center>
        <div text-xl>DL Playground</div>
        <t-tag theme="primary" size="small" variant="light">v{{ appVersion }}, repl v{{ replVersion }}</t-tag>
      </div>
    </div>

    <div flex="~ gap-4" items-center>
      <div
        v-for="(v, key) of versions"
        :key="key"
        flex="~ gap-2"
        items-center
        lt-lg-hidden
      >
        <span>{{ v.text }}: </span>
        <t-tag theme="primary" size="small" variant="light">{{ v.active }}</t-tag>
      </div>

      <d-space :gap="16" class="icons">
        <share-outlined size="small" @click="copyLink" />
        <dark-outlined v-if="dark" size="small" @click="toggleDark()" />
        <light-outlined v-else size="small" @click="toggleDark()" />
        <a
          href="https://github.com/D-xuanmo/dl-playground"
          target="_blank"
          title="View on GitHub"
        >
          <github-outlined size="small" />
        </a>

        <Settings :store="store" />
      </d-space>
    </div>
  </nav>
</template>

<style lang="scss">
nav {
  --bg: #fff;
  --bg-light: #fff;
  --border: var(--d-border-color);

  --at-apply: 'box-border flex justify-between px-4 z-999 relative';

  height: var(--nav-height);
  background-color: var(--bg);
  border-bottom: var(--d-border);
}

.dark nav {
  --bg: #1a1a1a;
  --bg-light: #242424;
  --border: #383838;

  --at-apply: 'shadow-none';
  border-bottom: 1px solid var(--border);
}

.icons > * {
  cursor: pointer;
}
</style>
