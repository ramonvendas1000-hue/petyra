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

/** UI projection only; SQL/API must verify the actual membership for every operation. */
export function canWithMembership(
  membership: {
    organizationId: string;
    active: boolean;
    role: BusinessRole;
    customPermissions?: readonly PermissionKey[];
    permissionOverrides?: Partial<Record<PermissionKey, boolean>>;
  },
  organizationId: string,
  permission: PermissionKey,
): boolean {
  if (!membership.active || membership.organizationId !== organizationId) return false;
  if (membership.role === 'owner') return true;
  const override = membership.permissionOverrides?.[permission];
  if (override !== undefined) return override;
  return membership.customPermissions?.includes(permission) === true || can(membership.role, permission);
}
