/* eslint-disable prettier/prettier */

import Complaints from 'views/Complaints';

const base = 'http://localhost:7200/api/v1';
// const base = 'http://165.22.218.55:7202/api/v1';
// const base = 'https://rentals.samyotech.in/api/v1';
const imageBase = 'http://localhost:7200/';
// const imageBase = 'https://rentals.samyotech.in/';
export const urls = Object.freeze({
  // SuperAdmin
  user: {
    register: base + '/user/register',
    login: base + '/user/login',
    update: base + '/user/update'
  },
  bill: {
    createBill: base + '/bill/createBill',
    getAllBill: base + '/bill/getAllBill',
    getBillByT: base + '/bill/getBillForT',
    getBillById: base + '/bill/getBillById',
    changeBillStatus: base + '/bill/changeBillStatus',
    delete: base + '/bill/DeleteBill',
    getBillByAgentId: base + '/bill/getBillByAgentId',
    getBillByBookingId:base + '/bill/getBillByBookingId'
  },
  company: {
    create: base + '/company/register',
    login: base + '/company/login',
    companydata: base + '/company/getAllCompanies',
    edit: base + '/company/edit',
    delete: base + '/company/delete',
    complaintData: base + '/company/getComplaints',
    getCompanyById: base + '/company/getCompanyById',
    changestatus: base+'/company/changestatus',
    addSmtpMailPassword: base+'/company/addMailPassword',
    changeMailStatus: base + '/company/updateMailStatus'
  },
  propertyTypes: {
    create: base + '/types/createType',
    getdata: base + '/types/getAllTypes',
    edit: base + '/types/editType',
    delete: base + '/types/delete'
  },
  owner: {
    create: base + '/owner/register',
    // login: base + '/owner/login',
    delete: base + '/owner/delete',
    edit: base + '/owner/edit',
    ownerdata: base + '/owner/getAllOwner',
    ownerById: base + '/owner/getOwnerById',
    getPropertyByOwnerId: base + '/owner/getPropertyByOwnerId'
  },
  agent: {
    create: base + '/agent/register',
    // login: base + '/agent/login',
    agentdata: base + '/agent/getAllAgent',
    edit: base + '/agent/edit',
    delete: base + '/agent/delete',
    getAgentById: base + '/agent/getAgentById'
  },
  property: {
    create: base + '/property/register',
    editdata: base + '/property/editproperty',
    propertydata: base + '/property/getproperty',
    getPropertyById: base + '/property/getPropertyById',
    propertyDataAll: base + '/property/getAllProperties',
    delete: base + '/property/delete',
    getVacantProperty: base + '/property/vacantproperty',
    uploadPics: base + '/property/upload',
    uplaodImages: base + '/property/uploadImages',
    getAllImgByPropertyId: base + '/property/getAllImages',
    deleteImg: base + '/property/deleteImg',
    image: imageBase
  },
  tenant: {
    create: base + '/tenant/register',
    // login: base + '/tenant/login',
    tenantdata: base + '/tenant/getTenants',
    editdata: base + '/tenant/editTenant',
    getTenantById: base + '/tenant/getTenantById',
    delete: base + '/tenant/delete',
    tenantBookingData: base + '/tenant/mybooking',
    getMyTenants: base + '/tenant/getMyTenants',
    getAllTenants: base + '/tenant/getAllTenants',
    tenantDocs: base + '/tenant/tenantDoc',
    getAllDocByTenantId: base + '/tenant/getAllDocs',
    deleteDocs: base + '/tenant/deleteDoc',
    image: imageBase
  },
  booking: {
    create: base + '/booking/create',
    bookingdata: base + '/booking/getBooking',
    allbooking: base + '/booking/allBooking',
    updateBooking: base + '/booking/editBooking',
    breakTheBooking: base + '/booking/breakTheBooking',
    getBookingById: base + '/booking/getBookingById',
    propertyOnNotice: base + '/booking/propertyOnNotice'
  },
  visitor: {
    create: base + '/createvisitor',
    getallvisitor: base + '/getallvisitor'
  },
  Complaints: {
    create: base + '/complain/register',
    getComplain: base + '/complain/allComplain',
    editComlplain: base + '/complain/editComplain',
    delete: base + '/complain/delete',
    getComplainById: base + '/complain/getComplainById',
    allComplainForCompany: base + '/complain/allComplainForCompany',
    addCommentToComplain: base + '/complain/addCommentToComplain',
    resolveComplain: base + '/complain/resolveComplain',
    getAllComplainCompanyAgent: base + '/complain/getAllComplainCompanyAgent'
  },
  serviceProvider: {
    create: base + '/serviceProvider/register',
    getAll: base + '/serviceProvider/getServiceProviders',
    updateServiceProvider: base + '/serviceProvider/edit',
    delete: base + '/serviceProvider/delete'
  },
  Announcement: {
    create: base + '/announcement/create',
    getAllAnnouncement: base + '/announcement/getAllAnnouncement',
    editAnnouncement: base + '/announcement/editAnnouncement',
    delete: base + '/announcement/delete',
    getAnnouncementById: base + '/announcement/getAnnouncementById'
  }
});
