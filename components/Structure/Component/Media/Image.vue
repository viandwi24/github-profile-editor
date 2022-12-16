<script lang="ts" setup>
const props = defineProps({
  structure: {
    type: Object as () => StructureItem,
    required: true
  }
})

const getProp = (key: string, defaultValue: any) => {
  return props.structure.props[key] || defaultValue
}
</script>

<template>
  <img class="transition-all duration-300 border border-transparent hover:bg-slate-800/50 hover:border-slate-700" :alt="getProp('alt', 'image')" :src="getProp('src', '')" :style="getProp('style', {})" />
</template>
