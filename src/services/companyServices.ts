import axios from "axios";
import type { Company } from "@/interfaces/Company";

const API_URL = "https://localhost:7002/api/Companies";

export const getCompanies = async (): Promise<Company[]> => {
  const response = await axios.get<Company[]>(`${API_URL}/get-companies`);
  return response.data;
};

export const createCompany = async (name: string): Promise<Company> => {
  const response = await axios.post<Company>(`${API_URL}/create-company`, { name_company: name });
  return response.data;
};

export const updateCompany = async (id: number, name: string): Promise<Company> => {
  const response = await axios.put<Company>(`${API_URL}/update-company/${id}`, { name_company: name });
  return response.data;
};

export const deleteCompany = async (id: number): Promise<void> => {
  await axios.put(`${API_URL}/delete-company/${id}`);
};

export const restoreCompany = async (id: number): Promise<void> => {
  await axios.patch(`${API_URL}/restore-company/${id}`);
};
