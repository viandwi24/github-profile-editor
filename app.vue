<script lang="ts" setup>
import { buildProps } from '@vue/compiler-core';

const randomId = () => {
  return Math.random().toString(36).substr(2, 9)
}

const structures = ref<StructureItem[]>([
  {
    id: randomId(),
    component: 'heading1',
    group: 'text',
    props: {
      text: 'Hi 👋 I am viandwi24!'
    }
  },
  {
    id: randomId(),
    component: 'image',
    group: 'media',
    props: {
      src: 'https://raw.githubusercontent.com/viandwi24/viandwi24/main/assets/myroom.jpg',
      alt: 'My Room',
      style: {
        width: '100%'
      }
    }
  },
  {
    id: randomId(),
    component: 'paragraph',
    group: 'text',
    props: {
      text: 'I’m currently working on Freelance as Web Dev Programmer!'
    }
  },
])

// panel::structures
const StructureComponentsGroupping = computed(() => {
  const group: {
    name: string
    components: StructureComponent[]
  }[] = []
  StructureComponents.forEach((component) => {
    const groupIndex = group.findIndex((g) => g.name === component.group)
    if (groupIndex === -1) {
      group.push({
        name: component.group,
        components: [component]
      })
    } else {
      group[groupIndex].components.push(component)
    }
  })
  return group
})

// handle::structures-item
const structureItemSelected = ref<StructureItem|undefined>(undefined)
const structureItemComponent = ref<StructureComponent|undefined>(undefined)
const onStructureItemClick = (structure: StructureItem) => {
  console.log('structure item click', structure)
  structureItemSelected.value = structure
  structureItemComponent.value = StructureComponents.find(c => c.name === structureItemSelected.value?.component && c.group === structureItemSelected.value?.group)
}
const deleteStructureItemSelected = () => {
  if (structureItemSelected.value && structureItemSelected.value.id) {
    structures.value = structures.value.filter((structure) => structure.id !== structureItemSelected.value?.id)
    structureItemSelected.value = undefined
  }
}

// handle::drags
const dragSelected = ref<Partial<StructureComponent>>({
  group: undefined,
  name: undefined
})
const blankComponentDragged = ref<string|undefined>('')

const onDragStartComponent = (component: StructureComponent, e: DragEvent) => {
  console.log('drag start', component, e)
  dragSelected.value = {
    ...component
  }
}
const onDragEndComponent = (component: StructureComponent, e: DragEvent) => {
  console.log('drag end component', e)
  dragSelected.value = {
    group: undefined,
    name: undefined
  }
}
const onDragOverBlankComponent = (id: string, e: DragEvent) => {
  e.preventDefault()
  blankComponentDragged.value = id
  // console.log('drag over blank component', e)
  // ;(e.target as HTMLDivElement).classList.add('bg-slate-800/50')
}
const onDragLeaveBlankComponent = (id: string, e: DragEvent) => {
  e.preventDefault()
  blankComponentDragged.value = undefined
  // console.log('drag leave blank component', e)
  // ;(e.target as HTMLDivElement).classList.remove('bg-slate-800/50')
}
const onDropBlankComponent = (e: DragEvent) => {
  e.preventDefault()
  // console.log('drop blank component', e)
  blankComponentDragged.value = undefined

  if (dragSelected.value.name === undefined || dragSelected.value.group === undefined) {
    return
  }

  // apply
  const buildProps  = () => {
    const props: {
      [key: string]: any
    } = {}
    for (const propKey in StructureComponents.find(c => c.name === dragSelected.value.name && c.group === dragSelected.value.group)?.props || {}) {
      const val = StructureComponents.find(c => c.name === dragSelected.value.name && c.group === dragSelected.value.group)?.props?.[propKey]
      if (val) {
        props[propKey] = val.default || undefined
      }
    }
    return props
  }
  structures.value.push({
    id: randomId(),
    component: dragSelected.value.name as string,
    group: dragSelected.value.group as string,
    props: {
      ...buildProps()
    }
  })
}
</script>

<template>
  <div class="flex w-screen h-screen bg-slate-900 text-gray-100">
    <div class="border-r border-slate-800" :style="{ width: '280px' }">
      <div>
        <div class="font-bold px-4 py-3 bg-slate-900/50 border-b border-slate-800">Structures</div>
        <div>
          <div class="flex flex-col space-y-2 px-4 py-2">
            <div
              v-for="item in structures"
              :key="item.id"
              @click="onStructureItemClick(item)"
              class="text-sm cursor-pointer"
              :class="{ 'font-semibold text-white': structureItemSelected?.id === item.id }"
            >
              - {{ item.id }} ({{ item.component }})
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- screen canvas -->
    <div class="px-4 py-4 flex-1 flex justify-center bg-black/50">
      <div class="screen max-w-screen-md flex-1 relative bg-transparent">
        <div class="rounded border border-slate-800">
          <div class="px-4 py-3 font-semibold border-b border-slate-800">
            <div class="flex space-x-1 text-xs text-gray-200">
              <div>viandwi24</div>
              <div>/</div>
              <div>
                <span>README</span>
                <span class="text-gray-400">.md</span>
              </div>
            </div>
          </div>
          <!-- readme -->
          <div class="px-4 py-2">
            <div v-for="item in structures" :key="item.id">
              <StructureItem :structure="item" @click.native="() => onStructureItemClick(item)" />
            </div>
            <div
              class="transition-all duration-300 border rounded px-4 py-4 flex justify-center items-center h-10 cursor-pointer border-slate-800/80 hover:border-slate-600 hover:bg-slate-800 text-gray-500 hover:text-gray-200 text-xs font-light"
              @drop="(e) => onDropBlankComponent(e)"
              @dragover="(e) => onDragOverBlankComponent('bottom', e)"
              @dragleave="(e) => onDragLeaveBlankComponent('bottom', e)"
            >
              {{ blankComponentDragged ? `Release component "${dragSelected.name || '-'}"` : 'Drag and drop a component here' }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- panel::right -->
    <div class="border-l flex flex-col border-slate-800" :style="{ width: '280px' }">
      <div class="flex-1">
        <div class="font-bold px-4 py-3 bg-slate-900/50 border-y border-slate-800">Components</div>
        <div class="flex-1 max-h-full overflow-y-auto">
          <div class="px-2 py-2">
            <div
              v-for="group in StructureComponentsGroupping"
              :key="Math.random()"
              class="px-2 mb-4"
            >
              <div class="mb-1 font-semibold">{{ group.name }}</div>
              <div
                v-for="item in group.components"
                :key="Math.random()"
                class="transition-all duration-300 px-3 py-1 cursor-pointer rounded hover:bg-slate-800"
                draggable="true"
                @dragstart="(e) => onDragStartComponent(item, e)"
                @dragend="(e) => onDragEndComponent(item, e)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1">
        <div class="font-bold px-4 py-3 bg-slate-900/50 border-y border-slate-800">Properties</div>
        <div class="flex-1 max-h-full overflow-y-auto">
          <div v-if="structureItemSelected" class="text-xs">
            <div class="rounded flex">
              <div class="w-1/3 px-2 py-1 bg-slate-700/60">ID</div>
              <div class="w-2/3 px-2 py-1 bg-slate-800">{{ structureItemSelected.id }}</div>
            </div>
            <div class="rounded flex">
              <div class="w-1/3 px-2 py-1 bg-slate-700/60">Component</div>
              <div class="w-2/3 px-2 py-1 bg-slate-800">{{ structureItemSelected.component }}</div>
            </div>
            <div class="rounded flex">
              <div class="w-1/3 px-2 py-1 bg-slate-700/60">Actions</div>
              <div class="w-2/3 px-2 py-1 bg-slate-800">
                <button class="text-red-500" @click="deleteStructureItemSelected">delete</button>
              </div>
            </div>
            <template v-if="structureItemComponent && structureItemComponent.props">
              <div v-for="(prop, propKey) in (structureItemComponent.props || [])" class="rounded flex">
                <div class="w-1/3 px-2 py-1 bg-slate-700/60">{{ propKey }}</div>
                <div class="w-2/3 px-2 py-1 bg-slate-800">
                  <template v-if="prop.type === 'textarea'">
                    <textarea :rows="4" class="w-full rounded bg-slate-800 text-gray-200" v-model="structureItemSelected.props[propKey]" />
                  </template>
                  <template v-else-if="prop.type === 'string'">
                    <input type="text" class="w-full rounded bg-slate-800 text-gray-200" v-model="structureItemSelected.props[propKey]" />
                  </template>
                </div>
              </div>
            </template>
          </div>
          <div v-else class="px-4 py-2">No Component Selected</div>
        </div>
      </div>
    </div>
  </div>
</template>
