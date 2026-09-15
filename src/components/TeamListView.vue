<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { assetUrl, formatCoordinates, type Team } from '../data/teams'

const props = defineProps<{
  teams: Team[]
  revealed: Set<string>
}>()

const emit = defineEmits<{
  select: [team: Team]
}>()

const { t } = useI18n()

const revealedCount = computed(() => props.teams.filter((team) => props.revealed.has(team.id)).length)
</script>

<template>
  <section class="mx-auto w-full max-w-3xl px-4 pb-16" :aria-label="t('a11y.listTitle')">
    <h2 class="text-lg font-bold text-white">{{ t('a11y.listTitle') }}</h2>
    <p class="mt-1 text-sm text-slate-300">{{ t('a11y.listHint') }}</p>
    <p class="mt-1 text-sm text-slate-400">
      {{ t('panel.progress', { revealed: revealedCount, total: teams.length }) }}
    </p>

    <ul class="mt-6 space-y-4">
      <li
        v-for="team in teams"
        :key="team.id"
        class="rounded-2xl border border-slate-600 bg-slate-900 p-4 sm:p-5"
      >
        <template v-if="revealed.has(team.id)">
          <div class="flex items-start gap-4">
            <img
              :src="assetUrl(team.logo)"
              :alt="team.name"
              class="h-16 w-16 shrink-0 rounded-xl border border-slate-600 object-cover"
            />
            <div class="min-w-0">
              <h3 class="text-xl font-bold text-white">{{ team.name }}</h3>
              <p v-if="team.prime" class="mt-1 text-sm font-semibold text-amber-200">
                {{ t('card.prime') }}
              </p>
              <p class="mt-2 text-base text-sky-200">
                <span class="text-slate-400">{{ t('card.hq') }} :</span>
                {{ t(`teams.${team.id}.location`) }}
              </p>
              <p class="mt-1 font-mono text-sm text-slate-400">
                {{ formatCoordinates(team.location) }}
              </p>
              <p class="mt-3 text-base leading-relaxed text-slate-200">
                {{ t(`teams.${team.id}.description`) }}
              </p>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="min-w-0">
              <h3 class="text-base font-semibold text-white">{{ t('panel.unknown') }}</h3>
              <p class="mt-1 font-mono text-sm text-slate-400">
                {{ formatCoordinates(team.location) }}
              </p>
            </div>
            <button
              type="button"
              class="rounded-lg bg-amber-300 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              @click="emit('select', team)"
            >
              {{ t('a11y.reveal') }}
            </button>
          </div>
        </template>
      </li>
    </ul>
  </section>
</template>
