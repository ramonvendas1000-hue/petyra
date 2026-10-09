import type { BusinessRole, PermissionKey } from './types';

const all: PermissionKey[] = [
  'dashboard.view','appointments.read','appointments.write','clients.read','clients.write',
  'pets.read','pets.write','photos.write','petstyle.read','petstyle.write','store.read',
  'store.write','finance.read','finance.write','team.manage','reports.read'
];

export const defaultPermissions: Record<BusinessRole, PermissionKey[]> = {
  owner: all,
  manager: all.filter((p) => p !== 'team.manage'),
  reception: [
    'dashboard.view','appointments.read','appointments.write','clients.read','clients.write',
    'pets.read','pets.write','store.read','finance.read'
  ],
  groomer: [
    'appointments.read','pets.read','photos.write','petstyle.read','petstyle.write'
  ],
  veterinarian: [
    'appointments.read','pets.read','pets.write','photos.write'
  ],
  custom: [],
};

export function can(role: BusinessRole, permission: PermissionKey) {
  return defaultPermissions[role].includes(permission);
}
