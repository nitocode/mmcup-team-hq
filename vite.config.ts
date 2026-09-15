import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// Served from the custom domain https://mmcup-hq.nitocode.com (see public/CNAME).
export default defineConfig({
  base: '/',
  plugins: [vue(), tailwindcss()],
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
})
