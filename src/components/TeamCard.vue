<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { assetUrl, formatCoordinates, type Team } from '../data/teams'

const props = defineProps<{
  team: Team | null
  hasNext: boolean
}>()

const emit = defineEmits<{
  close: []
  next: []
}>()

const { t } = useI18n()
const closeButton = ref<HTMLButtonElement | null>(null)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.team) emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

watch(
  () => props.team,
  (team) => {
    if (team) requestAnimationFrame(() => closeButton.value?.focus())
  },
)
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    leave-active-class="transition duration-150 ease-in"
    leave-to-class="opacity-0"
  >
    <div
      v-if="team"
      class="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/60 p-4 backdrop-blur-sm sm:items-center"
      @click.self="emit('close')"
    >
      <div
        :key="team.id"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`team-title-${team.id}`"
        class="glass animate-pop relative w-full max-w-md overflow-hidden rounded-3xl p-6 sm:p-8"
      >
        <!-- Ambient glow -->
        <div
          class="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full blur-3xl"
          :class="team.prime ? 'bg-amber-400/30' : 'bg-sky-500/25'"
        ></div>

        <button
          ref="closeButton"
          type="button"
          class="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          :aria-label="t('card.close')"
          @click="emit('close')"
        >
          <svg viewBox="0 0 20 20" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>

        <div class="relative flex flex-col items-center text-center">
          <div
            class="mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl shadow-2xl ring-2"
            :class="team.prime ? 'bg-amber-100 ring-amber-300/70' : 'bg-slate-800 ring-white/15'"
          >
            <img
              v-if="team.logo"
              :src="assetUrl(team.logo)"
              :alt="`${team.name} logo`"
              class="h-full w-full object-cover"
            />
            <span v-else class="text-6xl leading-none" aria-hidden="true">{{ team.emoji }}</span>
          </div>

          <p
            v-if="team.prime"
            class="mb-2 inline-flex items-center gap-1 rounded-full bg-amber-300/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-200 ring-1 ring-amber-300/40"
          >
            ⭐ {{ t('card.prime') }}
          </p>

          <h2 :id="`team-title-${team.id}`" class="text-3xl font-extrabold tracking-tight text-white">
            {{ team.name }} <span aria-hidden="true">{{ team.emoji }}</span>
          </h2>

          <div class="mt-4 w-full rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
            <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              {{ t('card.hq') }}
            </p>
            <p class="mt-1 text-lg font-semibold text-sky-200">
              📍 {{ t(`teams.${team.id}.location`) }}
            </p>
            <p class="mt-0.5 font-mono text-xs text-slate-400">
              {{ formatCoordinates(team.location) }}
            </p>
          </div>

          <p class="mt-5 text-balance text-base leading-relaxed text-slate-200">
            {{ t(`teams.${team.id}.description`) }}
          </p>

          <div class="mt-6 flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              class="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-200 ring-1 ring-white/15 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              @click="emit('close')"
            >
              {{ t('card.close') }}
            </button>
            <button
              v-if="hasNext"
              type="button"
              class="rounded-full bg-amber-300 px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg shadow-amber-300/30 transition hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
              @click="emit('next')"
            >
              {{ t('card.next') }} →
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
