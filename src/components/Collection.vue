<template>
  <div class="container mx-auto p-4">
    <div class="bg-white rounded-lg shadow">
      <div class="p-4">
        <div class="flex items-center justify-between mb-4">
          <input
            v-model="collectionName"
            class="text-xl font-semibold border-b-2 border-gray-300 focus:border-green-500 focus:outline-none"
            @blur="updateName"
          >
          <button
            class="px-3 py-1 text-sm rounded"
            :class="isEditMode ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'"
            @click="toggleEditMode"
          >
            {{ isEditMode ? 'Done' : 'Edit' }}
          </button>
        </div>

        <div class="space-y-1">
          <div
            v-for="(item, index) in currentCollection?.items"
            :key="item.id"
            class="flex items-center gap-2 group px-3 py-2 rounded"
            :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
          >
            <span class="text-gray-500">{{ index + 1 }}.</span>
            <span>{{ item.name }}</span>
            <button
              v-if="isEditMode"
              class="ml-auto opacity-0 group-hover:opacity-100 px-2 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-opacity"
              @click="deleteItem(item.id)"
            >
              Delete
            </button>
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <input
            v-model="newItem"
            placeholder="Add new item to collection..."
            class="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            @keyup.enter="addItem"
          >
          <button
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            @click="addItem"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePlantStore } from '../store/plantStore'
import type { Collection } from '../types'

const route = useRoute()
const store = usePlantStore()
const collectionName = ref('')
const newItem = ref('')
const isEditMode = ref(false)

const currentCollection = computed(() => {
  const collectionId = route.params.id as string
  return store.collections.value.find(c => c.id === collectionId)
})

// Initialize collection name when component is mounted
if (currentCollection.value) {
  collectionName.value = currentCollection.value.name
}

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
}

const updateName = () => {
  if (currentCollection.value) {
    store.updateCollectionName(currentCollection.value.id, collectionName.value)
  }
}

const addItem = () => {
  if (newItem.value.trim() && currentCollection.value) {
    store.addItemToCollection(currentCollection.value.id, newItem.value.trim())
    newItem.value = ''
  }
}

const deleteItem = (itemId: string) => {
  if (currentCollection.value) {
    store.deleteItemFromCollection(currentCollection.value.id, itemId)
  }
}
</script>
