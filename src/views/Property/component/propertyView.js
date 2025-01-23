/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, Button, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router';
import { getApi } from 'core/apis/api';
import { urls } from 'core/Constant/urls';
import { useTranslation } from 'react-i18next';

const Propertyview = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const propertyId = queryParams.get('id');

  const [propertyData, setPropertyData] = useState({});

  // Fetch property data
  const fetchPropertyData = async () => {
    try {
      const response = await getApi(urls.property.getPropertyById, { id: propertyId });
      setPropertyData(response.data || {}); // Assuming the property data is directly in `data`
    } catch (error) {
      console.error('Error fetching property data:', error);
    }
  };

  useEffect(() => {
    fetchPropertyData();
  }, [propertyId]);

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

        {/* Property Information Section */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '50px', borderRadius: '8px', boxShadow: 3 }}>
            <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              {t('property_information')}
            </Typography>
          </Box>
        </Grid>

        {/* Property Details */}
        <Grid item xs={12}>
          <Paper sx={{ padding: 3, border: '1px solid #333', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h5" gutterBottom>
              {t('property_name')}
            </Typography>
            <Typography>{propertyData.propertyname || t('not_available')}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" gutterBottom>
              {t('property_address')}
            </Typography>
            <Typography>{propertyData.address || t('not_available')}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" gutterBottom>
              {t('property_rent')}
            </Typography>
            <Typography>{propertyData.rent || t('not_available')}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" gutterBottom>
              {t('property_description')}
            </Typography>
            <Typography>{propertyData.description || t('not_available')}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" gutterBottom>
              {t('property_is_vacant')}
            </Typography>
            <Typography>{propertyData.isVacant ? t('yes') : t('no')}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" gutterBottom>
              {t('property_zipcode')}
            </Typography>
            <Typography>{propertyData.zipcode || t('not_available')}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" gutterBottom>
              {t('property_map_link')}
            </Typography>
            <a href={propertyData.maplink} target="_blank" rel="noopener noreferrer">
              {t('view_map')}
            </a>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Propertyview;
