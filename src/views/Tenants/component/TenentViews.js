/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-undef */
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
  ListItemIcon,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CardContent,
    Popover,
  DialogContent,
  List,
    MenuItem,
  ListItem,
  IconButton,
  
  ListItemText,

  Dialog,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';

import DescriptionIcon from '@mui/icons-material/Description';
import TabContext from '@mui/lab/TabContext';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
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
import AddDocumentDialog from './AddDocument';
import TableStyle from '../../../ui-component/TableStyle';


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
  const [anchorEl, setAnchorEl] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
  
    const [rowData, setRowData] = useState(null);
  
  const [tenantDocs, setTenantDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [document, setDocument] = useState(false);
    const [currentRow, setCurrentRow] = useState([]);
  
  
  const fetchTenantData = async () => {
    try {
      setLoading(true);
      const response = await getApi(urls.tenant.getTenantById, { id: tenantId });
      setTenantData(response?.data?.tenant);
      setPropertyData(response?.data?.booking);
      setTenantDocs(response?.data?.tenant?.files);
      // setTenantDocs(response?.data?.tenant)
    } catch (error) {
      console.error('Error fetching tenant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentData = async () => {
    try {
      const response = await getApi(urls.tenant.getAllDocByTenantId, { id: tenantId });
      setDocument(response.data);
    } catch (error) {
      setDocument([]);
    }
  };
  useEffect(() => {
    if (tenantId) {
      fetchDocumentData();
    }
  }, [tenantId,openAdd ]);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
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

  const handleOpenDeleteDialog = () => {
    setRowData(currentRow);
    setOpenDelete(true);
    handleClose();
  };

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  
 const columns = [
  {
    field: 'documentName',
    headerName: t('Document Name'),
    flex: 1,
    cellClassName: 'name-column--cell name-column--cell--capitalize',
  },
  {
    field: 'url',
    headerName: t('URL'),
    flex: 1,
    renderCell: (params) => (
      <>
        <a 
          href={urls?.tenant?.image+params?.row?.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ textDecoration: 'none', color: 'blue' }}
        >
          {t('View Document')}
        </a>
        <IconButton
          aria-describedby={params?.row._id}
          onClick={(event) => handleClick(event, params?.row)}
        >
          <MoreVertIcon />
        </IconButton>
        <Popover
          open={Boolean(anchorEl) && currentRow?._id === params?.row._id}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          {/* <MenuItem onClick={handleOpenEditTenant} disableRipple>
            <EditIcon style={{ marginRight: '8px' }} />
            {t('Edit')}
          </MenuItem>
          <MenuItem onClick={() => window.open(params.row.url, '_blank')} >
            <VisibilityIcon style={{ marginRight: '8px', color: 'green' }} />
            {t('View')}
          </MenuItem> */}
          <MenuItem
            onClick={handleOpenDeleteDialog}
            sx={{ color: 'red' }}
            disableRipple
          >
            <DeleteIcon style={{ marginRight: '8px', color: 'red' }} />
            {t('Delete')}
          </MenuItem>
        </Popover>
      </>
    ),
  },
];



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
  <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
    {t('Loading...')}
  </Typography>
) : Object.keys(tenantData).length ? (
  <Grid container spacing={3} sx={{ mt: 2 }}>
    <Grid item sm={12}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
          {t('Tenant Details')}
        </Typography>
        <Table sx={{ width: '100%' }}>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', width: '20%', color: 'text.secondary' }}>{t('Tenant Name:')}</TableCell>
              <TableCell sx={{ width: '60%', color: 'text.primary' }}>{tenantData.tenantName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{t('Email Id')}</TableCell>
              <TableCell sx={{ color: 'text.primary' }}>{tenantData.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{t('Mobile No.')}</TableCell>
              <TableCell sx={{ color: 'text.primary' }}>{tenantData.phoneno}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{t('Documents')}</TableCell>
              <TableCell sx={{ color: 'text.primary' }}>{tenantData.identityCardType}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{t('Identity No')}</TableCell>
              <TableCell sx={{ color: 'text.primary' }}>{tenantData.identityNo}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{t('isOccupied')}</TableCell>
              <TableCell sx={{ color: tenantData.isOccupied ? 'success.main' : 'error.main', fontWeight: 'bold' }}>
                {tenantData.isOccupied ? 'Yes' : 'No'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{t('Address')}</TableCell>
              <TableCell sx={{ color: 'text.primary' }}>{tenantData.address}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Grid>
  </Grid>
) : (
  <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
    {t('No tenant details available.')}
  </Typography>
)}

{Array.isArray(propertyData) && propertyData.length ? (
  propertyData.map((property, index) => (
    <Grid container spacing={3} key={index} sx={{ mt: 2 }}>
      <Grid item sm={12}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            {t('Property Details')}
          </Typography>
          <Table sx={{ width: '100%' }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', width: '20%', color: 'text.secondary' }}>{t('Property Name:')}</TableCell>
                <TableCell sx={{ width: '60%', color: 'text.primary' }}>{property.propertyName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{t('Description')}</TableCell>
                <TableCell sx={{ color: 'text.primary' }}>{property.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{t('Rent')}</TableCell>
                <TableCell sx={{ color: 'text.primary' }}>{property.rent}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{t('Property Address')}</TableCell>
                <TableCell sx={{ color: 'text.primary' }}>{property.address}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  ))
) : (
  <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
    {t('No property details are available for this Tenant.')}
  </Typography>
)}
</TabPanel>
          <TabPanel value="2">
          <Box width="100%" sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <AddDocumentDialog open={openAdd} handleClose={handleCloseAdd} />
                     <Button variant="contained"  onClick={handleOpenAdd}>
                                {t('Add Documents')}
                      </Button>
                      </Box >
                      <TableStyle>
          <Box width="100%">
            <Card sx={{ height: '600px', pt: 2 }}>
              <DataGrid
                rows={document}
                columns={columns}
                checkboxSelection
                getRowId={(row) => row._id || row.id}
                slots={{ toolbar: GridToolbar }}
                slotProps={{ toolbar: { showQuickFilter: true } }}
              />
            </Card>
          </Box>
        </TableStyle>
          {/* {tenantDocs && tenantDocs.length > 0 ? (
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
            )} */}
{/* 
<CardContent>
                      <List>
                        {tenantDocs.map((item, index) => (
                          <ListItem
                            key={index}
                            button
                            onClick={() => window.open(urls.tenant.image + item.url, '_blank')}
                            sx={{
                              borderBottom: '1px solid',
                              borderColor: 'divider'
                            }}
                          >
                            <ListItemIcon>
                              <DescriptionIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={item.name} />
                            <ListItemText secondary={item.type} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent> */}
          </TabPanel>
        </TabContext>
      </Card>

      {/* Image Popup Dialog */}
      {/* <Dialog open={Boolean(selectedImage)} onClose={handleCloseDialog} maxWidth="md" fullWidth>
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
      </Dialog> */}
    </Container>
  );
};

export default TenantView;
