import {ref} from 'vue'
import {defineStore} from 'pinia'

export const langStore = defineStore('app', () => {
  const theme = ref(localStorage.getItem("lang") || 'zh_CN')
  const en = () => {
    localStorage.setItem('lang', 'en')
    theme.value = 'en'
  }
  const cn = () => {
    localStorage.setItem('lang', 'zh_CN')
    theme.value = 'zh_CN'
  }



  return {theme, en, cn}
})
