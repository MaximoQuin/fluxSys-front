// src/interfaces/InventoryMovement.ts
export interface InventoryMovement {
    id_inventory_movement: number;
    amount_modify: number;
    name_product: string;
    name_category_product: string;
    name_department: string;
    name_supplier: string;
    name_movement_type: string;
    name_module: string;
    name_company: string;
    name_user: string;
    date_insert: string;
    date_update: string;
    date_delete: string;
    date_restore: string;
  }