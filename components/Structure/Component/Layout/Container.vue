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

const emit = defineEmits(['addStructure', 'onStructureItemClick'])

const handleStrucutreItemNativeClick = (e: MouseEvent, item: StructureItem) => {
  const id = (e.target as HTMLElement).dataset.structureId || ''
  if (id !== item.id) return
  emit('onStructureItemClick', item)
}

const getProp = (key: string, defaultValue: any) => {
  return props.structure.props[key] || defaultValue
}

const clicked = (e: MouseEvent, item: StructureItem) => {
  handleStrucutreItemNativeClick(e, item)
  console.log('clicked', props.structure.id, item)
}


const onAddStructure = (s: StructureComponent, parentId: string) => {
  emit('addStructure', s, parentId)
  console.log('onAddStructure item', s, parentId)
}
</script>

<template>
  <div
    :style="{
      width: getProp('width', '100%'),
      textAlign: getProp('textAlign', 'left'),
    }"
  >
    <StructureBlankDragable
      v-if="(structure.children || []).length > 0"
      text="Drag and drop children component here"
      @on-drop-component="e => emit('addStructure', e, props.structure.id, 'begin')"
      class="mb-2"
    />
    <StructureItem
      v-for="item in (structure.children || [])" :key="item.id"
      :structure="item"
      :current-selectted-id="currentSelecttedId"
      :is-selected="currentSelecttedId === item.id"
      @add-structure="onAddStructure"
      @click.native="(e:any) => clicked(e, item)"
    />
    <StructureBlankDragable
      text="Drag and drop children component here"
      @on-drop-component="e => emit('addStructure', e, props.structure.id, 'end')"
    />
  </div>
</template>
