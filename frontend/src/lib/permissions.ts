// lib/permissions.ts
export const PERMISSIONS = {
    cliente: [
      { resource: 'reservas', actions: ['read', 'create', 'update'] },
      { resource: 'perfil', actions: ['read', 'update'] },
      { resource: 'dashboard-cliente', actions: ['read'] }
    ],
    arrendador: [
      { resource: '*', actions: ['*'] } // Acceso completo
    ]
  } as const;
  