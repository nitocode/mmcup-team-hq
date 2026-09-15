import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// Deployed at https://nitocode.github.io/mmcup-team-hq/
export default defineConfig({
  base: '/mmcup-team-hq/',
  plugins: [vue(), tailwindcss()],
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
})
