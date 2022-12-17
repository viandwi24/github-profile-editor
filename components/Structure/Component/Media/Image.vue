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
  <img
    class="transition-all duration-300"
    :alt="getProp('alt', 'image')"
    :src="getProp('src', '')"
    :style="{
      width: getProp('width', '100%'),
      height: getProp('height', 'auto'),
    }"
  />
</template>
