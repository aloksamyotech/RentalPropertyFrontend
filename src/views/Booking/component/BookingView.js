/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, Divider, Container, Card, Breadcrumbs, Stack } from '@mui/material';
import { useNavigate, useLocation } from 'react-router';
import { getApi } from 'core/apis/api';
import { urls } from 'core/Constant/urls';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IconHome } from '@tabler/icons';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const BookingDetailsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get('id');
  const reporterName = queryParams.get('reporterName');

  const [bookingData, setBookingData] = useState({});
  const [tenantData, setTenantData] = useState({});
  const [propertyData, setPropertyData] = useState({});
  const [value, setValue] = useState('1'); // Active tab state

  const fetchBookingData = async () => {
    try {
      const response = await getApi(urls.booking.getBookingById, { id: bookingId });
      setBookingData(response.data);
      setTenantData(response.data.tenantId);
      setPropertyData(response.data.propertyId);
    } catch (error) {
      console.error('Error fetching booking data:', error);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue); // Update the active tab
  };

  useEffect(() => {
    fetchBookingData();
  }, [bookingId]);

  const breadcrumbs = [
    <Link underline="hover" key="home" to="/dashboard/default" style={{ color: 'inherit' }}>
      <IconHome />
    </Link>,
    <Link underline="hover" key="property-management" to="/dashboard/booking" style={{ color: 'inherit' }}>
      {t('Booking Management')}
    </Link>,
    <Typography key="view" color="text.primary">
      {t('View')}
    </Typography>,
  ];

  return (
    <Container>
      <Grid container spacing={3}>
        {/* Booking Title Section */}
        <Grid item xs={12}>
          <Card sx={{ p: 2, mb: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {t('Booking Details')}
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                  {breadcrumbs}
                </Breadcrumbs>
              </Typography>
            </Stack>
          </Card>
        </Grid>

        {/* Tab Section */}
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label={t('Booking Information')} value="1" />
                  <Tab label={t('Tenant Bills')} value="2" />
                </TabList>
              </Box>

              {/* TabPanel 1 - Booking Information */}
              <TabPanel value="1">
                <Grid container spacing={3}>
                  {/* Tenant Information */}
                  <Grid item xs={12} >
                    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                      <Typography variant="h5" gutterBottom>{t('tenant_information')}</Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('tenant_name')}</Typography>
                          <Typography>{tenantData.tenantName || t('not_available')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('email')}</Typography>
                          <Typography>{tenantData.email || t('not_available')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('phone_number')}</Typography>
                          <Typography>{tenantData.phoneno || t('not_available')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('Address')}</Typography>
                          <Typography>{tenantData.address || t('not_available')}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>

                  {/* Property Information */}
                  <Grid item xs={12} >
                    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                      <Typography variant="h5" gutterBottom>{t('property_information')}</Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('property_name')}</Typography>
                          <Typography>{propertyData.propertyname || t('not_available')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('property_address')}</Typography>
                          <Typography>{propertyData.address || t('not_available')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('property_rent')}</Typography>
                          <Typography>{propertyData.rent || t('not_available')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('description')}</Typography>
                          <Typography>{propertyData.description || t('not_available')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('zipcode')}</Typography>
                          <Typography>{propertyData.zipcode || t('not_available')}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>

                  {/* Booking Details */}
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                      <Typography variant="h5" gutterBottom>{t('booking_details')}</Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('booking_date')}</Typography>
                          <Typography>{new Date(bookingData.bookingDate).toLocaleDateString() || t('not_available')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('advance_amount')}</Typography>
                          <Typography>{bookingData.advanceAmount || t('not_available')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('starting_date')}</Typography>
                          <Typography>{new Date(bookingData.startingDate).toLocaleDateString() || t('not_available')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{t('ending_date')}</Typography>
                          <Typography>{new Date(bookingData.endingDate).toLocaleDateString() || t('not_available')}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </TabPanel>

              {/* TabPanel 2 - Tenant Bills (Empty for now) */}
              <TabPanel value="2">
                <Typography>{t('tenant_bills_not_available')}</Typography>
              </TabPanel>
            </TabContext>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookingDetailsPage;
