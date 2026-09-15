<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatCoordinates, type Team } from '../data/teams'

const props = defineProps<{
  teams: Team[]
  revealed: Set<string>
  selectedId: string | null
}>()

const emit = defineEmits<{
  select: [team: Team]
  close: []
}>()

const { t } = useI18n()

const revealedCount = computed(() => props.teams.filter((team) => props.revealed.has(team.id)).length)
const allRevealed = computed(() => revealedCount.value === props.teams.length)
const progress = computed(() => (props.teams.length ? revealedCount.value / props.teams.length : 0))
</script>

<template>
  <aside
    class="glass flex max-h-[min(60vh,34rem)] flex-col rounded-3xl"
    :aria-label="t('panel.title')"
  >
    <header class="px-5 pb-3 pt-5">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h2 class="text-base font-bold tracking-tight text-white">🛰️ {{ t('panel.title') }}</h2>
          <p class="mt-0.5 text-xs text-slate-400">{{ t('panel.subtitle') }}</p>
        </div>
        <button
          type="button"
          class="-mr-2 -mt-1 rounded-full px-2 py-1 text-xs text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          @click="emit('close')"
        >
          {{ t('panel.hide') }}
        </button>
      </div>

      <div class="mt-3">
        <div class="flex items-center justify-between text-[11px] font-medium text-slate-400">
          <span>{{ t('panel.progress', { revealed: revealedCount, total: teams.length }) }}</span>
          <span>{{ Math.round(progress * 100) }}%</span>
        </div>
        <div class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            class="h-full rounded-full bg-gradient-to-r from-amber-300 to-sky-300 transition-all duration-500"
            :style="{ width: `${progress * 100}%` }"
          ></div>
        </div>
      </div>
    </header>

    <ul class="flex-1 space-y-1 overflow-y-auto px-3 pb-3">
      <li v-for="team in teams" :key="team.id">
        <button
          type="button"
          class="group flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70"
          :class="
            selectedId === team.id
              ? 'bg-white/10 ring-1 ring-white/20'
              : 'hover:bg-white/5'
          "
          @click="emit('select', team)"
        >
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg transition group-hover:scale-105"
            :class="
              revealed.has(team.id)
                ? 'bg-sky-400/15 ring-1 ring-sky-300/40'
                : 'bg-amber-300/15 font-bold text-amber-200 ring-1 ring-amber-300/40'
            "
          >
            {{ revealed.has(team.id) ? team.emoji : '?' }}
          </span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-sm font-semibold text-white">
              {{ revealed.has(team.id) ? team.name : t('panel.unknown') }}
            </span>
            <span
              class="block truncate text-xs"
              :class="revealed.has(team.id) ? 'text-sky-200/80' : 'font-mono text-slate-400'"
            >
              {{ revealed.has(team.id) ? t(`teams.${team.id}.location`) : formatCoordinates(team.location) }}
            </span>
          </span>
          <span
            class="text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-slate-300"
            aria-hidden="true"
          >
            →
          </span>
        </button>
      </li>
    </ul>

    <p
      v-if="allRevealed"
      class="border-t border-white/10 px-5 py-3 text-center text-xs font-medium text-amber-200"
    >
      {{ t('panel.allRevealed') }}
    </p>
  </aside>
</template>
