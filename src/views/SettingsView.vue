<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">
      Settings
    </h1>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">
        Data Management
      </h2>

      <div class="space-y-4">
        <div>
          <h3 class="text-md font-medium mb-2">
            Export Data
          </h3>
          <div class="flex gap-2">
            <button
              class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              @click="exportData"
            >
              Export to JSON
            </button>
            <button
              class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              @click="copyToClipboard"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>

        <div>
          <h3 class="text-md font-medium mb-2">
            Import Data
          </h3>
          <div class="flex gap-2">
            <input
              ref="fileInput"
              type="file"
              accept=".json"
              class="hidden"
              @change="handleFileImport"
            >
            <button
              class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              @click="triggerFileInput"
            >
              Import from File
            </button>
            <div class="flex-1">
              <input
                v-model="importData"
                placeholder="Paste JSON data here"
                class="w-full p-2 border rounded"
              >
            </div>
            <button
              class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              @click="importFromText"
            >
              Import
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePlantStore } from '../store/plantStore'

const store = usePlantStore()
const importData = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const exportData = () => {
  const data = store.exportData()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'plant-tracker-data.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const copyToClipboard = () => {
  const data = store.exportData()
  navigator.clipboard.writeText(data)
  // eslint-disable-next-line no-alert
  alert('Data copied to clipboard!')
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const importFromText = () => {
  if (importData.value.trim()) {
    const success = store.importData(importData.value.trim())
    if (success) {
      // eslint-disable-next-line no-alert
      alert('Data imported successfully!')
      importData.value = ''
    } else {
      // eslint-disable-next-line no-alert
      alert('Failed to import data. Please check the JSON format.')
    }
  }
}

const handleFileImport = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      importData.value = content
      importFromText()
    }
    reader.readAsText(file)
  }
}
</script>
