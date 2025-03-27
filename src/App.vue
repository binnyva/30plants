<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow">
      <div class="container mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-xl font-bold text-green-600">
                30 Plants
              </router-link>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                to="/lists"
                class="inline-flex items-center px-1 pt-1 border-b-2"
                :class="[$route.path.startsWith('/lists') ? 'border-green-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
              >
                Weeks
              </router-link>
              <router-link
                to="/collections"
                class="inline-flex items-center px-1 pt-1 border-b-2"
                :class="[$route.path.startsWith('/collections') ? 'border-green-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
              >
                Collections
              </router-link>
              <router-link
                to="/settings"
                class="inline-flex items-center px-1 pt-1 border-b-2"
                :class="[$route.path === '/settings' ? 'border-green-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
              >
                Settings
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { DEFAULT_APP_TITLE } from '@/modules/common/config'

export default defineComponent({
  watch: {
    $route: {
      handler() {
        this.setTitle()
      },
      immediate: true,
    },
  },
  methods: {
    setTitle() {
      document.title = `${DEFAULT_APP_TITLE} > ${String(this.$route.name)}`
    },
  },
})
</script>
