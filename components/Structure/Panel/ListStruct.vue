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
  <StructurePanelBase title="Structures">
    <div class="flex flex-col space-y-2">
      <StructurePanelListStructList
        :structure-item-selected="structureItemSelected"
        :structures="structures"
        @on-structure-item-click="(item) => emit('onStructureItemClick', item)"
      />
    </div>
  </StructurePanelBase>
</template>
