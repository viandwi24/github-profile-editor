<script lang="ts" setup>
const props = defineProps({
  structure: {
    type: Object as () => StructureItem,
    required: true
  }
})

const capitalizeEachWord = (str: string) => {
  var splitStr = str.toLowerCase().split(' ')
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
  }
  return splitStr.join(' ')
}

const comp = computed(() => {
  const { group, component } = props.structure
  const name = `${capitalizeEachWord(group)}${capitalizeEachWord(component)}`
  try {
    return resolveComponent(`StructureComponent${name}`)
  } catch (error) {
    return `div`
  }
})

</script>

<template>
  <component :is="comp" :structure="structure" class="mb-2" />
</template>

