// src/services/companyService.ts
import type { State } from '@/interfaces/State'
import { genericRequest } from '@/utils/httpUtils'

const API_URL = 'https://localhost:7002/api/States'

export async function getStates(): Promise<State[]> {
  return genericRequest<State[]>('get', `${API_URL}/get-states`)
}

export async function createState(name: string, idCompanyId: number): Promise<State> {
  return genericRequest<State>('post', `${API_URL}/create-state`, {
    name_state: name,
    id_company_Id: idCompanyId,
  })
}

export async function updateState(id: number, name: string, idCompanyId: number): Promise<State> {
  return genericRequest<State>('put', `${API_URL}/update-state/${id}`, {
    name_state: name,
    id_company_Id: idCompanyId,
  })
}

export async function deleteState(id: number): Promise<void> {
  return genericRequest<void>('delete', `${API_URL}/delete-state/${id}`)
}

export async function restoreState(id: number): Promise<void> {
  return genericRequest<void>('patch', `${API_URL}/restore-state/${id}`)
}
