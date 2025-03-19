import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCategoriesProducts, createCategoryProduct, updateCategoryProduct, deleteCategoryProduct, restoreCategoryProduct,} from '@/services/productService'
import type { CategoryProduct } from '@/interfaces/Product'
import {useCompanyStore} from '@/stores/companyStore'

export const useCategoryProductStore = defineStore('CategoryProduct', () => {
  const categories_products = ref<CategoryProduct[]>([])
  const loading = ref<boolean>(false)
  const companyStore = useCompanyStore()

  const fetchCategoriesProducts = async () => {
    loading.value = true
    try {
      categories_products.value = await getCategoriesProducts()
        await companyStore.fetchCompanies()
    } catch (error) {
      console.error('Error fetching categories products:', error)
    } finally {
      loading.value = false
    }
  }

  const addCategoryProduct = async (name: string,company:number) => {
    const newCategoryProduct = await createCategoryProduct(name,company)
    categories_products.value.push(newCategoryProduct)
  }

  const editCategoryProduct = async (id: number, name: string, company:number) => {
    const updatedCategory_product = await updateCategoryProduct(id,name,company)
    const index = categories_products.value.findIndex((c) => c.id_category_product === id)
    if (index !== -1) categories_products.value[index] = updatedCategory_product
  }

  const removeCategoryProduct = async (id: number) => {
    await deleteCategoryProduct(id)
    categories_products.value = categories_products.value.filter(c => c.id_category_product !== id,)
  }


  const restoreDeletedCategoryProduct = async (id: number) => {
    await restoreCategoryProduct(id)
    await fetchCategoriesProducts()
  }

  return {
    categories_products,
    fetchCategoriesProducts,
    addCategoryProduct,
    editCategoryProduct,
    removeCategoryProduct,
    restoreDeletedCategoryProduct
  }
})
