<script lang="ts" setup>
defineProps({
  text: {
    type: String,
    default: 'Drag and drop a component here'
  }
})
const emit = defineEmits(['onDropComponent'])

// handle::drags
const dragSelected = ref<Partial<StructureComponent>>({
  group: undefined,
  name: undefined
})
const blankComponentDragged = ref<string|undefined>('')

const onDragOverBlankComponent = (id: string, e: DragEvent) => {
  e.preventDefault()
  blankComponentDragged.value = id
  // console.log('drag over blank component', e.dataTransfer?.getData('text/plain'))
}
const onDragLeaveBlankComponent = (id: string, e: DragEvent) => {
  e.preventDefault()
  blankComponentDragged.value = undefined
  // console.log('drag leave blank component', e)
}
const onDropBlankComponent = (e: DragEvent) => {
  e.preventDefault()
  blankComponentDragged.value = undefined

  const component: {
    group: string,
    name: string
  } = JSON.parse(e.dataTransfer?.getData('text/plain') || '{}')

  if (component.name === undefined || component.group === undefined) {
    return
  }

  // apply
  const comp = RegisteredStructureComponents.find(c => c.name === component.name && c.group === component.group)
  // console.log('drop blank component', component, comp)
  if (!comp) return
  emit('onDropComponent', comp)
}
</script>

<template>
  <div
    class="transition-all duration-300 border rounded px-4 py-4 flex justify-center items-center h-10 border-slate-800/80 text-gray-500 text-xs font-light"
    @drop="(e) => {
      onDropBlankComponent(e)
      ;(e.target as HTMLElement).classList.remove('bg-slate-200')
    }"
    @dragover="(e) => {
      onDragOverBlankComponent('bottom', e)
      ;(e.target as HTMLElement).classList.add('bg-slate-200')
    }"
    @dragleave="(e) => {
      onDragLeaveBlankComponent('bottom', e)
      ;(e.target as HTMLElement).classList.remove('bg-slate-200')
    }"
  >
    {{ blankComponentDragged ? `Release drop component` : text }}
  </div>
</template>
