import { Permission } from '../enums/permission.enum';
import { Role } from '../enums/role.enum';

export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  permissions?: Permission[];
  roles?: Role[];
  children?: MenuItem[];
  divider?: boolean;
  header?: string;
}

export const MENU_ITEMS: MenuItem[] = [
  // Events - ADMIN & TRAINER
  {
    label: 'Manage Events',
    icon: 'event',
    route: '/dashboard/events',
    roles: [Role.ADMIN, Role.TRAINER]
  },

  // Events - LEARNER
  {
    label: 'Events',
    icon: 'event_available',
    route: '/dashboard/events',
    roles: [Role.LEARNER]
  },

  // Profile - All users
  {
    label: 'Profile',
    icon: 'person',
    route: '/dashboard/profile',
    permissions: [Permission.PROFILE_VIEW]
  },

  // Back to Website - All users
  {
    label: 'Back to Website',
    icon: 'home',
    route: '/',
    permissions: []
  }
];
