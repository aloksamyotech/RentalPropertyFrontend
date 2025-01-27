/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState, useEffect } from 'react';
import React from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Card,
  Box,
  Breadcrumbs,
  Grid,
} from '@mui/material';
import { Table, TableBody, TableRow, TableCell } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { getApi } from 'core/apis/api';
import Tab from '@mui/material/Tab';
import { useTranslation } from 'react-i18next';
import { urls } from 'core/Constant/urls';
import { useLocation, Link } from 'react-router-dom';
import { IconHome } from '@tabler/icons';

const TenentView = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const tenantId = queryParams.get('id');

  const [value, setValue] = useState('1');
  const [tenantData, setTenantData] = useState({});
  const [tenantDocs, setTenantDocs] = useState([]);

  const fetchTenantData = async () => {
    try {
      const response = await getApi(urls.tenant.getTenantById, { id: tenantId });
      setTenantData(response.data);
      setTenantDocs(response.data.images);
    } catch (error) {
      console.error('Error fetching property data:', error);
    }
  };

  useEffect(() => {
    fetchTenantData();
  }, [tenantId]);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const breadcrumbs = [
    <Link underline="hover" key="home" to="/dashboard" style={{ color: 'inherit' }}>
      <IconHome />
    </Link>,
    <Link underline="hover" key="property-management" to="/dashboard/tenents" style={{ color: 'inherit' }}>
      {t('Tenant Management')}
    </Link>,
    <Typography key="view" color="text.primary">
      {t('View')}
    </Typography>
  ];

  return (
    <Container>

      <Card sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {t('Tenants Details')}
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              {breadcrumbs}
            </Breadcrumbs>
          </Typography>
        </Stack>
      </Card>

   
      <Card sx={{ p: 2, mb: 2 }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleTabChange} aria-label="Property tabs">
              <Tab label={t('Tenant Details')} value="1" />
              <Tab label={t('Tenant Document')} value="2" />
            </TabList>
          </Box>

     
          <TabPanel value="1">
            {Object.keys(tenantData).length ? (
              <Grid container spacing={3}>
                <Grid item sm={12}>
                  <Table sx={{ width: '100%' }}>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>{t('Property Name:')}</TableCell>
                        <TableCell sx={{ width: '60%' }}>{tenantData.tenantname}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Property Type')}</TableCell>
                        <TableCell>{tenantData.name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Property Type Description')}</TableCell>
                        <TableCell>{tenantData.description}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Description')}</TableCell>
                        <TableCell>{tenantData.description}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Address')}</TableCell>
                        <TableCell>{tenantData.address}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Rent')}</TableCell>
                        <TableCell>{tenantData.rent}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Zipcode')}</TableCell>
                        <TableCell>{tenantData.zipcode}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Google Map Location')}</TableCell>
                        <TableCell>
                          <a href={tenantData.maplink} target="_blank" rel="noopener noreferrer">
                            {t('View on Map')}
                          </a>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
            ) : (
              <Typography variant="body2" color="textSecondary">
                {t('No  Tenants details available.')}
              </Typography>
            )}
          </TabPanel>

          <TabPanel value="2">
            {tenantDocs.length > 0 ? (
              <Grid container spacing={2}>
                {tenantDocs.map((image, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <img
                      src={image}
                      alt={`Tenant Document ${index + 1}`}
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="textSecondary">
                {t('No Do available for this .')}
              </Typography>
            )}
          </TabPanel>
        </TabContext>
      </Card>
    </Container>
  );
};

export default TenentView;
