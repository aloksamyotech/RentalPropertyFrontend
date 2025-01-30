/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Card,
  Box,
  Chip,
  Breadcrumbs,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell,
  DialogContent,
  IconButton,
  Dialog,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import { IconHome } from '@tabler/icons';
import { getApi } from 'core/apis/api';
import { urls } from 'core/Constant/urls';
import { ConsoleView } from 'react-device-detect';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

const imagepath = urls.tenant.image;

const TenantView = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const tenantId = queryParams.get('id');

  const [value, setValue] = useState('1');
  const [tenantData, setTenantData] = useState({});
  const [propertyData, setPropertyData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [tenantDocs, setTenantDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTenantData = async () => {
    try {
      setLoading(true);
      const response = await getApi(urls.tenant.getTenantById, { id: tenantId });
      setTenantData(response?.data?.tenant);
      setPropertyData(response?.data?.booking);
      console.log(response?.data)
      setTenantDocs(response?.data?.tenant?.files);
    } catch (error) {
      console.error('Error fetching tenant data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) {
      fetchTenantData();
    }
  }, [tenantId]);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCloseDialog = () => {
    setSelectedImage(null);
  };

  const handleImageClick = (img) => {
    setSelectedImage(`${imagepath}${img}`);
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
    </Typography>
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
            {loading ? (
              <Typography variant="body2" color="textSecondary">{t('Loading...')}</Typography>
            ) : Object.keys(tenantData).length ? (
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
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Documents')}</TableCell>
                        <TableCell>{tenantData.identityCardType}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Identity No')}</TableCell>
                        <TableCell>{tenantData.identityNo}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('isOccupied')}</TableCell>
                        <TableCell sx={{ color: tenantData.isOccupied ? 'green' : 'red', fontWeight: 'bold' }}>
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
              <Typography variant="body2" color="textSecondary">{t('No tenant details available.')}</Typography>
            )}

            {Array.isArray(propertyData) && propertyData.length ? (
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
              <Typography variant="body2" color="textSecondary">{t('No property details are available for this Tenant.')}</Typography>
            )}
          </TabPanel>

          <TabPanel value="2">
          {tenantDocs && tenantDocs.length > 0 ? (
              <ImageList cols={3} gap={8}>
                {tenantDocs.map((img, index) => (
                  <ImageListItem key={index} onClick={() => handleImageClick(img)}>
                    <img
                      src={`${imagepath}${img}`}
                      srcSet={`${imagepath}${img}`}
                      alt={`Property image ${index + 1}`}
                      loading="lazy"
                      style={{ borderRadius: '8px', cursor: 'pointer' }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            ) : (
              <Typography variant="body2" color="textSecondary">
                {t('No images available.')}
              </Typography>
            )}
          </TabPanel>
        </TabContext>
      </Card>

      {/* Image Popup Dialog */}
      <Dialog open={Boolean(selectedImage)} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogContent sx={{ position: 'relative' }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Selected Property"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default TenantView;
