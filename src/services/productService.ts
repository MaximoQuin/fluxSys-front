import type { CategoryProduct } from '@/interfaces/Product'
import { genericRequest } from '@/utils/httpUtils' // Importa la función genérica

const API_URL = 'https://localhost:7002/api/CategoriesProducts'

export async function getCategoriesProducts(): Promise<CategoryProduct[]> {
  return genericRequest<CategoryProduct[]>('get', `${API_URL}/get-categories-products`)
}

export async function createCategoryProduct(name:string, company: number): Promise<CategoryProduct> {
  return genericRequest<CategoryProduct>('post', `${API_URL}/create-category-product`, {name_category_product: name,id_company_Id: company,})
}

export async function updateCategoryProduct(id:number,name: string,company: number): Promise<CategoryProduct> {
  return genericRequest<CategoryProduct>('put', `${API_URL}/update-category-product/${id}`, {name_category_product: name, id_company_Id:company})
}

export async function deleteCategoryProduct(id: number): Promise<void> {
  return genericRequest<void>('delete', `${API_URL}/delete-category-product/${id}`)
}

export async function restoreCategoryProduct(id: number): Promise<void> {
  return genericRequest<void>('patch', `${API_URL}/restore-category-product/${id}`)
}
