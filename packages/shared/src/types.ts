export type AccountMode = 'tutor' | 'business';

export type BusinessRole =
  | 'owner'
  | 'manager'
  | 'reception'
  | 'groomer'
  | 'veterinarian'
  | 'custom';

export type PermissionKey =
  | 'dashboard.view'
  | 'appointments.read'
  | 'appointments.write'
  | 'clients.read'
  | 'clients.write'
  | 'pets.read'
  | 'pets.write'
  | 'photos.write'
  | 'petstyle.read'
  | 'petstyle.write'
  | 'store.read'
  | 'store.write'
  | 'finance.read'
  | 'finance.write'
  | 'team.manage'
  | 'reports.read';

export type AppointmentStage =
  | 'scheduled'
  | 'checked_in'
  | 'bathing'
  | 'drying'
  | 'grooming'
  | 'finishing'
  | 'ready'
  | 'completed'
  | 'cancelled';
