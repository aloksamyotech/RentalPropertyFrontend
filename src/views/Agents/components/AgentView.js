/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Paper, Divider, Card, Breadcrumbs, Stack,Container
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
      console.error(t('error_fetching_data'), error);
    }
  };

  const propertyColumns = [
    { field: 'propertyName', headerName: t('property_name'), width: 150 },
    { field: 'tenantName', headerName: t('tenant_name'), width: 150 },
    { field: 'rent', headerName: t('rent'), width: 100 },
    { field: 'bookingDate', headerName: t('booking_date'), width: 100 },
    { field: 'startingDate', headerName: t('starting_date'), width: 100 },
    { field: 'endingDate', headerName: t('ending_date'), width: 100 },
    { field: 'advanceAmount', headerName: t('advance_amount'), width: 100 },
  ];

  const tenantColumns = [
    { field: 'tenantName', headerName: t('tenant_name'), width: 150 },
    { field: 'email', headerName: t('email'), width: 250 },
    { field: 'phoneno', headerName: t('phone_no'), width: 150 },
    { field: 'address', headerName: t('address'), width: 150 },
  ];

  useEffect(() => {
    if (agentId) fetchAgentData();
  }, [agentId]);

  const breadcrumbs = [
    <Link key="home" to="/dashboard/default" style={{ color: 'inherit' }}>
      <IconHome />
    </Link>,
    <Link key="agents" to="/dashboard/agents" style={{ color: 'inherit' }}>
      {t('agent_management')}
    </Link>,
    <Typography key="view" color="text.primary">
      {t('view')}
    </Typography>,
  ];

  return (
    // <Box sx={{ width: '100%', padding: 3, backgroundColor: '#f4f4f9' }}>
    <Container>
      <Grid container spacing={3}>
        {/* Header Section */}
        <Grid item xs={12}>
          <Card sx={{ p: 2, mb: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {t('agent_details')}
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
            <Typography variant="h4" gutterBottom>{t('agent_information')}</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}><Typography variant="h5">{t('agent_name')}</Typography><Typography>{agentData.agentName || t('not_available')}</Typography></Grid>
              <Grid item xs={6}><Typography variant="h5">{t('email')}</Typography><Typography>{agentData.email || t('not_available')}</Typography></Grid>
              <Grid item xs={6}><Typography variant="h5">{t('phone_number')}</Typography><Typography>{agentData.phoneNo || t('not_available')}</Typography></Grid>
              <Grid item xs={6}><Typography variant="h5">{t('address')}</Typography><Typography>{agentData.address || t('not_available')}</Typography></Grid>
              <Grid item xs={6}><Typography variant="h5">{t('joining_date')}</Typography>
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
            <Typography variant="h4" gutterBottom>{t('booking_information')}</Typography>
            <Divider sx={{ mb: 2 }} />
            {bookingData.length ? (
              <DataGrid autoHeight rows={bookingData} columns={propertyColumns} pageSizeOptions={[5, 10]} checkboxSelection sx={{ border: 0 }} />
            ) : (
              <Typography variant="body2" color="textSecondary">{t('no_booking_details')}</Typography>
            )}
          </Paper>
        </Grid>

        {/* Tenant Information Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: '#fff', boxShadow: 1 }}>
            <Typography variant="h4" gutterBottom>{t('tenant_information')}</Typography>
            <Divider sx={{ mb: 2 }} />
            {tenantData.length ? (
              <DataGrid autoHeight rows={tenantData} columns={tenantColumns} pageSizeOptions={[5, 10]} checkboxSelection sx={{ border: 0 }} />
            ) : (
              <Typography variant="body2" color="textSecondary">{t('no_tenant_details')}</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      </Container>
    // </Box>
  );
};

export default AgentView;
