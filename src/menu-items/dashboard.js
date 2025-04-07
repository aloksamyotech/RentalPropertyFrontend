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
  IconUsers
} from '@tabler/icons';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import PersonIcon from '@mui/icons-material/Person';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import Person2Icon from '@mui/icons-material/Person2';
import TaskIcon from '@mui/icons-material/Task';
import { tokenPayload } from 'helper';
import AddHomeIcon from '@mui/icons-material/AddHome';
import BookIcon from '@mui/icons-material/Book';
import CommentBankIcon from '@mui/icons-material/CommentBank';
import PaymentIcon from '@mui/icons-material/Payment';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import HomeIcon from '@mui/icons-material/Home';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import i18n from 'i18n';
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
  title: i18n.t('Superadmin Dashboard'),
  type: 'group',
  children: [
    {
      id: 'default',
      title: i18n.t('Dashboard'),
      type: 'item',
      url: '/dashboard/SADashboard',
      icon: HomeIcon,
      breadcrumbs: false
    },
    {
      id: '1',
      title: i18n.t('Company Management'),
      type: 'item',
      url: '/dashboard/company',
      icon: icons.IconFileInvoice,
      breadcrumbs: false
    }
  ]
};

// Company Admin Dashboard
const companyAdminDashboard = {
  title: i18n.t('Company Admin Dashboard'),
  type: 'group',
  children: [
    {
      id: 'default',
      title: i18n.t('Dashboard'),
      type: 'item',
      url: '/dashboard/default',
      icon: HomeIcon,
      breadcrumbs: false
    },
    {
      id: '1',
      title: i18n.t('Property Types'),
      type: 'item',
      url: '/dashboard/propertyTypes',
      icon: AddHomeIcon,
      breadcrumbs: false
    },
    {
      id: '2',
      title: i18n.t('Landlord Management'),
      type: 'item',
      url: '/dashboard/owner',
      icon: PersonIcon,
      breadcrumbs: false
    },
    {
      id: '3',
      title: i18n.t('Property Management'),
      type: 'item',
      url: '/dashboard/property',
      icon: AddHomeWorkIcon,
      breadcrumbs: false
    },
    {
      id: '4',
      title: i18n.t('agents'),
      type: 'item',
      url: '/dashboard/agents',
      icon: Person2Icon,
      breadcrumbs: false
    },
    {
      id: '5',
      title: i18n.t('Tenant Management'),
      type: 'item',
      url: '/dashboard/tenents',
      icon: Person2Icon,
      breadcrumbs: false
    },
    {
      id: '6',
      title: i18n.t('Booking Management'),
      type: 'item',
      url: '/dashboard/booking',
      icon: BookIcon,
      breadcrumbs: false
    },
    {
      id: '7',
      title: i18n.t('Complaint Management'),
      type: 'item',
      url: '/dashboard/companyComplaints',
      icon: CommentBankIcon,
      breadcrumbs: false
    },
    {
      id: '8',
      title: i18n.t('Bill Management'),
      type: 'item',
      url: '/dashboard/billC',
      icon: PaymentIcon,
      breadcrumbs: false
    },
    {
      id: '9',
      title: i18n.t('Service Provider'),
      type: 'item',
      url: '/dashboard/serviceprovider',
      icon: HomeRepairServiceIcon,
      breadcrumbs: false
    },
    {
      id: '10',
      title: i18n.t('Announcements'),
      type: 'item',
      url: '/dashboard/announcement',
      icon: AnnouncementIcon,
      breadcrumbs: false
    },
    {
      id: '11',
      title: i18n.t('Company Profile'),
      type: 'item',
      url: '/dashboard/profile',
      icon: ContactPageIcon,
      breadcrumbs: false
    },
  ]
};

// Agent Dashboard
const agentDashboard = {
  title: i18n.t('Agent Dashboard'),
  type: 'group',
  children: [
    {
      id: 'default',
      title: i18n.t('Dashboard'),
      type: 'item',
      url: '/dashboard/ADashboard',
      icon: HomeIcon,
      breadcrumbs: false
    },
    {
      id: '2',
      title: i18n.t('Tenants Management'),
      type: 'item',
      url: '/dashboard/tenents',
      icon: PersonIcon,
      breadcrumbs: false
    },
    {
      id: '3',
      title: i18n.t('Property Management'),
      type: 'item',
      url: '/dashboard/property',
      icon: AddHomeWorkIcon,
      breadcrumbs: false,
    },
    {
      id: '4',
      title: i18n.t('Complaints'),
      type: 'item',
      url: '/dashboard/complaints',
      icon: CommentBankIcon,
      breadcrumbs: false
    },
    {
      id: '5',
      title: i18n.t('Booking Management'),
      type: 'item',
      url: '/dashboard/booking',
      icon: Person2Icon,
      breadcrumbs: false
    },
    {
      id: '6',
      title: i18n.t('Bill Management'),
      type: 'item',
      url: '/dashboard/billA',
      icon: PaymentIcon,
      breadcrumbs: false
    },
    {
      id: '7',
      title: i18n.t('Vacant Properties'),
      type: 'item',
      url: '/dashboard/vacantproperty',
      icon: icons.IconFileUpload,
      breadcrumbs: false
    },
    {
      id: '8',
      title: i18n.t('Service Provider'),
      type: 'item',
      url: '/dashboard/serviceprovider',
      icon: HomeRepairServiceIcon,
      breadcrumbs: false
    },
    {
      id: '9',
      title: i18n.t('Announcements'),
      type: 'item',
      url: '/dashboard/announcement',
      icon: AnnouncementIcon,
      breadcrumbs: false
    },
    {
      id: '10',
      title: i18n.t('Company Profile'),
      type: 'item',
      url: '/dashboard/profile',
      icon: ContactPageIcon,
      breadcrumbs: false
    },
  ]
};

// Tenant Dashboard
const tenantDashboard = {
  title: i18n.t('Tenant Dashboard'),
  type: 'group',
  children: [
    {
      id: 'default',
      title: i18n.t('Dashboard'),
      type: 'item',
      url: '/dashboard/TDashboard',
      icon: HomeIcon,
      breadcrumbs: false
    },
    {
      id: '2',
      title: i18n.t('Announcements'),
      type: 'item',
      url: '/dashboard/announcement',
      icon: AnnouncementIcon,
      breadcrumbs: false
    },
    {
      id: '4',
      title: i18n.t('Vacant Properties'),
      type: 'item',
      url: '/dashboard/vacantproperty',
      icon: icons.IconFileUpload,
      breadcrumbs: false
    },
    {
      id: '5',
      title: i18n.t('Bookings'),
      type: 'item',
      url: '/dashboard/tenantBooking',
      icon: icons.IconFileUpload,
      breadcrumbs: false
    },
    {
      id: '6',
      title: i18n.t('Complaints'),
      type: 'item',
      url: '/dashboard/complaints',
      icon: CommentBankIcon,
      breadcrumbs: false
    },
    {
      id: '7',
      title: i18n.t('Bill Management'),
      type: 'item',
      url: '/dashboard/billT',
      icon: PaymentIcon,
      breadcrumbs: false
    },
    {
      id: '8',
      title: i18n.t('Service Provider'),
      type: 'item',
      url: '/dashboard/serviceprovider',
      icon: HomeRepairServiceIcon,
      breadcrumbs: false
    },
    {
      id: '9',
      title: i18n.t('Announcements'),
      type: 'item',
      url: '/dashboard/announcement',
      icon: AnnouncementIcon,
      breadcrumbs: false
    },
    {
      id: '10',
      title: i18n.t('Company Profile'),
      type: 'item',
      url: '/dashboard/profile',
      icon: ContactPageIcon,
      breadcrumbs: false
    },
  ]
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
    dashboardMenu = { title: i18n.t('No Access'), type: 'group', children: [] };
}

export default dashboardMenu;
