import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getMovementsTypes,
  createMovementType,
  updateMovementType,
  deleteMovementType,
  restoreMovementType,
} from '@/services/movement_typeService'
import type { MovementTypes } from '@/interfaces/Clasification'
import { useCompanyStore } from '@/stores/companyStore'
import { useClasificationMovementStore } from './clasificationStore'

export const useMovementTypesStore = defineStore('MovementsTypes', () => {
  const MovementTypes = ref<MovementTypes[]>([])
  const loading = ref<boolean>(false)
  const company = useCompanyStore()
  const clasification = useClasificationMovementStore()

  const fetchMovementTypes = async () => {
    loading.value = true
    try {
      MovementTypes.value = await getMovementsTypes()
      await company.fetchCompanies()
      await clasification.fetchClasificationsMovements()
    } catch (error) {
      console.error('Error fetching MovementTypes movements:', error)
    } finally {
      loading.value = false
    }
  }

  const addMovementType = async (
    name: string,
    company_Id: number,
    clasification_movement_Id: number,
  ) => {
    const newMovementTypeMovement = await createMovementType(
      name,
      company_Id,
      clasification_movement_Id,
    )
    MovementTypes.value.push(newMovementTypeMovement)
  }

  const editMovementType = async (
    id: number,
    name: string,
    company_Id: number,
    clasification_movement_Id: number,
  ) => {
    const updatedMovementTypeMovement = await updateMovementType(
      id,
      name,
      company_Id,
      clasification_movement_Id,
    )
    const index = MovementTypes.value.findIndex((c) => c.id_movement_type === id)
    if (index !== -1) MovementTypes.value[index] = updatedMovementTypeMovement
  }

  const removeMovementType = async (id: number) => {
    await deleteMovementType(id)
    MovementTypes.value = MovementTypes.value.filter((c) => c.id_movement_type !== id)
  }

  const restoreDeletedMovementType = async (id: number) => {
    await restoreMovementType(id)
    await fetchMovementTypes()
  }

  return {
    MovementTypes,
    fetchMovementTypes,
    addMovementType,
    editMovementType,
    removeMovementType,
    restoreDeletedMovementType,
  }
})
