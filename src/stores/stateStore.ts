import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { State } from '@/interfaces/State'
import {
  getStates,
  createState,
  updateState,
  deleteState,
  restoreState,
} from '@/services/stateService'

export const useStateStore = defineStore('state', () => {
  const states = ref<State[]>([])
  const loading = ref<boolean>(false)

  const fetchStates = async () => {
    loading.value = true
    try {
      states.value = await getStates()
    } catch (error) {
      console.error('Error fetching categories supplier:', error)
    } finally {
      loading.value = false
    }
  }

  const addState = async (name: string, idCompanyId: number) => {
    const newCategorySupplier = await createState(name, idCompanyId)
    states.value.push(newCategorySupplier)
  }

  const editState = async (id: number, name: string, idCompanyId: number) => {
    const updatedState = await updateState(id, name, idCompanyId)
    const index = states.value.findIndex((c) => c.id_state === id)
    if (index !== -1) states.value[index] = updatedState
  }

  const removeState = async (id: number) => {
    await deleteState(id)
    states.value = states.value.filter((c) => c.id_state !== id)
  }

  const restoreDeletedState = async (id: number) => {
    await restoreState(id)
    await fetchStates()
  }

  return {
    states,
    loading,
    fetchStates,
    addState,
    editState,
    removeState,
    restoreDeletedState,
  }
})
