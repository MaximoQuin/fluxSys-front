// src/interfaces/MovementType.ts
export interface MovementType {
  id_movement_type: number;
  name_movement_type: string;
  name_company: string;
  name_clasification_movement: string;
  delete_log_movement_type: boolean;
}

// src/interfaces/ClasificationMovement.ts
export interface ClasificationMovement {
  id_clasification_movement: number;
  name_clasification_movement: string;
  delete_log_clasification_movement: boolean;
}