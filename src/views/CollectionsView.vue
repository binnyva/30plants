<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">
        Collections
      </h1>
      <button
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        @click="showCreateModal = true"
      >
        Create New Collection
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="collection in collectionsWithCount" :key="collection.id" class="bg-white rounded-lg shadow p-4">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-lg font-semibold">
            {{ collection.name }}
          </h2>
          <span class="text-sm text-gray-500">{{ collection.itemCount }} items</span>
        </div>
        <router-link
          :to="{ name: 'collection', params: { id: collection.id } }"
          class="text-green-600 hover:text-green-700"
        >
          View Collection →
        </router-link>
      </div>
    </div>

    <!-- Create Collection Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-96">
        <h3 class="text-lg font-semibold mb-4">
          Create New Collection
        </h3>
        <input
          v-model="newCollectionName"
          placeholder="Collection name"
          class="w-full p-2 border rounded mb-4"
        >
        <div class="flex justify-end gap-2">
          <button
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
            @click="showCreateModal = false"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            @click="createCollection"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePlantStore } from '../store/plantStore'

const store = usePlantStore()
const collectionsWithCount = store.collectionsWithCount
const showCreateModal = ref(false)
const newCollectionName = ref('')

const createCollection = () => {
  if (newCollectionName.value.trim()) {
    store.createCollection(newCollectionName.value.trim())
    showCreateModal.value = false
    newCollectionName.value = ''
  }
}
</script>
