// src/types/Roles.ts

// Definir el tipo Permission
export type Permission = 'Ver' | 'Crear' | 'Editar' | 'Borrar' | 'Restaurar';

// Definir el tipo Role
export type Role = {
  [key in Permission]: boolean;
};

// Definir los roles y sus permisos
export const roles: Record<string, Role> = {
  'Administrador': {
    Ver: true,
    Crear: true,
    Editar: false,
    Borrar: true,
    Restaurar: true,
  },
  'Administrador Empresarial': {
    Ver: true,
    Crear: true,
    Editar: true,
    Borrar: true,
    Restaurar: true,
  },
  'Jefe de Departamento': {
    Ver: true,
    Crear: true,
    Editar: true,
    Borrar: true,
    Restaurar: true,
  },
  'Subjefe de Departamento': {
    Ver: true,
    Crear: false,
    Editar: true,
    Borrar: true,
    Restaurar: true,
  },
  'Colaborador': {
    Ver: true,
    Crear: false,
    Editar: false,
    Borrar: true,
    Restaurar: true,
  },
};

// Definir las rutas restringidas para cada rol
export const restrictedRoutes: Record<string, string[]> = {
  'Administrador Empresarial': [
    '/audits-a', 
    '/errors-a', 
    '/companies-a'
  ],
  'Jefe de Departamento': [
    '/departments-u',
    '/audits-a', 
    '/errors-a', 
    '/companies-a'
  ],
  'Subjefe de Departamento': [
    '/positions-u', 
    '/departments-u',
    '/audits-a', 
    '/errors-a', 
    '/companies-a',
    '/users-ua'
  ],
  'Colaborador': [
    '/inv-movements-ua', 
    '/positions-u', 
    '/departments-u',
    '/audits-a', 
    '/errors-a', 
    '/companies-a',
    '/users-ua'
  ],
};