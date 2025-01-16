import * as React from 'react';
import { Box, Grid, Typography, Paper, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate, useLocation } from 'react-router';
import { getApi } from 'core/apis/api';
import { urls } from 'core/Constant/urls';
import { useTranslation } from 'react-i18next';

const ComplainDetailsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const complainId = queryParams.get('id');

  const [complainData, setComplainData] = React.useState({});
  const [tenantData, setTenantData] = React.useState({});
  const [propertyData, setPropertyData] = React.useState({});

  const fetchComplainData = async () => {
    try {
      const response = await getApi(urls.Complaints.getComplainById, { id: complainId });
      setComplainData(response.data[0]); // assuming response.data is an array
      setTenantData(response.data[0].tenantId);
      setPropertyData(response.data[0].propertyId);
    } catch (error) {
      console.error('Error fetching complain data:', error);
    }
  };

  React.useEffect(() => {
    fetchComplainData();
  }, [complainId]);

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ color: '#673ab7', borderColor: '#673ab7' }}
            >
              {t('back')}
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
              {t('complain_information')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={6}>
                <Typography variant="h5">{t('tenant_name')}</Typography>
                <Typography>{tenantData.tenantName || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography variant="h5">{t('property_name')}</Typography>
                <Typography>{propertyData.propertyname || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography variant="h5">{t('email')}</Typography>
                <Typography>{tenantData.email || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography variant="h5">{t('phone_number')}</Typography>
                <Typography>{tenantData.phoneno || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography variant="h5">{t('identity_card_type')}</Typography>
                <Typography>{tenantData.identityCardType || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography variant="h5">{t('identity_card_number')}</Typography>
                <Typography>{tenantData.identityNo || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">{t('complain_description')}</Typography>
                <Typography>{complainData.description || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">{t('concern_topic')}</Typography>
                <Typography>{complainData.concernTopic || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">{t('property_address')}</Typography>
                <Typography>{propertyData.address || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">{t('property_rent')}</Typography>
                <Typography>{propertyData.rent || t('not_available')}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">{t('complain_date')}</Typography>
                <Typography>{new Date(complainData.createdAt).toLocaleDateString() || t('not_available')}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ComplainDetailsPage;
