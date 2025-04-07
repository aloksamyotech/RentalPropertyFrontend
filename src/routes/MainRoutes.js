/* eslint-disable prettier/prettier */
import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Property from 'views/Property';
import Units from 'views/Units';
import Tenents from 'views/Tenants';

import Complaints from 'views/Complaints';
import Announcement from 'views/Announcement';
import Company from 'views/Company';
import PropertyTypes from 'views/PropertyTypes';
import { parseJWT } from 'helper';
import Booking from 'views/Booking';
import TenantBooking from 'views/TenantBooking';
import CompanyComplaints from 'views/CompanyComplaints';
import ComplainViewDashboard from 'views/CompanyComplaints/component/ComplainView';
import ComplainDetailsPage from 'views/CompanyComplaints/component/ComplainView';
import ComplainDetailsPageForTenant from 'views/Complaints/component/TenantComaplainView';
import BookingDetailsPage from 'views/Booking/component/BookingView';
import BookingDetailsTenantPage from 'views/TenantBooking/component/BookingTenantDetails';
import VacantProperties from 'views/VacantProperties';
import { element } from 'prop-types';
import Propertyview from 'views/Property/component/propertyView';
import OwnerDetails from 'views/Owner/Components/OwnerDetails';
import TenentView from 'views/Tenants/component/TenentViews';
import AgentView from 'views/Agents/components/AgentView';
// import CreateBill from 'views/Booking/component/CreateBill';
import Bill from 'views/Bill/indexC';
import BillT from 'views/Bill/indexT';
import ServiceProvider from 'views/ServiceProvider';
import AnnouncementViewPage from 'views/Announcement/components/AnnouncementView';
import VacantPropertyView from 'views/VacantProperties/Component/VacantPropertyView';
import GenerateMonthlyBill from 'views/Booking/CreateBill';
import MonthlyInvoiceView from 'views/Bill/MonthlyInvoiceView';
import BillA from 'views/Bill/indexA';
import ComplainDetailsPageForAgent from 'views/Complaints/component/AgentComplainView';
import ProfilePage from 'views/ProfilePage';
import ATDashboard from 'views/DashboardAT/indexA';
import ADashboard from 'views/DashboardAT/indexA';
import TDashboard from 'views/DashboardAT/indexT';
import SADashboard from 'views/DashboardAT/indexSA';

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
const Document = Loadable(lazy(() => import('views/VacantProperties')));
const Calender = Loadable(lazy(() => import('views/Calender')));
const AddTemplates = Loadable(lazy(() => import('views/EmailTemplates/AddTemplates')));
const Agents = Loadable(lazy(() => import('views/Agents')));
const Owner = Loadable(lazy(() => import('views/Owner')));

let token = localStorage.getItem('$2b$10$ehdPSDmr6P');
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
        { path: 'SADashboard', element: <SADashboard /> },
        { path: 'company', element: <Company /> },
        { path: 'property', element: <Property /> },
        { path: 'tenents', element: <Tenents /> },
        { path: 'payment', element: <Payment /> },
        { path: 'agents', element: <Agents /> },
        { path: 'complaints', element: <Complaints /> },
        { path: 'Announcement', element: <Announcement /> },
        { path: 'email', element: <Email /> },
        { path: 'meeting', element: <Metting /> },
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
        { path: 'propertyTypes', element: <PropertyTypes /> },
        { path: 'tenents', element: <Tenents /> },
        { path: 'announcement', element: <Announcement /> },
        { path: 'payment', element: <Payment /> },
        { path: 'billC', element: <Bill /> },
        { path: 'announcement/view', element: <AnnouncementViewPage/> },
        { path: 'serviceprovider', element: <ServiceProvider /> },
        { path: 'companyComplaints', element: <CompanyComplaints/> },
        { path: 'billC/view', element: <MonthlyInvoiceView/> },
        { path: 'agents', element: <Agents /> },
        { path: 'booking', element: <Booking /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'complain/view', element: <ComplainDetailsPage/> },
        { path: 'booking/view', element: <BookingDetailsPage/> },
        { path: 'Announcement', element: <Announcement /> },
        { path: 'property/view', element:<Propertyview/> },
        { path: 'owner/view', element:<OwnerDetails/> },
        { path: 'tenant/view' , element:<TenentView/>},
        { path: 'agent/view' , element:<AgentView/>},
        { path: 'meeting', element: <Metting /> },
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
        // { path: 'default', element: <DashboardDefault /> },
        { path: 'TDashboard', element: <TDashboard /> },
        { path: 'property', element: <Property /> },
        { path: 'announcement/view', element: <AnnouncementViewPage/> },
        { path: 'tenantBooking', element: <TenantBooking /> },
        { path: 'payment', element: <Payment /> },
        { path: 'serviceprovider', element: <ServiceProvider /> },
        { path: 'agents', element: <Agents /> },
        { path: 'billC/view', element: <MonthlyInvoiceView/> },
        // { path: 'billC', element: <Bill /> },
        { path: 'property/view', element:<Propertyview/> },
        { path: 'vacantproperty/view', element:<VacantPropertyView/>},
        { path: 'billT', element: <BillT /> },
        { path: 'announcement', element: <Announcement /> },
        { path: 'vacantproperty', element:<VacantProperties /> },
        { path: 'complain/tenant/view', element: <ComplainDetailsPageForTenant/> },
        { path: 'complaints', element: <Complaints /> },
        { path: 'booking/tenant/view', element: <BookingDetailsTenantPage /> },
        { path: 'email', element: <Email /> },
        { path: 'meeting', element: <Metting /> },
        { path: 'document', element: <Document /> },
        { path: 'profile', element: <ProfilePage /> },
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
        // { path: 'default', element: <DashboardDefault /> },
        { path: 'ADashboard', element: <ADashboard /> },
        { path: 'billC', element: <Bill /> },
        { path: 'property', element: <Property /> },
        { path: 'tenents', element: <Tenents /> },
        { path: 'announcement/view', element: <AnnouncementViewPage/> }, 
        { path: 'payment', element: <Payment /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'booking', element: <Booking /> },
        { path: 'property/view', element:<Propertyview/> },
        { path: 'announcement', element: <Announcement /> },
        { path: 'tenant/view' , element:<TenentView/>},
        // { path: 'billT', element: <BillT /> },
        {path: 'billA', element :<BillA/>},
        { path: 'serviceprovider', element: <ServiceProvider /> },
        { path: 'billC/view', element: <MonthlyInvoiceView/> },
        { path: 'vacantproperty', element:<VacantProperties /> },
        { path: 'agents', element: <Agents /> },
        { path: 'complaints', element: <Complaints /> },
        { path: 'complain/agent/view', element: <ComplainDetailsPageForAgent/> },
        { path: 'vacantProperty/view', element: <VacantPropertyView/> },
        { path: 'booking/view', element: <BookingDetailsPage/> },
        { path: 'Announcement', element: <Announcement /> },
        { path: 'email', element: <Email /> },
        { path: 'meeting', element: <Metting /> },
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
