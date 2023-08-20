import { createApp } from 'vue'
import App from '@/App.vue'
import TDesign from '@/t-design'
import DLUI from '@xuanmo/dl-ui'

import '@unocss/reset/tailwind.css'
import '@vue/repl/style.css'
import 'uno.css'
import 'tdesign-vue-next/es/style/index.css'
import '@xuanmo/dl-ui/dist/index.css'
import '@xuanmo/dl-icons/dist/index.css'
import './style.css'

// @ts-expect-error Custom window property
window.VUE_DEVTOOLS_CONFIG = {
  defaultSelectedAppId: 'repl'
}

createApp(App).use(TDesign).use(DLUI).mount('#app')
