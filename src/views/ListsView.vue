<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">
        Weeks
      </h1>
      <button
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        @click="createNewList"
      >
        Create New Week
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="list in listsWithCount" :key="list.id" class="bg-white rounded-lg shadow p-4">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-lg font-semibold">
            {{ list.title }}
          </h2>
          <span class="text-sm text-gray-500">{{ list.itemCount }} items</span>
        </div>
        <router-link
          :to="{ name: 'list', params: { id: list.id } }"
          class="text-green-600 hover:text-green-700"
        >
          View Week →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { endOfWeek, format, getWeek, startOfWeek } from 'date-fns'
import { usePlantStore } from '../store/plantStore'

const store = usePlantStore()
const listsWithCount = store.listsWithCount

const createNewList = () => {
  const now = new Date()
  const year = format(now, 'yyyy')
  const week = getWeek(now)
  const month = format(now, 'MMMM')
  const startDate = startOfWeek(now)
  const endDate = endOfWeek(now)

  const title = `${year} W${week} ${month} ${format(startDate, 'd')}-${format(endDate, 'd')}`
  store.createList(title)
}
</script>
