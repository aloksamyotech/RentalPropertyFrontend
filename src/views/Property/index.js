/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Stack, Button, Container, Typography, Box, Link, Breadcrumbs, Card, Popover, MenuItem, IconButton } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate , useLocation} from 'react-router';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import AddProperty from './AddProperty';
import { IconHome } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { urls } from 'core/Constant/urls';
import { getApi } from 'core/apis/api';
import EditProperty from './EditProperty';
import DeleteProperty from './DeleteProperty';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { tokenPayload } from 'helper';


const Property = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
  const [openAdd, setOpenAdd] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState([]);
console.log(currentRow,"currentrow")
  const payload = tokenPayload();

  const fetchPropertyData = async () => {
    try {
      const response = await getApi(urls.property.propertyDataAll, { id: payload.companyId });
      if (response?.data) {
        setPropertyData(response.data);
      } else {
        console.error('Failed to fetch property data.');
        setPropertyData([]);
      }
    } catch (error) {
      console.error('Error fetching property data:', error);
      setPropertyData([]);
    }
  };

  useEffect(() => {
    fetchPropertyData();
  }, [openAdd,openDelete,openEdit]);

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
      field: 'propertyname',
      headerName: t('Property Name'),
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'description',
      headerName: t('Description'),
      flex: 1
    },
    {
      field: 'rent',
      headerName: t('Rent'),
      flex: 1
    },
    {
      field: 'address',
      headerName: t('Address'),
      flex: 1
    },
    {
      field: 'zipcode',
      headerName: t('Zip Code'),
      flex: 1
    },
    {
      field: 'isVacant',
      headerName: t('Vacant'),
      flex: 1,
      renderCell: (params) => (
        <Typography
          style={{
            color: params.row.isVacant ? 'red' : 'green',
            fontWeight: 'bold'
          }}
        >
          {params.row.isVacant ? t('Vacant') : t('Occupied')}
        </Typography>
      )
    },
    {
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
            <MenuItem onClick={handleOpenView} >
              <VisibilityIcon style={{ marginRight: '8px', color: 'green' }} />
              {t('view')}
            </MenuItem>
            <MenuItem onClick={handleOpenDeleteProperty} sx={{ color: 'red' }}>
              <DeleteIcon style={{ marginRight: '8px', color: 'red' }} />
              {t('Delete')}
            </MenuItem>
          </Popover>
        </>
      )
    }
  ];

  const breadcrumbs = [
    <Link underline="hover" key="1" color="primary" href="/">
      <IconHome />
    </Link>,
    <Link underline="hover" key="2" color="primary">
      {t('Add Property')}
    </Link>,
    <Typography key="3" sx={{ color: 'text.primary' }}>
      {t('Items')}
    </Typography>
  ];

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  return (
    <>
      <AddProperty open={openAdd} handleClose={handleCloseAdd} />
      <EditProperty open={openEdit} handleClose={handleCloseEditProperty} data={rowData} />
      <DeleteProperty open={openDelete} handleClose={handleCloseDeleteProperty} id={rowData?._id} />

      <Container>
        <Card sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {t('Property Management')}
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                {breadcrumbs}
              </Breadcrumbs>
            </Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              {t('Add Property')}
            </Button>
          </Stack>
        </Card>

        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              <DataGrid
                rows={propertyData}
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

export default Property;
