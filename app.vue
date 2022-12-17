<script lang="ts" setup>

const randomId = () => {
  return Math.random().toString(36).substr(2, 9)
}


// vars
const mode = ref<'design'|'preview'>('design')
const structures = ref<StructureItem[]>([])
const result = computed(() => {
  const parsed = ParseStructure(structures.value)
  console.log('result', parsed)
  return parsed
})

// panel::structures
const StructureComponentsGroupping = computed(() => {
  const group: {
    name: string
    components: StructureComponent[]
  }[] = []
  RegisteredStructureComponents.forEach((component) => {
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
  // console.log('structure item click', structure)
  structureItemSelected.value = structure
  structureItemComponent.value = RegisteredStructureComponents.find(c => c.name === structureItemSelected.value?.component && c.group === structureItemSelected.value?.group)
}
const handleStrucutreItemNativeClick = (e: MouseEvent, item: StructureItem) => {
  const id = (e.target as HTMLElement).dataset.structureId || ''
  if (id !== item.id) return
  onStructureItemClick(item)
}
const deleteStructureItemSelected = () => {
  if (structureItemSelected.value && structureItemSelected.value.id) {
    // structures.value = structures.value.filter((structure) => structure.id !== structureItemSelected.value?.id)
    const search = (struct: StructureItem[]) => {
      for (let i = 0; i < struct.length; i++) {
        if (struct[i].id === structureItemSelected.value?.id) {
          struct.splice(i, 1)
          return
        }
        if (struct[i].children) {
          search(struct[i].children || [])
        }
      }
    }
    search(structures.value)
    structureItemSelected.value = undefined
  }
}
const onAddStructure = (component: StructureComponent, parentId?: string, pos: 'begin'|'end' = 'end') => {
  console.log('add structure', parentId, component, pos)
  const componentDef = RegisteredStructureComponents.find(c => c.name === component.name && c.group === component.group)
  if (!componentDef) return
  // builds
  const props: {
    [key: string]: any
  } = {}
  for (const propKey in componentDef?.props || {}) {
    const val = componentDef?.props?.[propKey]
    if (val) {
      props[propKey] = val.default || undefined
    }
  }

  // add
  const s: StructureItem = {
    id: randomId(),
    component: component.name as string,
    group: component.group as string,
    props: {
      ...props
    },
  }

  if (componentDef.allowChildren === true) {
    s.children = []
  }

  if (!parentId) {
    if (pos === 'begin') {
      structures.value.unshift(s)
    } else {
      structures.value.push(s)
    }
  } else {
    // search parent id, search in root structures or every children
    // structures.value.children or structures.value.children[*].children
    const search = (structures: StructureItem[]) => {
      for (const structure of structures) {
        if (structure.id === parentId) {
          if (structure.children) {
            if (pos === 'begin') {
              structure.children.unshift(s)
            } else {
              structure.children.push(s)
            }
          }
          return
        }
        if (structure.children) {
          search(structure.children)
        }
      }
    }
    search(structures.value)
  }

  // display pros
  onStructureItemClick(s)
}

// handle::screen
const onScreenClicked = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.classList.contains('screen')) {
    structureItemSelected.value = undefined
    structureItemComponent.value = undefined
  }
}

// handle::drag
const onDragStartComponent = (component: StructureComponent, e: DragEvent) => {
  // console.log('drag start', component, e)
  // dragSelected.value = {
  //   ...component
  // }
  if (e.dataTransfer) {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      group: component.group,
      name: component.name
    }))
    // e.dataTransfer.effectAllowed = 'copyMove'
    // e.dataTransfer.dropEffect = 'move'
  }
}
const onDragEndComponent = (component: StructureComponent, e: DragEvent) => {
  // console.log('drag end component', e)
  // dragSelected.value = {
  //   group: undefined,
  //   name: undefined
  // }
}
const onDropComponent = (component: StructureComponent, parentId?: string) => {
  onAddStructure(component, parentId, 'end')
  console.log('drop component on root', component, parentId)
}


// handle::autosaved
const enableAutoSaved = ref(false)
const saveNow = () => {
  localStorage.setItem('structures_autosaved', JSON.stringify(structures.value))
}
let autosavedAnim: NodeJS.Timeout|undefined = undefined
const handleAutosaved = () => {
  saveNow()
  autosavedAnim = setTimeout(() => {
    handleAutosaved()
  }, 3000)
}
onBeforeMount(() => {
  const defaultStructures = [
    {
      id: randomId(),
      component: 'heading1',
      group: 'text',
      props: {
        text: 'Hi 👋 I am viandwi24!'
      },
    },
    {
      id: randomId(),
      component: 'image',
      group: 'media',
      props: {
        src: 'https://raw.githubusercontent.com/viandwi24/viandwi24/main/assets/myroom.jpg',
        alt: 'My Room',
        width: '100%',
        height: 'auto',
        position: 'left'
      }
    },
    {
      id: randomId(),
      component: 'container',
      group: 'layout',
      props: {
        textAlign: 'center',
      },
      children: [
        {
          id: randomId(),
          component: 'paragraph',
          group: 'text',
          props: {
            text: 'I’m currently working on Freelance as Web Dev Programmer!'
          }
        }
      ]
    },
  ]

  if (enableAutoSaved.value) {
    const data = localStorage.getItem('structures_autosaved') || '[]'
    try {
      const parsed = JSON.parse(data)
      if (!Array.isArray(parsed)) throw new Error('not array')
      if (parsed.length === 0) throw new Error('empty array')

      structures.value = parsed
    } catch (error) {
      structures.value = defaultStructures
    }
    handleAutosaved()
  } else {
    structures.value = defaultStructures
  }
})
onBeforeUnmount(() => {
  if (enableAutoSaved) {
    saveNow()
    if (autosavedAnim) {
      clearTimeout(autosavedAnim)
    }
  }
})
</script>

<template>
  <Html class="dark">
    <div class="flex flex-col w-screen h-screen max-h-screen max-w-screen overflow-hidden relative bg-slate-900 text-gray-100">
      <div class="px-4 py-2 border-b border-slate-800">
        <div class="font-bold text-lg">GITHUB PROFILE BUILDER</div>
      </div>
      <div class="flex-1 flex overflow-hidden">
        <!-- panel::left -->
        <div class="flex flex-col border-r border-slate-800" :style="{ width: '280px' }">
          <StructurePanelListStruct
            :structure-item-selected="structureItemSelected"
            :structures="structures"
            @on-structure-item-click="onStructureItemClick"
          />
          <StructurePanelBase title="Result" :scrollable="false">
            <textarea
              v-model="result"
              class="w-full h-full p-2 bg-slate-800 text-xs text-gray-100 border border-slate-800 rounded"
            />
          </StructurePanelBase>
        </div>
        <!-- screen canvas -->
        <div class="flex-1 bg-black/50 px-4 py-4 overflow-y-scroll" @click="onScreenClicked">
          <div class="screen max-w-screen-md mx-auto flex-1 relative bg-transparent">
            <div class="canvas rounded border border-slate-800 overflow-hidden">
              <!-- header -->
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
              <!-- content -->
              <ClientOnly>
                <div class="py-2 px-4">
                  <StructureItem
                    v-for="item in structures" :key="item.id"
                    :structure="item"
                    :current-selectted-id="structureItemSelected?.id"
                    :is-selected="structureItemSelected?.id === item.id"
                    @add-structure="onAddStructure"
                    @on-structure-item-click="onStructureItemClick"
                    @click.native="(e: MouseEvent) => handleStrucutreItemNativeClick(e, item)"
                  />
                  <div>
                    <StructureBlankDragable @on-drop-component="onDropComponent" />
                  </div>
                </div>
              </ClientOnly>
            </div>
          </div>
        </div>
        <!-- panel::right -->
        <div class="border-l flex flex-col divide-y divide-slate-800 border-slate-800" :style="{ width: '280px' }">
          <div class="flex-1 overflow-hidden">
            <div class="font-bold px-4 py-3 bg-slate-900/50 border-b border-slate-800">Components</div>
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
          <!-- panel::right::props -->
          <div class="flex-1 overflow-hidden">
            <div class="font-bold px-4 py-3 bg-slate-900/50 border-b border-slate-800">Properties</div>
            <div class="flex-1 max-h-full overflow-y-auto">
              <div v-if="structureItemSelected" class="text-xs">
                <div class="border-b border-slate-500">
                  <div class="rounded flex">
                    <div class="w-1/3 px-2 py-1 bg-slate-700/60">ID</div>
                    <div class="w-2/3 px-2 py-1 bg-slate-800">{{ structureItemSelected.id }}</div>
                  </div>
                  <div class="rounded flex">
                    <div class="w-1/3 px-2 py-1 bg-slate-700/60">Component</div>
                    <div class="w-2/3 px-2 py-1 bg-slate-800">{{ structureItemSelected.group }}/{{ structureItemSelected.component }}</div>
                  </div>
                  <div class="rounded flex">
                    <div class="w-1/3 px-2 py-1 bg-slate-700/60">Actions</div>
                    <div class="w-2/3 px-2 py-1 bg-slate-800">
                      <button class="text-red-500" @click="deleteStructureItemSelected">delete</button>
                    </div>
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
                      <template v-else-if="prop.type === 'select'">
                        <!-- <input type="text" class="w-full rounded bg-slate-800 text-gray-200" v-model="structureItemSelected.props[propKey]" /> -->
                        <select class="w-full rounded bg-slate-800 text-gray-200" v-model="structureItemSelected.props[propKey]">
                          <option v-for="option in prop.options" :value="option" :key="option">{{ option }}</option>
                        </select>
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
    </div>
    <div
      class="z-20 fixed bottom-0 bg-slate-700 text-gray-500 rounded-lg shadow mb-4 overflow-hidden"
      :style="{
        left: '50%',
        transform: 'translateX(-50%)',
      }"
    >
      <!-- radion input - select "Design" or "Preview" mode -->
      <div class="flex items-center">
        <div class="transition-all duration-300 flex items-center px-2 py-1 rounded-lg text-sm" :class="{ 'bg-blue-600 text-gray-300': mode === 'design' }">
          <input type="radio" id="design" name="mode" value="design" class="hidden" v-model="mode" />
          <label class="cursor-pointer" for="design">Design</label>
        </div>
        <div class="transition-all duration-300 flex items-center px-2 py-1 rounded-lg text-sm" :class="{ 'bg-blue-600 text-gray-300': mode === 'preview' }">
          <input type="radio" id="preview" name="mode" value="preview" class="hidden" v-model="mode" />
          <label class="cursor-pointer" for="preview">Preview</label>
        </div>
      </div>
    </div>
  </Html>
</template>
