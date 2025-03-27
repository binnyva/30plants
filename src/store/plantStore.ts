import { computed, ref } from 'vue'
import type { AppData, Collection, PlantItem, PlantList } from '../types'

const STORAGE_KEY = 'plant-tracker-data'

// State
const lists = ref<PlantList[]>([])
const collections = ref<Collection[]>([])

// Load data from localStorage
const loadData = () => {
  const savedData = localStorage.getItem(STORAGE_KEY)
  if (savedData) {
    const data: AppData = JSON.parse(savedData)
    lists.value = data.lists
    collections.value = data.collections
  }
}

// Save data to localStorage
const saveData = () => {
  const data: AppData = {
    lists: lists.value,
    collections: collections.value,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// Initialize data
loadData()

// Computed properties
const listsWithCount = computed(() => {
  return lists.value.map(list => ({
    ...list,
    itemCount: list.items.length,
  }))
})

const collectionsWithCount = computed(() => {
  return collections.value.map(collection => ({
    ...collection,
    itemCount: collection.items.length,
  }))
})

// List operations
const createList = (title: string) => {
  const newList: PlantList = {
    id: crypto.randomUUID(),
    title,
    items: [],
    createdAt: new Date().toISOString(),
  }
  lists.value.push(newList)
  saveData()
  return newList
}

const updateListTitle = (listId: string, newTitle: string) => {
  const list = lists.value.find(l => l.id === listId)
  if (list) {
    list.title = newTitle
    saveData()
  }
}

const addItemToList = (listId: string, itemName: string) => {
  const list = lists.value.find(l => l.id === listId)
  if (list) {
    const newItem: PlantItem = {
      id: crypto.randomUUID(),
      name: itemName,
      createdAt: new Date().toISOString(),
    }
    list.items.push(newItem)
    saveData()
  }
}

const deleteItemFromList = (listId: string, itemId: string) => {
  const list = lists.value.find(l => l.id === listId)
  if (list) {
    list.items = list.items.filter(item => item.id !== itemId)
    saveData()
  }
}

const addCollectionToList = (listId: string, collectionId: string) => {
  const list = lists.value.find(l => l.id === listId)
  const collection = collections.value.find(c => c.id === collectionId)

  if (list && collection) {
    collection.items.forEach((item) => {
      addItemToList(listId, item.name)
    })
  }
}

// Collection operations
const createCollection = (name: string) => {
  const newCollection: Collection = {
    id: crypto.randomUUID(),
    name,
    items: [],
    createdAt: new Date().toISOString(),
  }
  collections.value.push(newCollection)
  saveData()
  return newCollection
}

const addItemToCollection = (collectionId: string, itemName: string) => {
  const collection = collections.value.find(c => c.id === collectionId)
  if (collection) {
    const newItem: PlantItem = {
      id: crypto.randomUUID(),
      name: itemName,
      createdAt: new Date().toISOString(),
    }
    collection.items.push(newItem)
    saveData()
  }
}

const deleteItemFromCollection = (collectionId: string, itemId: string) => {
  const collection = collections.value.find(c => c.id === collectionId)
  if (collection) {
    collection.items = collection.items.filter(item => item.id !== itemId)
    saveData()
  }
}

const updateCollectionName = (collectionId: string, newName: string) => {
  const collection = collections.value.find(c => c.id === collectionId)
  if (collection) {
    collection.name = newName
    saveData()
  }
}

// Export/Import operations
const exportData = () => {
  const data: AppData = {
    lists: lists.value,
    collections: collections.value,
  }
  return JSON.stringify(data, null, 2)
}

const importData = (jsonString: string) => {
  try {
    const data: AppData = JSON.parse(jsonString)
    lists.value = data.lists
    collections.value = data.collections
    saveData()
    return true
  } catch (error) {
    return false
  }
}

const deleteList = (listId: string) => {
  lists.value = lists.value.filter(list => list.id !== listId)
  saveData()
}

export const usePlantStore = () => {
  return {
    lists,
    collections,
    listsWithCount,
    collectionsWithCount,
    createList,
    updateListTitle,
    addItemToList,
    deleteItemFromList,
    addCollectionToList,
    createCollection,
    addItemToCollection,
    deleteItemFromCollection,
    updateCollectionName,
    exportData,
    importData,
    deleteList,
  }
}
