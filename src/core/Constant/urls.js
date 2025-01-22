/* eslint-disable prettier/prettier */

import Complaints from "views/Complaints";

const base = 'http://localhost:7200/api/v1';

export const urls = Object.freeze({
  // SuperAdmin
  user: {
      register: base + '/user/register',
      login: base + '/user/login',
      update: base + '/user/update',
  },
  company:{
      create: base + '/company/register',
      login: base + '/company/login',
      companydata: base + '/company/getAllCompanies',
      edit : base + '/company/edit',
      delete: base + '/company/delete',
      complaintData : base + '/company/getComplaints'
  },
  propertyTypes:{
     create : base + '/types/createType',
     getdata : base + '/types/getAllTypes',
     edit : base +'/types/editType',
     delete: base+ '/types/delete'
  },
  owner:{
    create: base + '/owner/register',
    // login: base + '/owner/login',
    delete: base + '/owner/delete',
    edit: base + '/owner/edit',
    ownerdata: base + '/owner/getAllOwner'
  },
  agent:{
    create: base + '/agent/register',
    // login: base + '/agent/login',
    agentdata: base + '/agent/getAllAgent',
    edit: base + '/agent/edit',
    delete:base + '/agent/delete'
  },
  property:{
    create: base + '/property/register',
    editdata: base +'/property/editproperty',
    propertydata: base + '/property/getproperty',
    delete: base + '/property/delete',
    getVacantProperty : base + '/property/vacantproperty',
     uploadPics : base + '/property/upload'
  },
  tenant:{
    create: base + '/tenant/register',
    // login: base + '/tenant/login',
    tenantdata: base + '/tenant/getTenants',
    editdata: base + '/tenant/editTenant',
    getTenantById: base + '/tenant/getTenantById',
    delete: base + '/tenant/delete',
    tenantBookingData : base+ '/tenant/mybooking',
    getMyTenants: base + '/tenant/getMyTenants'
  },
  booking:{
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
  Complaints:{
    create: base + '/complain/register',
    getComplain: base + '/complain/allComplain',
    editComlplain: base + '/complain/editComplain',
    delete: base+ '/complain/delete',
    getComplainById: base + '/complain/getComplainById',
    allComplainForCompany: base +'/complain/allComplainForCompany',
    addCommentToComplain: base +'/complain/addCommentToComplain',
    resolveComplain: base + '/complain/resolveComplain'

  }
})