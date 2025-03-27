import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import ListsView from '../views/ListsView.vue'
import CollectionsView from '../views/CollectionsView.vue'
import SettingsView from '../views/SettingsView.vue'
import PlantList from '../components/PlantList.vue'
import Collection from '../components/Collection.vue'
import { usePlantStore } from '../store/plantStore'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    beforeEnter: (to: Function, from: Function, next: Function) => {
      const store = usePlantStore()
      if (store.lists.value.length > 0) {
        next({ path: `/list/${store.lists.value[0].id}` })
      } else {
        next()
      }
    },
  },
  {
    path: '/lists',
    name: 'lists',
    component: ListsView,
  },
  {
    path: '/list/:id',
    name: 'list',
    component: PlantList,
    props: true,
  },
  {
    path: '/collections',
    name: 'collections',
    component: CollectionsView,
  },
  {
    path: '/collection/:id',
    name: 'collection',
    component: Collection,
    props: true,
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
