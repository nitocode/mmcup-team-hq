<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './LanguageSwitcher.vue'
import { guideDog, toggleGuideDog } from '../composables/useGuideDog'

defineEmits<{
  cantFind: []
}>()

const { t } = useI18n()
</script>

<template>
  <div class="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
    <LanguageSwitcher />

    <button
      type="button"
      class="whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:text-sm"
      :class="
        guideDog
          ? 'border-white bg-white text-slate-900'
          : 'border-white/20 bg-slate-900/70 text-slate-200 hover:bg-white/10'
      "
      :aria-pressed="guideDog"
      :title="t('a11y.guideDogHint')"
      @click="toggleGuideDog()"
    >
      {{ t('a11y.guideDog') }}
    </button>

    <button
      type="button"
      class="whitespace-nowrap rounded-full bg-rose-500/90 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-rose-900/40 ring-1 ring-rose-300/40 transition hover:bg-rose-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 sm:text-sm"
      @click="$emit('cantFind')"
    >
      {{ t('cantFind.button') }}
    </button>
  </div>
</template>
