/* eslint-disable prettier/prettier */
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
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Table, TableBody, TableRow, TableCell } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Close } from '@mui/icons-material';
import { getApi } from 'core/apis/api';
import Tab from '@mui/material/Tab';
import { useTranslation } from 'react-i18next';
import { urls } from 'core/Constant/urls';
import { useLocation, Link } from 'react-router-dom';
import { IconHome } from '@tabler/icons';

const PropertyView = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const propertyId = queryParams.get('id');

  const [value, setValue] = useState('1');
  const [propertyData, setPropertyData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [propertyImages, setPropertyImages] = useState([]);
  const [ownerData, setOwnerData] = useState({});
  const [typeData, setTypeData] = useState({});

  const imagepath = urls.property.image;

  const fetchPropertyData = async () => {
      const response = await getApi(urls.property.getPropertyById, { id: propertyId });
      setPropertyData(response.data );
      setOwnerData(response.data?.ownerId);
      setTypeData(response.data?.typeId );
      setPropertyImages(response.data?.files );
   
  };

  const handleCloseDialog = () => {
    setSelectedImage(null);
  };

  const handleImageClick = (img) => {
    setSelectedImage(`${imagepath}${img}`);
  };

  useEffect(() => {
    if (propertyId) {
      fetchPropertyData();
    }
  }, [propertyId]);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const breadcrumbs = [
    <Link underline="hover" key="home" to="/dashboard" style={{ color: 'inherit' }}>
      <IconHome />
    </Link>,
    <Link underline="hover" key="property-management" to="/dashboard/property" style={{ color: 'inherit' }}>
      {t('Property Management')}
    </Link>,
    <Typography key="view" color="text.primary">
      {t('View')}
    </Typography>,
  ];

  

  return (
    <Container>
      {/* Breadcrumb and Heading */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {t('Property Details')}
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
              <Tab label={t('Property Details')} value="1" />
              <Tab label={t('Property Images')} value="2" />
            </TabList>
          </Box>

          <TabPanel value="1">
            {Object.keys(propertyData).length ? (
              <Grid container spacing={3}>
                <Grid item sm={12}>
                  <Table sx={{ width: '100%' }}>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>{t('Property Name:')}</TableCell>
                        <TableCell sx={{ width: '60%' }}>{propertyData.propertyname}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Property Type')}</TableCell>
                        <TableCell>{typeData?.name || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Property Type Description')}</TableCell>
                        <TableCell>{typeData?.description || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Description')}</TableCell>
                        <TableCell>{propertyData.description}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Address')}</TableCell>
                        <TableCell>{propertyData.address}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Rent')}</TableCell>
                        <TableCell>{propertyData.rent}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Zipcode')}</TableCell>
                        <TableCell>{propertyData.zipcode}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Google Map Location')}</TableCell>
                        <TableCell>
                          <a href={propertyData.maplink} target="_blank" rel="noopener noreferrer">
                            {t('View on Map')}
                          </a>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Owner Name')}</TableCell>
                        <TableCell>{ownerData?.ownerName || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Owner Address')}</TableCell>
                        <TableCell>{ownerData?.address || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Owner Email')}</TableCell>
                        <TableCell>{ownerData?.email || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('Owner Phone No.')}</TableCell>
                        <TableCell>{ownerData?.phoneNo || 'N/A'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
            ) : (
              <Typography variant="body2" color="textSecondary">
                {t('No property details available.')}
              </Typography>
            )}
          </TabPanel>

          <TabPanel value="2">
            {propertyImages && propertyImages.length > 0 ? (
              <ImageList cols={3} gap={8}>
                {propertyImages.map((img, index) => (
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
                borderRadius: '8px'
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default PropertyView;