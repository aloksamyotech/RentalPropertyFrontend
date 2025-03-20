/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Stack, Button, Container, Typography, Box, Breadcrumbs, Card, Popover, MenuItem, IconButton } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate, useLocation } from 'react-router';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
// import AddProperty from './AddProperty';
import { IconHome } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { urls } from 'core/Constant/urls';
import AddServiceProvider from './AddServiceProvider';
import { getApi } from 'core/apis/api';
// import EditProperty from './EditProperty';
// import DeleteProperty from './DeleteProperty';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { tokenPayload } from 'helper';
import EditServiceProvider from './EditSerivceProvider';
import DeleteServiceProvider from './DeleteServiceProvider';
import { Link } from 'react-router-dom';

const payload = tokenPayload();
const userRole = payload?.role;

const ServiceProvider = () => {
  const { t } = useTranslation();  // This will enable the translation functionality
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [openAdd, setOpenAdd] = useState(false);
  const [serviceData, setServiceData] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState([]);

  const fetchServiceData = async () => {
    try {
      const response = await getApi(urls.serviceProvider.getAll, { id: payload.companyId });

      if (response?.data) {
        setServiceData(response.data);
      } else {
        setServiceData([]);
      }
    } catch (error) {
      setServiceData([]);
    }
  };

  useEffect(() => {
    fetchServiceData();
  }, [openAdd, openDelete, openEdit]);

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const handleOpenEditProperty = () => {
    setRowData(currentRow);
    setOpenEdit(true);
    handleClose();
  };

  const handleOpenDeleteProperty = () => {
    setRowData(currentRow);
    setOpenDelete(true);
    handleClose();
  };

  const handleOpenView = () => {
    navigate(`/dashboard/property/view?id=${currentRow._id}`);
  };

  const handleCloseEditProperty = () => setOpenEdit(false);
  const handleCloseDeleteProperty = () => setOpenDelete(false);

  const columns = [
    {
      field: 'serialNo',
      headerName: 'S.No.',
      width: 30,
      renderCell: (params) => {
        const rowIndex = serviceData.findIndex((row) => row._id === params.row._id);
        return rowIndex + 1; 
      },
    },
    {
      field: 'name',
      headerName: t('Service Provider Name'),  
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'phoneNo',
      headerName: t('Phone No'),  
      flex: 1
    },
    {
      field: 'workType',
      headerName: t('Work Type'), 
      flex: 1
    },
    {
      field: 'address',
      headerName: t('Address'), 
      flex: 1
    }
  ];

  if (userRole !== 'tenant') {
    columns.push({
      field: 'action',
      headerName: t('Action'),  
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton aria-describedby={params?.row._id} onClick={(event) => handleClick(event, params?.row)}>
            <MoreVertIcon />
          </IconButton>
          <Popover
            id={params?.row._id}
            open={Boolean(anchorEl) && currentRow?._id === params?.row._id}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
          >
            <MenuItem onClick={handleOpenEditProperty}>
              <EditIcon style={{ marginRight: '8px' }} />
              {t('Edit')} 
            </MenuItem>
            <MenuItem onClick={handleOpenDeleteProperty} sx={{ color: 'red' }}>
              <DeleteIcon style={{ marginRight: '8px', color: 'red' }} />
              {t('Delete')}  
            </MenuItem>
          </Popover>
        </>
      )
    });
  }

  const breadcrumbs = [
    <Link key="home" to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
      <IconHome />
    </Link>,
    <Typography key="serviceprovider" to="/dashboard/serviceprovider" color="text.primary">
      {t('Service Providers')}
    </Typography>
  ];

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  return (
    <>
      <AddServiceProvider open={openAdd} handleClose={handleCloseAdd} />
      <EditServiceProvider open={openEdit} handleClose={handleCloseEditProperty} data={rowData} />
      <DeleteServiceProvider open={openDelete} handleClose={handleCloseDeleteProperty} id={rowData?._id} />

      <Container>
        <Card sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {t('Service Providers')}
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                {breadcrumbs}
              </Breadcrumbs>
            </Typography>

            {userRole !== "tenant" && (
  <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
    {t('Add Service Provider')}
  </Button>
)}
          </Stack>
        </Card>

        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              <DataGrid
                rows={serviceData}
                columns={columns}
                // checkboxSelection
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

export default ServiceProvider;
