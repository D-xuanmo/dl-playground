<template>
  <setting-outlined size="small" @click="visible = true" />
  <d-drawer
    v-model:visible="visible"
    title="设置"
    :footer="false"
    :lazy-render="false"
  >
    <d-form
      :models="formModels"
      :store="formStore"
      layout="vertical"
      colon
      @change="setVersion"
    />
  </d-drawer>
</template>

<script setup lang="ts">
import { type FormModels, FormStore } from '@xuanmo/dl-common'
import { SettingOutlined } from '@xuanmo/dl-icons'
import { ref } from 'vue'
import { cdn, useVersions } from '@/utils/dependency'
import { gte } from 'semver'
import { type ReplStore } from '@/composables/store'

const { store } = defineProps<{
  store: ReplStore
}>()

const formStore = new FormStore()

const visible = ref(false)

const formModels: FormModels = [
  {
    id: 'dlCommon',
    dataKey: 'dlCommon',
    label: 'DLCommon',
    component: 'TSelect',
    layout: {
      parent: 'root'
    },
    options: [],
    value: store.versions.dlCommon,
    filterable: true
  },
  {
    id: 'dlui',
    dataKey: 'dlui',
    label: 'DLUI',
    component: 'TSelect',
    layout: {
      parent: 'root'
    },
    options: [],
    value: store.versions.dlui,
    filterable: true
  },
  {
    id: 'vue',
    dataKey: 'vue',
    label: 'Vue',
    component: 'TSelect',
    layout: {
      parent: 'root'
    },
    options: [],
    value: store.versions.vue,
    filterable: true
  },
  {
    id: 'ts',
    dataKey: 'ts',
    label: 'TypeScript',
    component: 'TSelect',
    layout: {
      parent: 'root'
    },
    options: [],
    value: store.versions.typescript,
    filterable: true
  },
  {
    id: 'cdn',
    dataKey: 'cdn',
    label: 'CDN',
    component: 'TSelect',
    layout: {
      parent: 'root'
    },
    options: [
      { value: 'jsdelivr', label: 'jsDelivr' },
      { value: 'jsdelivr-fastly', label: 'jsDelivr Fastly' },
      { value: 'unpkg', label: 'unpkg' }
    ],
    value: cdn
  }
]

async function setVersion(value: Record<string, string>) {
  const [[key, version]] = Object.entries(value)
  // versions[key].active = `loading...`
  await store.setVersion(key as any, version)
  // versions[key].active = v
}

useVersions('@xuanmo/dl-common', (options) => {
  formStore.updateModel('dlCommon', {
    options: options
      .filter((version) => gte(version, '0.0.2-beta.66'))
      .map((item) => ({
        value: item,
        label: item
      }))
  })
})
useVersions('@xuanmo/dl-ui', (options) => {
  formStore.updateModel('dlui', {
    options: options
      .filter((version) => gte(version, '0.0.2-beta.29'))
      .map((item) => ({
        value: item,
        label: item
      }))
  })
})
useVersions('vue', (options) => {
  formStore.updateModel('vue', {
    options: options
      .filter((version) => gte(version, '3.2.0'))
      .map((item) => ({
        value: item,
        label: item
      }))
  })
})
useVersions('typescript', (options) => {
  formStore.updateModel('ts', {
    options: options
      .filter((version) => !version.includes('dev') && !version.includes('insiders'))
      .map((item) => ({
        value: item,
        label: item
      }))
  })
})
</script>
