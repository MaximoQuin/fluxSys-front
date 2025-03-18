import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CategorySupplier } from '@/interfaces/CategorySupplier'
import {
  getCategoriesSupplier,
  createCategorySupplier,
  updateCategorySupplier,
  deleteCategorySupplier,
  restoreCategorySupplier,
} from '@/services/categoriesSuppliersService'

export const useCategorySupplierStore = defineStore('categorySupplier', () => {
  const categoriesSupplier = ref<CategorySupplier[]>([])
  const loading = ref<boolean>(false)

  const fetchCategoriesSupplier = async () => {
    loading.value = true
    try {
      categoriesSupplier.value = await getCategoriesSupplier()
    } catch (error) {
      console.error('Error fetching categories supplier:', error)
    } finally {
      loading.value = false
    }
  }

  const addCategorySupplier = async (name: string, idCompanyId: number) => {
    const newCategorySupplier = await createCategorySupplier(name, idCompanyId)
    categoriesSupplier.value.push(newCategorySupplier)
  }

  const editCategorySupplier = async (id: number, name: string, idCompanyId: number) => {
    const updatedCategorySupplier = await updateCategorySupplier(id, name, idCompanyId)
    const index = categoriesSupplier.value.findIndex((c) => c.id_category_supplier === id)
    if (index !== -1) categoriesSupplier.value[index] = updatedCategorySupplier
  }

  const removeCategorySupplier = async (id: number) => {
    await deleteCategorySupplier(id)
    categoriesSupplier.value = categoriesSupplier.value.filter((c) => c.id_category_supplier !== id)
  }

  const restoreDeletedCategorySupplier = async (id: number) => {
    await restoreCategorySupplier(id)
    await fetchCategoriesSupplier()
  }

  return {
    categoriesSupplier,
    loading,
    fetchCategoriesSupplier,
    addCategorySupplier,
    editCategorySupplier,
    removeCategorySupplier,
    restoreDeletedCategorySupplier,
  }
})
