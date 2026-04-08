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

  // ── EVENTS ──────────────────────────────────────────────
  {
    label: 'Manage Events',
    icon: 'event',
    route: '/dashboard/events',
    roles: [Role.ADMIN, Role.TRAINER, Role.RH_SMARTEK, Role.RH_COMPANY]
  },
  {
    label: 'Events',
    icon: 'event_available',
    route: '/dashboard/events',
    roles: [Role.LEARNER, Role.SPONSOR]
  },

  // ── COURSES ─────────────────────────────────────────────
  {
    label: 'My Courses',
    icon: 'school',
    route: '/dashboard/my-courses',
    roles: [Role.LEARNER]
  },

  // ── EXAMS ───────────────────────────────────────────────
  {
    label: 'Manage Exams',
    icon: 'quiz',
    route: '/dashboard/exams',
    roles: [Role.RH_SMARTEK, Role.TRAINER, Role.ADMIN]
  },
  {
    label: 'My Exams',
    icon: 'assignment',
    route: '/dashboard/my-exams',
    roles: [Role.LEARNER]
  },

  // ── TRAINING ────────────────────────────────────────────
  {
    label: 'Formations',
    icon: 'fitness_center',
    route: '/dashboard/training',
    roles: [Role.TRAINER, Role.RH_SMARTEK, Role.ADMIN]
  },
  {
    label: 'My Training',
    icon: 'self_improvement',
    route: '/dashboard/my-training',
    roles: [Role.LEARNER]
  },

  // ── PLANNING ────────────────────────────────────────────
  {
    label: 'Planning',
    icon: 'calendar_month',
    route: '/dashboard/planning',
    permissions: [Permission.PLANNING_VIEW, Permission.PLANNING_VIEW_ALL]
  },

  // ── CERTIFICATIONS ──────────────────────────────────────
  {
    label: 'Certifications',
    icon: 'workspace_premium',
    route: '/dashboard/certifications',
    permissions: [Permission.CERTIFICATIONS_VIEW]
  },

  // ── USERS (ADMIN / RH_SMARTEK) ──────────────────────────
  {
    label: 'Users',
    icon: 'group',
    route: '/dashboard/users',
    permissions: [Permission.USERS_VIEW]
  },

  // ── COMPANIES ───────────────────────────────────────────
  {
    label: 'Companies',
    icon: 'business',
    route: '/dashboard/companies',
    permissions: [Permission.COMPANIES_VIEW]
  },

  // ── SPONSORS ────────────────────────────────────────────
  {
    label: 'Sponsors',
    icon: 'handshake',
    route: '/dashboard/sponsors',
    permissions: [Permission.SPONSORS_VIEW]
  },

  // ── CONTACTS ────────────────────────────────────────────
  {
    label: 'Contacts',
    icon: 'contacts',
    route: '/dashboard/contacts',
    permissions: [Permission.CONTACTS_VIEW]
  },

  // ── PROFILE ─────────────────────────────────────────────
  {
    label: 'Profile',
    icon: 'person',
    route: '/dashboard/profile',
    permissions: [Permission.PROFILE_VIEW]
  },

  // ── BACK TO WEBSITE ─────────────────────────────────────
  {
    label: 'Back to Website',
    icon: 'home',
    route: '/'
  }
];
