import React, { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Card,
  Box,
  Breadcrumbs,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import { IconHome } from '@tabler/icons';
import { getApi } from 'core/apis/api';
import { urls } from 'core/Constant/urls';

const TenantView = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const tenantId = queryParams.get('id');

  const [value, setValue] = useState('1');
  const [tenantData, setTenantData] = useState({});
  const [propertyData, setPropertyData] = useState([]);
  const [tenantDocs, setTenantDocs] = useState([]);

  const fetchTenantData = async () => {
    try {
      const response = await getApi(urls.tenant.getTenantById, { id: tenantId });
      setTenantData(response.data.tenant);
      setPropertyData(response.data.booking);
      setTenantDocs(response.data.images);
    } catch (error) {
      console.error('Error fetching tenant data:', error);
    }
  };

  useEffect(() => {
    fetchTenantData();
  }, [tenantId]);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const breadcrumbs = [
    <Link key="home" to="/dashboard/default" style={{ color: 'inherit' }}>
      <IconHome />
    </Link>,
    <Link key="tenant-management" to="/dashboard/tenents" style={{ color: 'inherit' }}>
      {t('Tenant Management')}
    </Link>,
    <Typography key="view" color="text.primary">
      {t('View')}
    </Typography>,
  ];

  return (
    <Container>
      <Card sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {t('Tenant Details')}
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              {breadcrumbs}
            </Breadcrumbs>
          </Typography>
        </Stack>
      </Card>

      <Card sx={{ p: 2, mb: 2 }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleTabChange} aria-label="Tenant tabs">
              <Tab label={t('Tenant Details')} value="1" />
              <Tab label={t('Tenant Documents')} value="2" />
            </TabList>
          </Box>

          <TabPanel value="1">
            {Object.keys(tenantData).length ? (
              <Grid container spacing={3}>
                <Grid item sm={12}>
                  <Table sx={{ width: '100%' }}>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>{t('Tenant Name:')}</TableCell>
                        <TableCell sx={{ width: '60%' }}>{tenantData.tenantName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Email Id')}</TableCell>
                        <TableCell>{tenantData.email}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Mobile No.')}</TableCell>
                        <TableCell>{tenantData.phoneno}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Emergency No.')}</TableCell>
                        <TableCell>{tenantData.emergencyNo}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Documents')}</TableCell>
                        <TableCell>{tenantData.identityCardType}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Identity No')}</TableCell>
                        <TableCell>{tenantData.identityNo}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('isOccupied')}</TableCell>
                        <TableCell
                          sx={{
                            color: tenantData.isOccupied ? 'green' : 'red',
                            fontWeight: 'bold',
                          }}
                        >
                          {tenantData.isOccupied ? 'Yes' : 'No'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Address')}</TableCell>
                        <TableCell>{tenantData.address}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
            ) : (
              <Typography variant="body2" color="textSecondary">
                {t('No tenant details available.')}
              </Typography>
            )}

            {/* Map over property data */}
            {propertyData.length ? (
              propertyData.map((property, index) => (
                <Grid container spacing={3} key={index}>
                  <Grid item sm={12}>
                    <Table sx={{ width: '100%' }}>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>{t('Property Name:')}</TableCell>
                          <TableCell sx={{ width: '60%' }}>{property.propertyName}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>{t('Description')}</TableCell>
                          <TableCell>{property.description}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>{t('Rent')}</TableCell>
                          <TableCell>{property.rent}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>{t('Property Address')}</TableCell>
                          <TableCell>{property.address}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Grid>
                </Grid>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                {t('No property details is available for this Tenant.')}
              </Typography>
            )}
          </TabPanel>

          <TabPanel value="2">
          {tenantData.length ? (
              tenantData.map((tenant, index) => (
                <Grid container spacing={3} key={index}>
                  <Grid item sm={12}>
                    <Table sx={{ width: '100%' }}>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>{t('Property Name:')}</TableCell>
                          <TableCell sx={{ width: '60%' }}>{tenant.propertyName}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>{t('Description')}</TableCell>
                          <TableCell>{property.description}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>{t('Rent')}</TableCell>
                          <TableCell>{property.rent}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>{t('Property Address')}</TableCell>
                          <TableCell>{property.address}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Grid>
                </Grid>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                {t('No property details is available for this Tenant.')}
              </Typography>
            )}
          </TabPanel>
        </TabContext>
      </Card>
    </Container>
  );
};

export default TenantView;
