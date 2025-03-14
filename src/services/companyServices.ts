import axios from "axios";
import type { Company } from "@/interfaces/Company";
import { useAuthStore } from "@/stores/authStore"; // Importa el store de autenticación

const API_URL = "https://localhost:7002/api/Companies";

// Crea una instancia de axios
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar el token a cada solicitud
api.interceptors.request.use((config) => {
  const authStore = useAuthStore(); // Obtén el store de autenticación
  const token = authStore.token; // Obtén el token del store

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Agrega el token al header
  }

  return config;
});

export const getCompanies = async (): Promise<Company[]> => {
  const response = await api.get<Company[]>("/get-companies");
  return response.data;
};

export const createCompany = async (name: string): Promise<Company> => {
  const response = await api.post<Company>("/create-company", { name_company: name });
  return response.data;
};

export const updateCompany = async (id: number, name: string): Promise<Company> => {
  const response = await api.put<Company>(`/update-company/${id}`, { name_company: name });
  return response.data;
};

export const deleteCompany = async (id: number): Promise<void> => {
  await api.delete(`/delete-company/${id}`);
};

export const restoreCompany = async (id: number): Promise<void> => {
  await api.patch(`/restore-company/${id}`);
};
