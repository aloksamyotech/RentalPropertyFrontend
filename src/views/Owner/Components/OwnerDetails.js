/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Card,
  Breadcrumbs,
  Stack,
  Container,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router';
import { getApi } from 'core/apis/api';
import { urls } from 'core/Constant/urls';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IconHome } from '@tabler/icons';

const OwnerDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const ownerId = queryParams.get('id');

  const [ownerData, setOwnerData] = useState(null);
  const [propertyData, setPropertyData] = useState([]);

  const fetchOwnerData = async () => {
    try {
      const response = await getApi(urls.owner.ownerById, { id: ownerId });
      setOwnerData(response?.data || {});
    } catch (error) {
      console.error('Error fetching owner data:', error);
    }
  };

  const fetchPropertyData = async () => {
    try {
      const response = await getApi(urls.owner.getPropertyByOwnerId, { id: ownerId });
      setPropertyData(response?.data || []);
    } catch (error) {
      console.error('Error fetching property data:', error);
    }
  };

  useEffect(() => {
    if (ownerId) {
      fetchOwnerData();
      fetchPropertyData();
    }
  }, [ownerId]);

  const breadcrumbs = [
    <Link key="home" to="/dashboard/default" style={{ color: 'inherit', textDecoration: 'none' }}>
      <IconHome />
    </Link>,
    <Link key="owner-management" to="/dashboard/booking" style={{ color: 'inherit', textDecoration: 'none' }}>
      {t('Owner Management')}
    </Link>,
    <Typography key="view" color="text.primary">
      {t('View')}
    </Typography>,
  ];

  return (
    <Container>
      {/* Breadcrumb and Heading */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">{t('Owner Details')}</Typography>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      </Card>

      <Grid container spacing={2}>
        {/* Owner Details Section */}
        <Grid item xs={12}>
          {ownerData ? (
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>{t('Owner Name:')}</TableCell>
                    <TableCell>{ownerData.ownerName || t('not_available')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('Email Id')}</TableCell>
                    <TableCell>{ownerData.email || t('not_available')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('Mobile No.')}</TableCell>
                    <TableCell>{ownerData.phoneNo || t('not_available')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('Address')}</TableCell>
                    <TableCell>{ownerData.address || t('not_available')}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          ) : (
            <Typography variant="body2" color="textSecondary">
              {t('No owner details available.')}
            </Typography>
          )}
        </Grid>

        {/* Property Details Section */}
        <Grid item xs={12}>
          {propertyData.length > 0 ? (
            propertyData.map((property, index) => (
              <Paper key={index} sx={{ p: 3, mb: 2, borderRadius: 2, boxShadow: 3 }}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>{t('Property Name:')}</TableCell>
                      <TableCell>{property.propertyName || t('not_available')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>{t('Description')}</TableCell>
                      <TableCell>{property.description || t('not_available')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>{t('Rent')}</TableCell>
                      <TableCell>{property.rent || t('not_available')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>{t('Property Address')}</TableCell>
                      <TableCell>{property.address || t('not_available')}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              {t('No property details available for this owner.')}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default OwnerDetails;
