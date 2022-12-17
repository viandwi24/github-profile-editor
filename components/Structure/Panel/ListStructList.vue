<script lang="ts" setup>
defineProps({
  structures: {
    type: Array as () => StructureItem[],
    required: true
  },
  structureItemSelected: {
    type: Object as () => StructureItem,
    required: false
  }
})

const emit = defineEmits(['onStructureItemClick'])
</script>

<template>
  <div class="flex flex-col space-y-2 px-4 py-2">
    <div
      v-for="item in structures"
      :key="item.id"
    >
      <div
        class="text-sm cursor-pointer"
        :class="{ 'font-semibold text-white': structureItemSelected?.id === item.id }"
        @click="() => emit('onStructureItemClick', item)"
      >
        - {{ item.id }} ({{ item.component }})
      </div>
      <StructurePanelListStructList
        v-if="item.children && item.children.length > 0"
        :structure-item-selected="structureItemSelected"
        :structures="item.children || []"
        @on-structure-item-click="(item) => emit('onStructureItemClick', item)"
      />
    </div>
  </div>
</template>
