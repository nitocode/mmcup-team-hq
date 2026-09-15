<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import GlobeView from './components/GlobeView.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import MysteryPanel from './components/MysteryPanel.vue'
import TeamCard from './components/TeamCard.vue'
import ToastMessage from './components/ToastMessage.vue'
import { teams, type Team } from './data/teams'

const { t } = useI18n()

const globe = ref<InstanceType<typeof GlobeView> | null>(null)
const revealed = reactive(new Set<string>())
const selected = ref<Team | null>(null)
const desktopQuery = window.matchMedia('(min-width: 1024px)')
const panelOpen = ref(desktopQuery.matches)
const onDesktopChange = (e: MediaQueryListEvent) => (panelOpen.value = e.matches)
desktopQuery.addEventListener('change', onDesktopChange)

const nextMystery = computed(() => teams.find((team) => !revealed.has(team.id)) ?? null)
const revealedCount = computed(() => teams.filter((team) => revealed.has(team.id)).length)

function select(team: Team) {
  revealed.add(team.id)
  selected.value = team
  globe.value?.flyTo(team.location)
}

function selectNext() {
  if (nextMystery.value) select(nextMystery.value)
}

const toast = ref<string | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | undefined

function showToast(message: string) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = null), 4500)
}

onBeforeUnmount(() => {
  clearTimeout(toastTimer)
  desktopQuery.removeEventListener('change', onDesktopChange)
})
</script>

<template>
  <div class="starfield relative h-full w-full overflow-hidden">
    <!-- Background nebula -->
    <div
      class="pointer-events-none absolute inset-0"
      style="background: radial-gradient(60% 60% at 50% 55%, rgba(56, 89, 189, 0.28) 0%, rgba(5, 8, 22, 0) 70%)"
    ></div>

    <!-- Globe stage -->
    <main class="absolute inset-0 flex items-center justify-center">
      <div class="aspect-square w-[min(100vw,82svh)] translate-y-4 sm:translate-y-2 lg:translate-y-0">
        <GlobeView ref="globe" :teams="teams" :revealed="revealed" :selected-id="selected?.id ?? null" @select="select" />
      </div>
    </main>

    <!-- Header -->
    <header class="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-4 sm:p-6">
      <div class="animate-rise pointer-events-auto">
        <h1 class="text-lg font-extrabold leading-tight tracking-tight text-white drop-shadow sm:text-2xl">
          🌍 {{ t('app.title') }}
        </h1>
        <p class="mt-1 max-w-[11rem] text-xs text-slate-300 sm:max-w-xs sm:text-sm">{{ t('app.subtitle') }}</p>
      </div>

      <div class="animate-rise pointer-events-auto flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
        <LanguageSwitcher />
        <button
          type="button"
          class="whitespace-nowrap rounded-full bg-rose-500/90 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-rose-900/40 ring-1 ring-rose-300/40 transition hover:bg-rose-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 sm:text-sm"
          @click="showToast(t('cantFind.toast'))"
        >
          {{ t('cantFind.button') }}
        </button>
      </div>
    </header>

    <!-- Hint -->
    <p
      class="pointer-events-none absolute inset-x-0 bottom-5 z-10 hidden text-center text-xs text-slate-400 sm:block"
    >
      {{ t('globe.hint') }}
    </p>

    <!-- Mystery panel (floating on desktop, bottom sheet on mobile) -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-6 opacity-0"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="translate-y-6 opacity-0"
    >
      <div
        v-if="panelOpen"
        class="fixed inset-x-3 bottom-3 z-30 lg:absolute lg:inset-x-auto lg:bottom-6 lg:left-6 lg:w-80"
      >
        <MysteryPanel
          :teams="teams"
          :revealed="revealed"
          :selected-id="selected?.id ?? null"
          @select="select"
          @close="panelOpen = false"
        />
      </div>
    </Transition>

    <button
      v-if="!panelOpen"
      type="button"
      class="glass fixed bottom-4 left-4 z-30 flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 lg:absolute lg:bottom-6 lg:left-6"
      @click="panelOpen = true"
    >
      🛰️ {{ t('panel.toggle') }}
      <span class="rounded-full bg-amber-300 px-2 py-0.5 text-[11px] font-bold text-slate-900">
        {{ revealedCount }}/{{ teams.length }}
      </span>
    </button>

    <TeamCard :team="selected" :has-next="nextMystery !== null" @close="selected = null" @next="selectNext" />
    <ToastMessage :message="toast" />
  </div>
</template>
