export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expirationDate: string;
}

export interface Role {
  id_role: number;
  name_role: string;
}

export interface Position {
  id_position: number;
  name_position: string;
}

export interface Department {
  id_department: number;
  name_department: string;
}

export interface Company {
  id_company: number;
  name_company: string;
}

export interface User {
  id_user: number;
  name_user: string;
  mail_user: string;
  phone_user: string;
  password_user: string;
  id_rol_Id: number;
  id_position_Id: number;
  id_department_Id: number;
  id_company_Id: number;
  id_module_Id: number;
  date_insert: string;
  date_update: string | null;
  date_delete: string | null;
  date_restore: string | null;
  delete_log_user: boolean;
  roles: Role | null; // Entidad relacionada
  positions: Position | null; // Entidad relacionada
  departments: Department | null; // Entidad relacionada
  companies: Company | null; // Entidad relacionada
}

export interface ValidateTokenResponse {
  user: User;
}
