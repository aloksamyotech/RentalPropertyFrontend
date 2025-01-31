/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Paper, Divider, Card, Breadcrumbs, Stack,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate, useLocation } from 'react-router';
import { getApi } from 'core/apis/api';
import { urls } from 'core/Constant/urls';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IconHome } from '@tabler/icons';

const AgentView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const agentId = queryParams.get('id');

  const [agentData, setAgentData] = useState({});
  const [bookingData, setBookingData] = useState([]);
  const [tenantData, setTenantData] = useState([]);

  const fetchAgentData = async () => {
    try {
      const response = await getApi(urls.agent.getAgentById, { id: agentId });
      setAgentData(response.data.agent);

      const formattedBookings = response.data.bookings.map((booking, index) => ({
        id: index + 1,
        propertyName: booking.propertyId?.propertyname || t('not_available'),
        tenantName: booking.tenantId?.tenantName || t('not_available'),
        rent: booking.propertyId?.rent || t('not_available'),
        bookingDate: booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : t('not_available'),
        startingDate: booking.startingDate ? new Date(booking.startingDate).toLocaleDateString() : t('not_available'),
        endingDate: booking.endingDate ? new Date(booking.endingDate).toLocaleDateString() : t('not_available'),
        advanceAmount: booking.advanceAmount || t('not_available'),
      }));

      setBookingData(formattedBookings);

      const formattedTenant = response.data.tenant.map((tenant, index) => ({
        id: index + 1,
        tenantName: tenant?.tenantName || t('not_available'),
        email: tenant?.email || t('not_available'),
        phoneno: tenant?.phoneno || t('not_available'),
        address: tenant?.address || t('not_available'),
      }));

      setTenantData(formattedTenant);
    } catch (error) {
      console.error('Error fetching agent data:', error);
    }
  };

  const propertyColumns = [
    { field: 'propertyName', headerName: 'Property Name', width: 150 },
    { field: 'tenantName', headerName: 'Tenant Name', width: 150 },
    { field: 'rent', headerName: 'Rent', width: 100 },
    { field: 'bookingDate', headerName: 'Booking Date', width: 100 },
    { field: 'startingDate', headerName: 'Starting Date', width: 100 },
    { field: 'endingDate', headerName: 'Ending Date', width: 100 },
    { field: 'advanceAmount', headerName: 'Advance Amount', width: 100 },
  ];

  const tenantColumns = [
    { field: 'tenantName', headerName: 'Tenant Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phoneno', headerName: 'Phone No', width: 150 },
    { field: 'address', headerName: 'Address', width: 150 },
  ];

  useEffect(() => {
    if (agentId) fetchAgentData();
  }, [agentId]);

  const breadcrumbs = [
    <Link key="home" to="/dashboard/default" style={{ color: 'inherit' }}>
      <IconHome />
    </Link>,
    <Link key="agents" to="/dashboard/agents" style={{ color: 'inherit' }}>
      {t('Agent Management')}
    </Link>,
    <Typography key="view" color="text.primary">
    {t('View')}
  </Typography>,
  ];

  return (
    <Box sx={{ width: '100%', padding: 3, backgroundColor: '#f4f4f9' }}>
      <Grid container spacing={3}>
        {/* Header Section */}
        <Grid item xs={12}>
        <Card sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {t('Agent Details')}
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              {breadcrumbs}
            </Breadcrumbs>
          </Typography>
        </Stack>
      </Card>
     
        </Grid>
        {/* Agent Information Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: '#fff', boxShadow: 1 }}>
            <Typography variant="h4" gutterBottom>{t('Agent Information')}</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}><Typography variant="h5">{t('Agent Name')}</Typography><Typography>{agentData.agentName || t('not_available')}</Typography></Grid>
              <Grid item xs={6}><Typography variant="h5">{t('Email')}</Typography><Typography>{agentData.email || t('not_available')}</Typography></Grid>
              <Grid item xs={6}><Typography variant="h5">{t('Phone Number')}</Typography><Typography>{agentData.phoneNo || t('not_available')}</Typography></Grid>
              <Grid item xs={6}><Typography variant="h5">{t('Address')}</Typography><Typography>{agentData.address || t('not_available')}</Typography></Grid>
              <Grid item xs={6}><Typography variant="h5">{t('Joining Date')}</Typography>
                <Typography>
                  {agentData.createdAt ? new Date(agentData.createdAt).toLocaleDateString() : t('not_available')}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Booking Information Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: '#fff', boxShadow: 1 }}>
            <Typography variant="h4" gutterBottom>{t('Booking Information')}</Typography>
            <Divider sx={{ mb: 2 }} />
            {bookingData.length ? (
              <Paper sx={{ width: '100%' }}>
                <DataGrid
                  autoHeight
                  rows={bookingData}
                  columns={propertyColumns}
                  pageSizeOptions={[5, 10]}
                  checkboxSelection
                  sx={{ border: 0 }}
                />
              </Paper>
            ) : (
              <Typography variant="body2" color="textSecondary">{t('No booking details available.')}</Typography>
            )}
          </Paper>
        </Grid>

        {/* Tenant Information Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: '#fff', boxShadow: 1 }}>
            <Typography variant="h4" gutterBottom>{t('Tenant Information')}</Typography>
            <Divider sx={{ mb: 2 }} />
            {tenantData.length ? (
              <Paper sx={{ width: '100%' }}>
                <DataGrid
                  autoHeight
                  rows={tenantData}
                  columns={tenantColumns}
                  pageSizeOptions={[5, 10]}
                  checkboxSelection
                  sx={{ border: 0 }}
                />
              </Paper>
            ) : (
              <Typography variant="body2" color="textSecondary">{t('No tenant details available.')}</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgentView;
