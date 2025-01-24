/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, Button, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router';
import { getApi } from 'core/apis/api';
import { urls } from 'core/Constant/urls';
import { useTranslation } from 'react-i18next';

const OwnerDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const ownerId = queryParams.get('id');

  const [ownerData, setOwnerData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);

  const fetchOwnerData = async () => {
    try {
      const response = await getApi(urls.owner.ownerById, { id: ownerId });
      setOwnerData(response.data); 
    } catch (error) {
      console.error('Error fetching property data:', error);
    }
  };
  
  const fetchPropertyData = async () => {
    try {
      const response = await getApi(urls.owner.getPropertyByOwnerId, { id: ownerId  });
      setPropertyData(response.data); 
    } catch (error) {
      console.error('Error fetching property data:', error);
    }
  };

  useEffect(() => {
    fetchOwnerData();
    fetchPropertyData();
  }, [ownerId]);

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
              {t('owner_information')}
            </Typography>
          </Box>
        </Grid>

        {/* Property Details */}
        <Grid item xs={12}>
          <Paper sx={{ padding: 3, border: '1px solid #333', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h5" gutterBottom>
              {t('Owner_name')}
            </Typography>
            <Typography>{ownerData.ownerName || t('not_available')}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" gutterBottom>
              {t('Owner_address')}
            </Typography>
            <Typography>{ownerData.phoneNo || t('not_available')}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" gutterBottom>
              {t('property_rent')}
            </Typography>
            <Typography>{ownerData.address || t('not_available')}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" gutterBottom>
              {t('Total Properties Listed')}
            </Typography>
            <Typography>{propertyData || t('not_available')}</Typography>
           
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OwnerDetails;
