<script setup lang="ts">
import { ref, type ComponentPublicInstance } from 'vue'
import { useI18n } from 'vue-i18n'
import { assetUrl, formatCoordinates, type Team } from '../data/teams'
import { useGlobe, type ScreenPoint } from '../composables/useGlobe'

const props = defineProps<{
  teams: Team[]
  revealed: Set<string>
  selectedId: string | null
}>()

const emit = defineEmits<{
  select: [team: Team]
}>()

const { t } = useI18n()

const canvas = ref<HTMLCanvasElement | null>(null)
const markerEls: (HTMLElement | null)[] = []

function setMarkerEl(index: number, el: Element | ComponentPublicInstance | null) {
  markerEls[index] = (el as HTMLElement | null) ?? null
}

function onFrame(points: ScreenPoint[]) {
  for (let i = 0; i < points.length; i++) {
    const el = markerEls[i]
    const p = points[i]
    if (!el || !p) continue
    // Fade and shrink markers as they wrap around the limb of the globe.
    const edge = Math.max(0, Math.min(1, (p.depth + 0.15) / 0.45))
    const scale = 0.55 + 0.45 * edge
    el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(${scale})`
    el.style.opacity = p.visible ? String(0.35 + 0.65 * edge) : '0'
    el.style.visibility = p.visible ? 'visible' : 'hidden'
    el.style.zIndex = String(Math.round(100 + p.depth * 50))
  }
}

const { flyTo } = useGlobe(canvas, { markers: props.teams, onFrame })

defineExpose({ flyTo })
</script>

<template>
  <div class="relative h-full w-full select-none">
    <canvas ref="canvas" class="globe-canvas" aria-hidden="true"></canvas>

    <!-- Clickable DOM overlay, positioned every frame from the projected marker coordinates. -->
    <div class="pointer-events-none absolute inset-0 overflow-visible">
      <button
        v-for="(team, i) in teams"
        :key="team.id"
        :ref="(el) => setMarkerEl(i, el)"
        type="button"
        class="group pointer-events-auto absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-amber-300/80"
        style="opacity: 0; visibility: hidden"
        :aria-label="
          revealed.has(team.id)
            ? t('globe.revealedMarkerLabel', { name: team.name })
            : t('globe.markerLabel', { coords: formatCoordinates(team.location) })
        "
        @click="emit('select', team)"
      >
        <!-- Pulse ring -->
        <span
          class="absolute inset-2 rounded-full"
          :class="revealed.has(team.id) ? 'bg-sky-300/30' : 'animate-ping-slow bg-amber-300/50'"
        ></span>
        <!-- Core -->
        <span
          class="relative flex items-center justify-center overflow-hidden rounded-full shadow-lg transition-transform duration-200 group-hover:scale-110"
          :class="[
            revealed.has(team.id)
              ? 'h-9 w-9 bg-slate-900 ring-2 ring-sky-300/80'
              : 'h-7 w-7 bg-amber-300 text-sm font-bold text-slate-900 shadow-amber-300/50 ring-2 ring-amber-100/80',
            selectedId === team.id ? 'scale-125 ring-4 ring-white/80' : '',
          ]"
        >
          <img
            v-if="revealed.has(team.id)"
            :src="assetUrl(team.logo)"
            :alt="team.name"
            class="h-full w-full object-cover"
          />
          <template v-else>?</template>
        </span>
      </button>
    </div>
  </div>
</template>
