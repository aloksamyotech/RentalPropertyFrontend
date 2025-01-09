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
  Link,
  Breadcrumbs,
  Popover,
  MenuItem,
  IconButton,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { IconHome } from '@tabler/icons';
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

// ----------------------------------------------------------------------

const Tenents = () => {
  const { t } = useTranslation();
  const [openAdd, setOpenAdd] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState([]); // For storing the selected row data
  const [tenantData, setTenantdata] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [rowData, setRowData] = useState();


  // const company = JSON.parse(localStorage.getItem('companyData'));
  const payload = tokenPayload();

  const fetchTenantData = async () => {
    try {
      const response = await getApi(urls.tenant.tenantdata, { id: payload.companyId });
      console.log(payload, "Payload");
      console.log(response.data, "Fetched Tenant Data");
  
      if (response?.data?.data && Array.isArray(response.data.data)) {
        setTenantdata(response.data.data); // Ensure tenantData is an array
      } else {
        console.error("Invalid data format received from API:", response.data);
        setTenantdata([]); // Default to an empty array if data is invalid
      }
    } catch (error) {
      console.error("Error fetching tenant data:", error);
      setTenantdata([]); // Default to an empty array on error
    }
  };
  
  useEffect(() => {
    fetchTenantData();
  }, [openAdd, openEdit, openDelete]);

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const handleOpenEditTenant = () => {
    setRowData(currentRow); 
    console.log("currentRow",currentRow);
    setOpenEdit(true);
    handleClose(); 
  };
  
  const handleCloseEditTenant = () => {
    setOpenEdit(false);
  };

  const handleOpenDeleteTenantDialog = () => {
    console.log(rowData,"rowData   1 1  1 1 1 ");
    setRowData(currentRow); 
    setOpenDelete(true);
    handleClose();
  };

  const handleCloseDeleteTenantDialog = () => {
    setOpenDelete(false);
  };

  const columns = [
    {
      field: 'tenantName',
      headerName: t('Tenants Name'),
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
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
      field: 'address',
      headerName: t('Address'),
      flex: 1,
    },
    {
      field: 'emergencyNo',
      headerName: t('Emergency No.'),
      flex: 1,
    },
    {
      field: 'action',
      headerName: t('Action'),
      flex: 1,
      renderCell: (params) => (
        <>
          <div key={`action-div-${params.row._id}`}>
            <IconButton
              key={`icon-button-${params.row._id}`}
              aria-describedby={params?.row._id}
              variant="contained"
              onClick={(event) => handleClick(event, params?.row)}
            >
              <MoreVertIcon />
            </IconButton>
            <Popover
              key={`popover-${params.row._id}`}
              id={params?.row._id}
              open={Boolean(anchorEl) && currentRow?._id === params?.row._id}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <MenuItem key={`edit-${params.row._id}`} onClick={handleOpenEditTenant} disableRipple>
                <EditIcon style={{ marginRight: '8px' }} />
                {t('Edit')}
              </MenuItem>
              <MenuItem
                key={`delete-${params.row._id}`}
                onClick={handleOpenDeleteTenantDialog}
                sx={{ color: 'red' }}
                disableRipple
              >
                <DeleteIcon style={{ marginRight: '8px', color: 'red' }} />
                {t('Delete')}
              </MenuItem>
            </Popover>
          </div>
        </>
      ),
    }
    
  ];

  const breadcrumbs = [
    <Link underline="hover" key="home" color="primary" href="/">
      <IconHome />
    </Link>,
    <Link underline="hover" key="add-tenants" color="primary">
      {t('Add Tenants')}
    </Link>,
    <Typography key="items" sx={{ color: 'text.primary' }}>
      {t('Items')}
    </Typography>,
  ];
  
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  return (
    <>
      <Addtenents open={openAdd} handleClose={handleCloseAdd} />
      <EditTenant open={openEdit} handleClose={handleCloseEditTenant} data={rowData} /> 
      <DeleteTenant open={openDelete} handleClose={handleCloseDeleteTenantDialog} id={rowData?._id} />
      <Container>
        <Card sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {t('Tenants Management')}
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                {breadcrumbs}
              </Breadcrumbs>
            </Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              {t('Add Tenants')}
            </Button>
          </Stack>
        </Card>
        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
            <DataGrid
            rows={tenantData}
            columns={columns}
            checkboxSelection
             getRowId={(row) => row._id} 
            slots={{ toolbar: GridToolbar }}
            slotProps={{ toolbar: { showQuickFilter: true } }}
          />
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default Tenents;
