// src/interfaces/User.ts
export interface User {
    id_user: number;
    name_user: string;
    mail_user: string;
    phone_user: number;
    password: string;
    name_role: string;
    name_position: string;
    name_department: string;
    name_company: string;
    name_module: string;
    date_insert: string;
    date_update: string | null;
    date_delete: string | null;
    date_restore: string | null;
    delete_log_user: boolean;
  }