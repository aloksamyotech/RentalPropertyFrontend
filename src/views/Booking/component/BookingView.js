/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import { Box, Grid, Typography, TextField, Paper, Button, Divider, Switch, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router';
import { getApi, patchApi } from 'core/apis/api';
import { urls } from 'core/Constant/urls';
import { useFormik } from 'formik';
import SendIcon from '@mui/icons-material/Send';
import * as Yup from 'yup'; // Optional: For validation
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import MyLocationIcon from '@mui/icons-material/MyLocation';
const BookingDetailsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const label = { inputProps: { 'aria-label': 'Color switch demo' } };
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get('id');
  const reporterName = queryParams.get('reporterName')

  const [bookingData, setBookingData] = useState({});
  const [tenantData, setTenantData] = useState({});
  const [propertyData, setPropertyData] = useState({});
  const [status, setStatus] = useState(false);
  console.log(bookingData,"bookingDatabookingDatabookingData")

  const fetchBookingData = async () => {
    try {
      const response = await getApi(urls.booking.getBookingById, { id: bookingId });
      console.log(response.data,"response,,..././..")
      setBookingData(response.data);
      setTenantData(response.data.tenantId);
      setPropertyData(response.data.propertyId);
      setStatus(response.data.status); 
    } catch (error) {
      console.error('Error fetching booking data:', error);
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, [bookingId]);

  const validationSchema = Yup.object({
    comment: Yup.string().required(t('comment_required')),
  });

  const initialValues = {
    comment: '',
  };

  const addComment = async (values, resetForm) => {
    try {
      const response = await patchApi(
        urls.booking.addCommentToBooking,
        { comment: values.comment },
        { id: bookingId }
      );

      if (response.success) {
        toast.success(t('comment_added_successfully'));
        resetForm();
      } else {
        toast.error(t('something_went_wrong'));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(t('something_went_wrong'));
    }
  };

  const handleStatusChange = async (event) => {
    setStatus(event.target.checked); 

    try {
      const response = await patchApi(
        urls.booking.updateBookingStatus,
        { status: event.target.checked }, 
        { id: bookingId }
      );

      if (response.success) {
        toast.success(t('booking_status_updated'));
      } else {
        toast.error(t('something_went_wrong'));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(t('something_went_wrong'));
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await addComment(values, resetForm);
    },
  });

  return (
    <Box sx={{ width: '100%', padding: 3, backgroundColor: '#f4f4f9' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{
                color: '#673ab7',
                borderColor: '#673ab7',
                '&:hover': {
                  backgroundColor: '#f3e5f5',
                },
              }}
            >
              {t('back')}
            </Button>
          </Box>
        </Grid>

        {/* Booking Title Section */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              height: '50px',
              borderRadius: '8px',
              boxShadow: 3,
            }}
          >
            <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              {t('booking_information')}
            </Typography>
          </Box>
        </Grid>

        {/* Tenant Info Section */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              padding: 3,
              border: '1px solid #333',
              borderRadius: '8px',
              backgroundColor: '#fff',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="h4" gutterBottom>
              {t('tenant_information')}
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h5">{t('tenant_name')}</Typography>
                <Typography>{tenantData.tenantName || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">{t('email')}</Typography>
                <Typography>{tenantData.email || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">{t('phone_number')}</Typography>
                <Typography>{tenantData.phoneno || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">{t('Address')}</Typography>
                <Typography>{tenantData.address || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">{t('EmergencyNo')}</Typography>
                <Typography>{tenantData.emergencyNo || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">{t('Reported By')}</Typography>
                <Typography>{reporterName || t('not_available')}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Property Info Section */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              padding: 3,
              border: '1px solid #333',
              borderRadius: '8px',
              backgroundColor: '#fff',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
           <Typography variant="h4" gutterBottom>
  {t('property_information')}

  {propertyData.maplink ? (
    <a 
      href={propertyData.maplink} 
      target="_blank" 
      rel="noopener noreferrer" 
      style={{
        color: '#3f51b5', 
        textDecoration: 'none', 
        display: 'inline-flex', 
        alignItems: 'left', 
        marginLeft: '150px',
      }}
    >
      {t('Location On Map')} <MyLocationIcon sx={{ ml: 1 }} />
    </a>
  ) : (
    t('not_available')
  )}
</Typography>

            <Divider sx={{ marginBottom: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h5">{t('property_name')}</Typography>
                <Typography>{propertyData.propertyname || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">{t('property_address')}</Typography>
                <Typography>{propertyData.address || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">{t('property_rent')}</Typography>
                <Typography>{propertyData.rent || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">{t('Discription')}</Typography>
                <Typography>{propertyData.description || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">{t('zipcode')}</Typography>
                <Typography>{propertyData.zipcode || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">{t('Address')}</Typography>
                <Typography>{propertyData.address || t('not_available')}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

    {/* Booking Details and Comment Section */}
<Grid item xs={12}>
  <Paper
    sx={{
      padding: 3,
      border: '1px solid #333',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    }}
  >
    <Typography variant="h4" gutterBottom>
      {t('booking_details')}
    </Typography>
    <Divider sx={{ marginBottom: 2 }} />
    <Grid container spacing={2}>
      {/* Booking Date */}
      <Grid item xs={12} sm={6}>
        <Typography variant="h5" gutterBottom>
          {t('booking_date')}
        </Typography>
        <Typography variant="body1">
          {new Date(bookingData.bookingDate).toLocaleDateString() || t('not_available')}
        </Typography>
      </Grid>

      {/* Advance Amount */}
      <Grid item xs={12} sm={6}>
        <Typography variant="h5" gutterBottom>
          {t('advance_amount')}
        </Typography>
        <Typography variant="body1">
          {bookingData.advanceAmount || t('not_available')}
        </Typography>
      </Grid>

      {/* Starting Date */}
      <Grid item xs={12} sm={6}>
        <Typography variant="h5" gutterBottom>
          {t('starting_date')}
        </Typography>
        <Typography variant="body1">
          {new Date(bookingData.startingDate).toLocaleDateString() || t('not_available')}
        </Typography>
      </Grid>

      {/* Ending Date */}
      <Grid item xs={12} sm={6}>
        <Typography variant="h5" gutterBottom>
          {t('ending_date')}
        </Typography>
        <Typography variant="body1">
          {new Date(bookingData.endingDate).toLocaleDateString() || t('not_available')}
        </Typography>
      </Grid>
    </Grid>
  </Paper>
</Grid>

      </Grid>
    </Box>
  );
};

export default BookingDetailsPage;
