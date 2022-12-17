<script lang="ts" setup>
const props = defineProps({
  structure: {
    type: Object as () => StructureItem,
    required: true
  },
  isSelected: {
    type: Boolean,
    required: true
  }
})

const getProp = (key: string, defaultValue: any) => {
  return props.structure.props[key] || defaultValue
}
</script>

<template>
  <h1
    class="text-2xl font-bold transition-all duration-300"
  >
    {{ getProp('text', 'Untitled') }}
  </h1>
</template>
