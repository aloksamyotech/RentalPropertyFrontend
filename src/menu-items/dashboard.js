// assets
import {
  IconHome,
  IconCalendarEvent,
  IconMail,
  IconFileUpload,
  IconFileInvoice,
  IconPhoneCall,
  IconAntennaBars5,
  IconChecklist,
  IconNotebook,
  IconPhoneCheck,
  IconUsers,
} from '@tabler/icons';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import PersonIcon from '@mui/icons-material/Person';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import PaymentIcon from '@mui/icons-material/Payment';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import Person2Icon from '@mui/icons-material/Person2';
import TaskIcon from '@mui/icons-material/Task';
import { tokenPayload } from 'helper';

// constant
const icons = {
  IconHome,
  IconCalendarEvent,
  IconMail,
  IconFileUpload,
  IconFileInvoice,
  IconPhoneCall,
  IconAntennaBars5,
  IconChecklist,
  IconNotebook,
  IconPhoneCheck,
  IconUsers
};

// ==============================|| DASHBOARD MENU ITEMS FOR ROLES ||============================== //

// Superadmin Dashboard
const superAdminDashboard = {
  title: 'Superadmin Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconHome,
      breadcrumbs: false,
    },
    {
      id: '1',
      title: 'Company Management',
      type: 'item',
      url: '/dashboard/company',
      icon: icons.IconFileInvoice,
      breadcrumbs: false,
    },
  ],
};

// Company Admin Dashboard
const companyAdminDashboard = {
  title: 'Company Admin Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconHome,
      breadcrumbs: false,
    },
    {
      id: '1',
      title: 'Landlord Management',
      type: 'item',
      url: '/dashboard/owner',
      icon: PersonIcon,
      breadcrumbs: false,
    },
    {
      id: '2',
      title: 'Property Management',
      type: 'item',
      url: '/dashboard/property',
      icon: AddHomeWorkIcon,
      breadcrumbs: false,
    },
    {
      id: '5',
      title: 'Agents',
      type: 'item',
      url: '/dashboard/agents',
      icon: Person2Icon,
      breadcrumbs: false,
    },
    {
      id: '6',
      title: 'Tenant Management',
      type: 'item',
      url: '/dashboard/tenents',
      icon: Person2Icon,
      breadcrumbs: false
    },
    {
      id: '7',
      title: 'Booking Management',
      type: 'item',
      url: '/dashboard/booking',
      icon: Person2Icon,
      breadcrumbs: false
    },
  ],
};

// Agent Dashboard
const agentDashboard = {
  title: 'Agent Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconHome,
      breadcrumbs: false,
    },
    {
      id: '1',
      title: 'Vacant Notice',
      type: 'item',
      url: '/dashboard/vacantnotice',
      icon: CircleNotificationsIcon,
      breadcrumbs: false,
    },
    {
      id: '2',
      title: 'Tenants Management',
      type: 'item',
      url: '/dashboard/tenents',
      icon: PersonIcon,
      breadcrumbs: false,
    },
    {
      id: '3',
      title: 'Agents',
      type: 'item',
      url: '/dashboard/agents',
      icon: Person2Icon,
      breadcrumbs: false,
    },
    {
      id: '4',
      title: 'Complaints',
      type: 'item',
      url: '/dashboard/complaints',
      icon: TaskIcon,
      breadcrumbs: false,
    },
    {
      id: '5',
      title: 'Booking Management',
      type: 'item',
      url: '/dashboard/booking',
      icon: Person2Icon,
      breadcrumbs: false
    },
  ],
};

// Tenant Dashboard
const tenantDashboard = {
  title: 'Tenant Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconHome,
      breadcrumbs: false,
    },
    {
      id: '1',
      title: 'Payments',
      type: 'item',
      url: '/dashboard/payment',
      icon: PaymentIcon,
      breadcrumbs: false,
    },
    {
      id: '2',
      title: 'Announcements',
      type: 'item',
      url: '/dashboard/announcement',
      icon: icons.IconMail,
      breadcrumbs: false,
    },
    {
      id: '3',
      title: 'Calendar',
      type: 'item',
      url: '/dashboard/calendar',
      icon: icons.IconCalendarEvent,
      breadcrumbs: false,
    },
    {
      id: '4',
      title: 'Documents',
      type: 'item',
      url: '/dashboard/document',
      icon: icons.IconFileUpload,
      breadcrumbs: false,
    },
  ],
};

const payload = tokenPayload();
const role = payload?.role || '';

let dashboardMenu;

switch (role) {
  case 'admin':
    dashboardMenu = superAdminDashboard;
    break;
  case 'companyAdmin':
    dashboardMenu = companyAdminDashboard;
    break;
  case 'agent':
    dashboardMenu = agentDashboard;
    break;
  case 'tenant':
    dashboardMenu = tenantDashboard;
    break;
  default:
    dashboardMenu = { title: 'No Access', type: 'group', children: [] };
}

export default dashboardMenu;
