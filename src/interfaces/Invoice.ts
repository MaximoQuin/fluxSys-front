// src/interfaces/Invoice.ts
export interface InvoiceProduct {
    id_inventory_product: number;
    name_product: string;
    quantity: number;
    unit_price: number;
  }
  
  export interface Invoice {
    id_invoice: number;
    name_invoice: string;
    amount_items_in_the_invoice: number;
    total_price_invoice: number;
    name_purchase_order: string;
    name_supplier: string;
    name_department: string;
    name_module: string;
    name_company: string;
    date_insert: string;
    date_update: string | null;
    date_delete: string | null;
    date_restore: string | null;
    delete_log_invoices: boolean;
    products: InvoiceProduct[];
  }