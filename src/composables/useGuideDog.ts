import { ref, watch } from 'vue'

const STORAGE_KEY = 'mmcup-guide-dog'

function initialValue(): boolean {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'on') return true
    if (saved === 'off') return false
  } catch {
    /* storage unavailable */
  }
  // Nobody asked yet: follow the system's reduced-motion preference.
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * "Guide dog" accessibility mode: swaps the animated WebGL globe for a plain,
 * static list of headquarters and disables every animation and transition.
 */
export const guideDog = ref(initialValue())

function apply(enabled: boolean) {
  document.documentElement.dataset.guideDog = enabled ? 'true' : 'false'
}

apply(guideDog.value)

watch(guideDog, (enabled) => {
  apply(enabled)
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off')
  } catch {
    /* storage unavailable */
  }
})

export function toggleGuideDog() {
  guideDog.value = !guideDog.value
}
