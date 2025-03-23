// src/interfaces/Supplier.ts
export interface SupplierProduct {
    id_inventory_product_Id: number;
    name_product: string;
    suggested_price: number;
  }
  
  export interface Supplier {
    id_supplier: number;
    name_supplier: string;
    mail_supplier: string;
    phone_supplier: number;
    name_category_supplier: string;
    name_module: string;
    name_company: string;
    date_insert: string;
    date_update: string | null;
    date_delete: string | null;
    date_restore: string | null;
    delete_log_suppliers: boolean;
    products_from_supplier: number;
    products: SupplierProduct[];
  }