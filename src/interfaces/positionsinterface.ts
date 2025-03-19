
export interface Position {
  Id_position: number;
  Name_position: string;
  Name_company: string;
  Delete_log_position: boolean;
}

export interface PositionCreate {
  Name_position: string;
  Id_company_Id: number;
}

export interface PositionUpdate {
  Name_position: string;
  Id_company_Id: number;
}
