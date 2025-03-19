import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getClasifications, createClasification, updateClasification, deleteClasification,restoreClasification} from '@/services/clasificationService'
import type { Clasifications_movements } from '@/interfaces/Clasification'

export const useClasificationMovementStore = defineStore('Clasifications_movements', () => {
  const clasifications_movements = ref<Clasifications_movements[]>([])
  const loading = ref<boolean>(false)

  const fetchClasificationsMovements= async () => {
    loading.value = true
    try {
        clasifications_movements.value = await getClasifications()
    } catch (error) {
      console.error('Error fetching clasifications movements:', error)
    } finally {
      loading.value = false
    }
  }

  const addClasificationMovement = async (name_clasification_movement: string) => {
    const newClasificationMovement = await createClasification(name_clasification_movement)
    clasifications_movements.value.push(newClasificationMovement)
  }

  const editClasificationMovement = async (id: number, name: string) => {
    const updatedClasificationMovement = await updateClasification(id,name)
    const index = clasifications_movements.value.findIndex((c) => c.id_clasification_movements === id)
    if (index !== -1) clasifications_movements.value[index] = updatedClasificationMovement
  }

  const removeClasificationMovement = async (id: number) => {
    await deleteClasification(id)
    clasifications_movements.value = clasifications_movements.value.filter(
      (c) => c.id_clasification_movements !== id,
    )
  }

  const restoreDeletedClasificationMovement = async (id: number) => {
    await restoreClasification(id)
    await fetchClasificationsMovements()
  }

  return {
    clasifications_movements,
    fetchClasificationsMovements,
    addClasificationMovement,
    editClasificationMovement,
    removeClasificationMovement,
    restoreDeletedClasificationMovement,
  }
})
