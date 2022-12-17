<script lang="ts" setup>
const props = defineProps({
  structure: {
    type: Object as () => StructureItem,
    required: true
  },
  isSelected: {
    type: Boolean,
    required: true
  },
  currentSelecttedId: {
    type: String,
    required: false
  }
})

const componentDef = computed(() => RegisteredStructureComponents.find(c => c.name === props.structure.component && c.group === props.structure.group))

const emit = defineEmits(['addStructure', 'onStructureItemClick'])

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

const onAddStructure = (s: StructureComponent, parentId?: string, pos?: 'begin'|'end') => {
  emit('addStructure', s, parentId, pos)
}

const onStructureItemClick = (item: StructureItem) => {
  emit('onStructureItemClick', item)
}

</script>

<template>
  <component
    :is="comp"
    :structure="structure"
    :current-selectted-id="currentSelecttedId"
    :is-selected="isSelected"
    @add-structure="onAddStructure"
    @on-structure-item-click="onStructureItemClick"
    :class="`mb-2 border px-2 py-2 ${componentDef?.display || 'inline-block'} ${isSelected ? 'border-dashed border-blue-500' : 'border-dotted border-slate-600 hover:border-dashed hover:border-slate-400'}`"
    :data-structure-id="structure.id"
  />
</template>

