export interface Category {
  id_category_purchase_order: number;
  name_category_purchase_order: string;
  name_company: string;
  delete_log_category_purchase_order: boolean;
}

export interface CategoryCreate {
  // Al crear una categoría, se requiere el nombre y la identificación de la compañía
  name_category_purchase_order: string;
  id_company_Id: number;
}

export interface CategoryUpdate {
  // Se incluye el ID para identificar qué categoría actualizar.
  id_category_purchase_order: number;
  name_category_purchase_order: string;
  id_company_Id: number;
}
