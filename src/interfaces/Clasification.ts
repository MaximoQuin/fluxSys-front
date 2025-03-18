export interface Clasifications_movements{
    id_clasification_movement:number
    name_clasification_movement:string
    delete_log_clasification_movement: boolean
}

export interface MovementTypes{
    id_movement_type:number,
    name_movement_type:string,
    name_company:string,
    name_clasification_movement:string,
    delete_log_movement_type: boolean;
}