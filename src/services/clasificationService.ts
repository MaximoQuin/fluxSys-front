import { genericRequest } from '@/utils/httpUtils'
import type { Clasifications_movements } from '@/interfaces/Clasification'

const API_URL = 'https://localhost:7002/api/ClasificationMovements'

export async function getClasifications(): Promise<Clasifications_movements[]> {
  return genericRequest<Clasifications_movements[]>('get', `${API_URL}/get-clasification-movements`)
}
export async function createClasification(name: string): Promise<Clasifications_movements> {
  return genericRequest<Clasifications_movements>('post', `${API_URL}/create-clasification-movement`, { name_clasification_movement: name,})
}
export async function updateClasification(id: number,name: string,): Promise<Clasifications_movements> {
  return genericRequest<Clasifications_movements>('post', `${API_URL}/update-clasification-movement/${id}`, {name_clasification_movement: name,})
}
export async function deleteClasification(id:number):Promise<void>{
return genericRequest<void>('delete',`${API_URL}/delete-clasification-movement${id}`)
}

export async function restoreClasification(id: number): Promise<void> {
  return genericRequest<void>("patch", `${API_URL}/restore-clasification-movement/${id}`);
}