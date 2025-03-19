import { genericRequest } from '@/utils/httpUtils'
import type { MovementTypes } from '@/interfaces/Clasification'

const API_URL = 'https://localhost:7002/api/MovementsTypes'

export async function getMovementsTypes(): Promise<MovementTypes[]> {
  return genericRequest<MovementTypes[]>('get', `${API_URL}/get-movements-types`)
}

export async function createMovementType(name: string,company_Id: number,clasification_movement_Id: number): Promise<MovementTypes> {
  return genericRequest<MovementTypes>('post', `${API_URL}/create-movement-type`, {name_movement_type: name, id_company_Id: company_Id, id_clasification_movement_Id: clasification_movement_Id})
}

export async function updateMovementType(id: number,name: string, company_Id:number, clasification_movement_Id:number): Promise<MovementTypes> {
  return genericRequest<MovementTypes>('put', `${API_URL}/update-movement-type/${id}`, {name_movement_type: name, id_company_Id: company_Id, id_clasification_movement_Id: clasification_movement_Id})
}

export async function deleteMovementType(id:number):Promise<void>{
return genericRequest<void>('delete',`${API_URL}/delete-movement-type/${id}`)
}

export async function restoreMovementType(id: number): Promise<void> {
  return genericRequest<void>("patch", `${API_URL}/restore-movement-type/${id}`);
}