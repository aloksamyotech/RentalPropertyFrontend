/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Box,
  Card,
  Breadcrumbs,
  Popover,
  MenuItem,
  IconButton,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { IconHome } from '@tabler/icons';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import Addtenents from './AddTenants';
import { useTranslation } from 'react-i18next';
import { getApi } from 'core/apis/api';
import { urls } from 'core/Constant/urls';
import React from 'react';
import EditTenant from './EditTenant';
import DeleteTenant from './DeleteTenant';
import { tokenPayload } from 'helper';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import { useNavigate } from 'react-router';
import TabList from '@mui/lab/TabList';
import BulkUploadTenant from './BulkUpload';

const Tenants = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openBulkUploadDialog, setOpenBulkUploadDialog] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [tenantData, setTenantData] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [value, setValue] = useState('1');

  const payload = tokenPayload();
  const userRole = payload.role;

  const fetchTenantData = async () => {
    try {
      const response = await getApi(urls.tenant.getAllTenants, { id: payload.companyId });
      setTenantData(response.data);
    } catch (error) {
      setTenantData([]);
    }
  };

  const fetchMyTenantData = async () => {
    try {
      const response = await getApi(urls.tenant.getMyTenants, { id: payload._id });
      setTenantData(response.data);
    } catch (error) {
      setTenantData([]);
    }
  };

  const bulkDialogOpen = () => {
    setOpenBulkUploadDialog(true);
    // setRowData(currentRow); 
  };
  // Handle closing the bulk upload dialog
  const handleBulkDialogClose = () => {
    setOpenBulkUploadDialog(false); 
  };

  useEffect(() => {
    if (value === '1') {
      fetchMyTenantData();
    } else if (value === '2' && userRole === 'companyAdmin') {
      fetchTenantData();
    }
  }, [value, openAdd, openEdit, openDelete, userRole]);

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpenEditTenant = () => {
    setRowData(currentRow);
    setOpenEdit(true);
    handleClose();
  };

  const handleCloseEditTenant = () => {
    setOpenEdit(false);
  };

  const handleOpenDeleteTenantDialog = () => {
    setRowData(currentRow);
    setOpenDelete(true);
    handleClose();
  };

  const handleCloseDeleteTenantDialog = () => {
    setOpenDelete(false);
  };

  const handleOpenView = () => {
    navigate(`/dashboard/tenant/view?id=${currentRow._id}`);
  };

  const handleChangePassword =()=>{
    navigate(`/dashboard/tenant/changepassword?id=${currentRow._id}`);
  }

  const columns = [
    {
      field: 'serialNo',
      headerName: 'S.No.',
      width: 30,
      renderCell: (params) => {
        const rowIndex = tenantData.findIndex((row) => row._id === params.row._id);
        return rowIndex + 1;
      },
    },
    {
      field: 'tenantName',
      headerName: t('Tenant Name'),
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
       renderCell: (params) => (
                          <Button
                            variant="text"
                            color="primary"
                            onClick={() =>
                              navigate(`/dashboard/tenant/view?id=${params.row._id}`) 
            }
          >
          {params.row.tenantName}  
        </Button>
      ),
      
    },
    {
      field: 'email',
      headerName: t('Email'),
      flex: 1,
      cellClassName: 'name-column--cell--capitalize',
    },
    {
      field: 'phoneno',
      headerName: t('Phone No.'),
      flex: 1,
    },
    {
      field: 'Creater',
      headerName: t('Created By'),
      flex: 1,
    },
    {
      field: 'isOccupied',
      headerName: t('Occupied/unOccupied'),
      flex: 1,
      renderCell: (params) => (
        <Typography
          style={{
            color: params.row.isOccupied ? 'green' : 'blue',
            fontWeight: 'bold',
          }}
        >
          {params.row.isOccupied ? t('Occupied') : t('Not Occupied')}
        </Typography>
      ),
    },
    {
      field: 'action',
      headerName: t('Action'),
      flex: 1,
      renderCell: (params) => (
        <>
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
            <MenuItem onClick={handleOpenEditTenant} disableRipple>
              <EditIcon style={{ marginRight: '8px' }} />
              {t('Edit')}
            </MenuItem>
            <MenuItem onClick={handleOpenView}>
              <VisibilityIcon style={{ marginRight: '8px', color: 'green' }} />
              {t('View')}
            </MenuItem>
            <MenuItem
              onClick={handleOpenDeleteTenantDialog}
              sx={{ color: 'red' }}
              disableRipple
            >
              <DeleteIcon style={{ marginRight: '8px', color: 'red' }} />
              {t('Delete')}
            </MenuItem>
            <MenuItem onClick={handleChangePassword}>
              <ChangeCircleIcon style={{ marginRight: '8px', color: 'green' }} />
              {t('Change Password')}
            </MenuItem>
          </Popover>
        </>
      ),
    },
  ];

  const breadcrumbs = [
    <Link key="home" to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
      <IconHome />
    </Link>,
    <Typography key="tenant" color="text.primary">
      {t('Tenant Management')}
    </Typography>,
  ];

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  return (
    <>
      <Addtenents open={openAdd} handleClose={handleCloseAdd} />
      <EditTenant open={openEdit} handleClose={handleCloseEditTenant} data={rowData} />
      <DeleteTenant open={openDelete} handleClose={handleCloseDeleteTenantDialog} id={rowData?._id} />
      <BulkUploadTenant
  open={openBulkUploadDialog}
  data={payload} 
  onClose={handleBulkDialogClose}
/>
      <Container>
        <Card sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} width="100%">
  <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    {t('Tenants Management')}
    <Breadcrumbs separator="›" aria-label="breadcrumb">
      {breadcrumbs}
    </Breadcrumbs>
  </Typography>
  <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
      {t('Add Tenants')}
    </Button>
    <Button variant="contained" color="primary" onClick={bulkDialogOpen}>
      {t('Bulk Upload Tenants')}
    </Button>
  </Box>
</Stack>
        </Card>
        <TableStyle>
  <Box width="100%">
    <Card style={{ paddingTop: '15px' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="Tenant tabs">
            <Tab label={t('My Tenants')} value="1" />
            {userRole === 'companyAdmin' && <Tab label={t('All Tenants')} value="2" />}
          </TabList>
        </Box>
        <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
          <TabPanel value="1" style={{ flex: 1, overflow: 'hidden' }}>
            <DataGrid
              rows={tenantData}
              columns={columns}
              getRowId={(row) => row._id || row.id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{ toolbar: { showQuickFilter: true } }}
              sx={{
                '& .MuiDataGrid-virtualScroller': {
                  overflow: 'auto',
                },
                '& .MuiDataGrid-main': {
                  height: '100%',
                },
              }}
            />
          </TabPanel>
          {userRole === 'companyAdmin' && (
            <TabPanel value="2" style={{ flex: 1, overflow: 'hidden' }}>
              <DataGrid
                rows={tenantData}
                columns={columns}
                getRowId={(row) => row._id || row.id}
                slots={{ toolbar: GridToolbar }}
                slotProps={{ toolbar: { showQuickFilter: true } }}
                sx={{
                  '& .MuiDataGrid-virtualScroller': {
                    overflow: 'auto',
                  },
                  '& .MuiDataGrid-main': {
                    height: '100%',
                  },
                }}
              />
            </TabPanel>
          )}
        </div>
      </TabContext>
    </Card>
  </Box>
</TableStyle>
      </Container>
    </>
  );
};

export default Tenants;