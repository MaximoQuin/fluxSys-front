// src/interfaces/InventoryProduct.ts
export interface InventoryProduct {
    id_inventory_product: number;
    name_product: string;
    stock_product: number;
    price_product: number;
    name_category_product: string;
    name_state: string;
    name_movement_type: string;
    name_supplier: string;
    name_department: string;
    name_module: string;
    name_company: string;
    name_user: string;
    date_insert: string;
    date_update: string | null;
    date_delete: string | null;
    date_restore: string | null;
    delete_log_inventory: boolean;
    suppliers: any[]; // Puedes definir una interfaz más específica si es necesario
    invoices: any[];
    purchaseOrders: any[];
  }

export interface Supplier {
    id_supplier: number;
    name_supplier: string;
  }