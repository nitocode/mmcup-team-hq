<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LOCALES, setLocale, type Locale } from '../i18n'

const { locale, t } = useI18n()

function choose(next: Locale) {
  if (locale.value !== next) setLocale(next)
}
</script>

<template>
  <div
    class="glass flex items-center rounded-full p-1"
    role="group"
    :aria-label="t('lang.switch')"
  >
    <button
      v-for="code in SUPPORTED_LOCALES"
      :key="code"
      type="button"
      class="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70"
      :class="
        locale === code
          ? 'bg-white text-slate-900 shadow'
          : 'text-slate-300 hover:text-white'
      "
      :aria-pressed="locale === code"
      :lang="code"
      @click="choose(code)"
    >
      {{ code }}
    </button>
  </div>
</template>
