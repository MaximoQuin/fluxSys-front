export interface Department {
    Id_department: number;
    Name_deparment: string;
    Name_company: string;
    Delete_log_department: boolean;
  }
  
  export interface DepartmentCreate {
    Name_deparment: string;
    Id_company_Id: number;
  }
  
  export interface DepartmentUpdate {
    Name_deparment: string;
    Id_company_Id: number;
  }
  