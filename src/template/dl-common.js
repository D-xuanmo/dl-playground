import { getCurrentInstance } from 'vue'
import DLCommon from '@xuanmo/dl-common'

let installed = false
await loadStyle()

export function setupDLCommonPlus() {
  if (installed) return
  const instance = getCurrentInstance()
  instance.appContext.app.use(DLCommon)
  installed = true
}

export function loadStyle() {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '#STYLE#'
    link.addEventListener('load', resolve)
    link.addEventListener('error', reject)
    document.body.append(link)
  })
}
