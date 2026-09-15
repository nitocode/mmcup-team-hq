<script setup lang="ts">
defineProps<{
  message: string | null
}>()
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4" aria-live="polite" role="status">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-4 opacity-0"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-if="message"
        class="pointer-events-auto max-w-md rounded-2xl border border-rose-400/40 bg-rose-950/80 px-5 py-3 text-center text-sm font-semibold text-rose-100 shadow-2xl shadow-rose-900/50 backdrop-blur-md"
      >
        {{ message }}
      </div>
    </Transition>
  </div>
</template>
