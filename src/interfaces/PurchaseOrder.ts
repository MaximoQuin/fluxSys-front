// src/interfaces/PurchaseOrder.ts
export interface PurchaseOrderProduct {
    id_inventory_product: number;
    name_product: string;
    quantity: number;
    price: number;
  }
  
  export interface PurchaseOrder {
    id_purchase_order: number;
    name_purchase_order: string;
    amount_items_in_the_order: number;
    total_price_products: number;
    name_user: string;
    name_category_purchase_order: string;
    name_department: string;
    name_supplier: string;
    name_state: string;
    name_movement_type: string;
    name_module: string;
    name_company: string;
    date_insert: string;
    date_update: string | null;
    date_delete: string | null;
    date_restore: string | null;
    delete_log_purchase_orders: boolean;
    products: PurchaseOrderProduct[];
  }