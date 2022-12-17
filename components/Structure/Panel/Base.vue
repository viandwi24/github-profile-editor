<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  scrollable: {
    type: Boolean,
    required: false,
    default: true
  }
})
</script>

<template>
  <div class="flex-1 flex flex-col overflow-hidden">
    <div class="font-bold px-4 py-3 bg-slate-900/50 border-b border-slate-800">{{ title }}</div>
    <div class="flex-1" :class="{ 'max-h-full overflow-y-auto': scrollable }">
      <slot />
    </div>
  </div>
</template>
