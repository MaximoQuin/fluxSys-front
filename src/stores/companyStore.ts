import { defineStore } from "pinia";
import { ref } from "vue";
import type { Company } from "@/interfaces/Company";
import { getCompanies, createCompany, updateCompany, deleteCompany, restoreCompany } from "@/services/companyServices";

export const useCompanyStore = defineStore("company", () => {
  const companies = ref<Company[]>([]);
  const loading = ref<boolean>(false);

  const fetchCompanies = async () => {
    loading.value = true;
    try {
      companies.value = await getCompanies();
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      loading.value = false;
    }
  };

  const addCompany = async (name: string) => {
    const newCompany = await createCompany(name);
    companies.value.push(newCompany);
  };

  const editCompany = async (id: number, name: string) => {
    const updatedCompany = await updateCompany(id, name);
    const index = companies.value.findIndex(c => c.id_company === id);
    if (index !== -1) companies.value[index] = updatedCompany;
  };

  const removeCompany = async (id: number) => {
    await deleteCompany(id);
    companies.value = companies.value.filter(c => c.id_company !== id);
  };

  const restoreDeletedCompany = async (id: number) => {
    await restoreCompany(id);
    await fetchCompanies(); // Volver a cargar las compañías
  };

  return { companies, loading, fetchCompanies, addCompany, editCompany, removeCompany, restoreDeletedCompany };
});
