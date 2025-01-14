/* eslint-disable prettier/prettier */
import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Property from 'views/Property';
import Units from 'views/Units';
import Tenents from 'views/Tenants';
import VacantNotice from 'views/VacantNotice';
import Complaints from 'views/Complaints';
import Announcement from 'views/Announcement';
import Company from 'views/Company';
import PropertyTypes from 'views/PropertyTypes';
import { parseJWT } from 'helper';
import Booking from 'views/Booking';
import TenantBooking from 'views/TenantBooking';
import CompanyComplaints from 'views/CompanyComplaints';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const ContactManagement = Loadable(lazy(() => import('views/Contact')));
const Call = Loadable(lazy(() => import('views/Calls')));
const Policy = Loadable(lazy(() => import('views/Policy')));
const Metting = Loadable(lazy(() => import('views/Metting')));
const Payment = Loadable(lazy(() => import('views/Payments')));
const Email = Loadable(lazy(() => import('views/Email')));
const Task = Loadable(lazy(() => import('views/Task')));
const EmailTemplates = Loadable(lazy(() => import('views/EmailTemplates')));
const Document = Loadable(lazy(() => import('views/Documents')));
const Calender = Loadable(lazy(() => import('views/Calender')));
const AddTemplates = Loadable(lazy(() => import('views/EmailTemplates/AddTemplates')));
const Agents = Loadable(lazy(() => import('views/Agents')));
const Owner = Loadable(lazy(() => import('views/Owner')));

// Retrieve token and parse payload
let token = localStorage.getItem('$2b$10$ehdPSDmr6P');
// token = token ? JSON.parse(token) : null;
const payload = parseJWT(token);

const superAdminRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        { path: 'default', element: <DashboardDefault /> },
        { path: 'company', element: <Company /> },
        { path: 'property', element: <Property /> },
        { path: 'tenents', element: <Tenents /> },
        { path: 'payment', element: <Payment /> },
        { path: 'agents', element: <Agents /> },
        { path: 'complaints', element: <Complaints /> },
        { path: 'Announcement', element: <Announcement /> },
        { path: 'email', element: <Email /> },
        { path: 'meeting', element: <Metting /> },
        { path: 'calender', element: <Calender /> },
        { path: 'document', element: <Document /> },
        { path: 'owner', element: <Owner /> },
        { path: 'emailtemplate/addTemplates', element: <AddTemplates /> }
      ]
    }
  ]
};

const companyAdminRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        { path: 'default', element: <DashboardDefault /> },
        { path: 'property', element: <Property /> },
        { path: 'tenents', element: <Tenents /> },
        { path: 'payment', element: <Payment /> },
        { path: 'companyComplaints', element: <CompanyComplaints/> },
        { path: 'agents', element: <Agents /> },
        { path: 'booking', element: <Booking /> },
        { path: 'Announcement', element: <Announcement /> },
        { path: 'email', element: <Email /> },
        { path: 'meeting', element: <Metting /> },
        { path: 'calender', element: <Calender /> },
        { path: 'document', element: <Document /> },
        { path: 'owner', element: <Owner /> },
        { path: 'emailtemplate/addTemplates', element: <AddTemplates /> }
      ]
    }
  ]
};

const tenantRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        { path: 'default', element: <DashboardDefault /> },
        { path: 'property', element: <Property /> },
        { path: 'tenantBooking', element: <TenantBooking /> },
        { path: 'payment', element: <Payment /> },
        { path: 'agents', element: <Agents /> },
        { path: 'complaints', element: <Complaints /> },
        { path: 'Announcement', element: <Announcement /> },
        { path: 'email', element: <Email /> },
        { path: 'meeting', element: <Metting /> },
        { path: 'calender', element: <Calender /> },
        { path: 'document', element: <Document /> }
      ]
    }
  ]
};

const agentDashboardRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        { path: 'default', element: <DashboardDefault /> },
        { path: 'property', element: <Property /> },
        { path: 'tenents', element: <Tenents /> },
        { path: 'payment', element: <Payment /> },
        { path: 'booking', element: <Booking /> },
        { path: 'agents', element: <Agents /> },
        { path: 'complaints', element: <Complaints /> },
        { path: 'Announcement', element: <Announcement /> },
        { path: 'email', element: <Email /> },
        { path: 'meeting', element: <Metting /> },
        { path: 'calender', element: <Calender /> },
        { path: 'document', element: <Document /> },
        { path: 'owner', element: <Owner /> }
      ]
    }
  ]
};

let MainRoutes = [];

if (payload?.role === 'admin') {
  MainRoutes = superAdminRoutes;
} else if (payload?.role === 'companyAdmin') {
  MainRoutes = companyAdminRoutes;
} else if (payload?.role === 'tenant') {
  MainRoutes = tenantRoutes;
} else if (payload?.role === 'agent') {
  MainRoutes = agentDashboardRoutes;
}


export default MainRoutes;
