// src/interfaces/Audit.ts
export interface Audit {
    id_audit: number;
    date_insert: string;
    date_update: string;
    date_delete: string;
    date_restore: string;
    amount_modify: number;
    name_user: string;
    name_department: string;
    name_module: string;
    name_company: string;
  }