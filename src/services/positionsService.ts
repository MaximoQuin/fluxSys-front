import { genericRequest } from '@/utils/httpUtils';
import type { Position, PositionCreate, PositionUpdate } from '@/interfaces/positionsinterface';

const API_URL_POSITIONS = "http://localhost:5076/api/Positions";

// Función para obtener los encabezados de autenticación
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No se encontró el token de autenticación.");
    throw new Error("Token de autenticación no disponible.");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

// Función para obtener las posiciones
export async function getPositions(): Promise<Position[]> {
  try {
    return await genericRequest<Position[]>('get', `${API_URL_POSITIONS}/get-positions`, {}, getAuthHeaders());
  } catch (error) {
    console.error("Error al obtener posiciones:", error);
    throw error;
  }
}

// Función para crear una posición
export async function createPosition(positionData: PositionCreate): Promise<Position> {
  try {
    return await genericRequest<Position>('post', `${API_URL_POSITIONS}/create-position`, positionData, getAuthHeaders());
  } catch (error) {
    console.error("Error al crear posición:", error);
    throw error;
  }
}

// Función para actualizar una posición
export async function updatePosition(id: number, positionData: PositionUpdate): Promise<Position> {
  try {
    return await genericRequest<Position>('put', `${API_URL_POSITIONS}/update-position/${id}`, positionData, getAuthHeaders());
  } catch (error) {
    console.error("Error al actualizar posición:", error);
    throw error;
  }
}

// Función para eliminar una posición (soft delete)
export async function deletePosition(id: number): Promise<void> {
  try {
    return await genericRequest<void>('delete', `${API_URL_POSITIONS}/delete-position/${id}`, {}, getAuthHeaders());
  } catch (error) {
    console.error("Error al eliminar posición:", error);
    throw error;
  }
}

// Función para restaurar una posición
export async function restorePosition(id: number): Promise<void> {
  try {
    return await genericRequest<void>('patch', `${API_URL_POSITIONS}/restore-position/${id}`, {}, getAuthHeaders());
  } catch (error) {
    console.error("Error al restaurar posición:", error);
    throw error;
  }
}

const positionsService = {
  getPositions,
  createPosition,
  updatePosition,
  deletePosition,
  restorePosition,
};

export default positionsService;
