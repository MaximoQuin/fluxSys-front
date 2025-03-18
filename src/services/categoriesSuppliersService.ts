// src/services/companyService.ts
import type { CategorySupplier } from '@/interfaces/CategorySupplier'
import { genericRequest } from '@/utils/httpUtils'

const API_URL = 'https://localhost:7002/api/CategoriesSuppliers'

export async function getCategoriesSupplier(): Promise<CategorySupplier[]> {
  return genericRequest<CategorySupplier[]>('get', `${API_URL}/get-categories-suppliers`)
}

export async function createCategorySupplier(
  name: string,
  idCompanyId: number,
): Promise<CategorySupplier> {
  return genericRequest<CategorySupplier>('post', `${API_URL}/create-category-supplier`, {
    name_category_supplier: name,
    id_company_Id: idCompanyId,
  })
}

export async function updateCategorySupplier(
  id: number,
  name: string,
  idCompanyId: number,
): Promise<CategorySupplier> {
  return genericRequest<CategorySupplier>('put', `${API_URL}/update-category-supplier/${id}`, {
    name_category_supplier: name,
    id_company_Id: idCompanyId,
  })
}

export async function deleteCategorySupplier(id: number): Promise<void> {
  return genericRequest<void>('delete', `${API_URL}/delete-category-supplier/${id}`)
}

export async function restoreCategorySupplier(id: number): Promise<void> {
  return genericRequest<void>('patch', `${API_URL}/restore-category-supplier/${id}`)
}
