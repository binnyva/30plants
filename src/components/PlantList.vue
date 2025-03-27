<template>
  <div class="container mx-auto p-4">
    <div class="bg-white rounded-lg shadow">
      <div class="p-4">
        <div class="flex items-center justify-between mb-4">
          <input
            v-model="listTitle"
            class="text-xl font-semibold border-b-2 border-gray-300 focus:border-green-500 focus:outline-none"
            @blur="updateTitle"
          >
          <div class="flex items-center ml-auto gap-2">
            <button
              v-if="isEditMode"
              class="ml-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              @click="confirmDeleteList"
            >
              Delete List
            </button>
            <button
              class="px-3 py-1 text-sm rounded"
              :class="isEditMode ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'"
              @click="toggleEditMode"
            >
              {{ isEditMode ? 'Done' : 'Edit' }}
            </button>
          </div>
        </div>

        <div class="space-y-1">
          <div
            v-for="(item, index) in currentList?.items"
            :key="item.id"
            class="flex items-center gap-2 px-3 py-2 rounded group"
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
            placeholder="Add new item or collection name..."
            class="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            @keyup.enter="addItem"
            @input="onInputChange"
          >
          <button
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            @click="addItem"
          >
            Add
          </button>
        </div>

        <!-- Suggestions List -->
        <ul v-if="suggestions.length > 0" class="absolute bg-white border border-gray-300 mt-1 rounded shadow-lg">
          <li v-for="(suggestion, index) in suggestions" :key="index" class="px-3 py-2 hover:bg-gray-200 cursor-pointer" @click="selectSuggestion(suggestion)">
            {{ suggestion.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePlantStore } from '../store/plantStore'

const route = useRoute()
const store = usePlantStore()
const listTitle = ref('')
const newItem = ref('')
const isEditMode = ref(false)
const suggestions = ref([])

// Watch for changes in the input field
const onInputChange = () => {
  if (newItem.value.length >= 3) {
    // Collect all items from the current list and all collections
    const allItems = store.lists.value.flatMap(list => list.items).concat(store.collections.value)
    suggestions.value = allItems.filter((item) => {
      return item.name.toLowerCase().includes(newItem.value.toLowerCase())
    })
  } else {
    suggestions.value = []
  }
}

const selectSuggestion = (suggestion: { name: string }) => {
  newItem.value = suggestion.name
  suggestions.value = [] // Clear suggestions
}

const currentList = computed(() => {
  const listId = route.params.id as string
  return store.lists.value.find(l => l.id === listId)
})

// Initialize list title when component is mounted
if (currentList.value) {
  listTitle.value = currentList.value.title
}

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
}

const updateTitle = () => {
  if (currentList.value) {
    store.updateListTitle(currentList.value.id, listTitle.value)
  }
}

const confirmDeleteList = () => {
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure you want to delete this list? This action cannot be undone.')) {
    if (currentList.value) {
      store.deleteList(currentList.value.id)
    }
  }
}

const addItem = () => {
  if (!newItem.value.trim() || !currentList.value) {
    return
  }

  const itemName = newItem.value.trim()

  // Check if the item already exists in the current list
  const itemExists = currentList.value.items.some(item => item.name.toLowerCase() === itemName.toLowerCase())

  if (itemExists) {
    // eslint-disable-next-line no-alert
    alert('This item is already in the list.')
    newItem.value = ''
    return
  }

  // Check if the input matches a collection name
  const collection = store.collections.value.find(c => c.name.toLowerCase() === itemName.toLowerCase())

  if (collection) {
    // If it's a collection, add all its items
    store.addCollectionToList(currentList.value.id, collection.id)
  } else {
    // If it's not a collection, add as a single item
    store.addItemToList(currentList.value.id, itemName)
  }

  newItem.value = ''
}

const deleteItem = (itemId: string) => {
  if (currentList.value) {
    store.deleteItemFromList(currentList.value.id, itemId)
  }
}
</script>
