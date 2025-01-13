/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
// @mui
import { Stack, Button, Container, Typography, Box, Link, Breadcrumbs, Card , Popover,
  MenuItem,
  IconButton,} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import AddProperty from './AddProperty';
import { IconHome } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import { urls } from 'core/Constant/urls';
import { useEffect } from 'react';
import { getApi } from 'core/apis/api';
import EditProperty from './EditProperty';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteProperty from './DeleteProperty';
import { tokenPayload } from 'helper';


// ----------------------------------------------------------------------

const Property = () => {
  const { t } = useTranslation();
  const [openAdd, setOpenAdd] = useState(false);
  const [propertyData, setPropertydata] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [rowData, setRowData] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);

  const payload = tokenPayload();
  // const company = JSON.parse(localStorage.getItem('companyData'));

   const fetchPropertyData = async () => {
        const response = await getApi(urls.property.propertydata, { id: payload.companyId });
        if (response?.data && Array.isArray(response.data)) {
          console.log(response, "Fetched Company Data");
          setPropertydata(response.data);
        } else {
          console.error("Invalid data format received from API:", response.data);
          setPropertydata([]);
        }
    };

    const handleOpenEditProperty = () => {
      setRowData(currentRow); 
      console.log("currentRow",currentRow);
      setOpenEdit(true);
      handleClose(); 
    };

    
  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };
    
    const handleCloseEditProperty = () => {
      setOpenEdit(false);
    };


    const handleCloseDeleteCompany = () => {
      setOpenDelete(false);
    };
    
    const handleOpenDeleteProperty = () => {
      console.log(rowData,"rowData   1 1  1 1 1 ");
      setRowData(currentRow); 
      setOpenDelete(true);
      handleClose();
    };

    const handleClick = (event, row) => {
      setAnchorEl(event.currentTarget);
      setCurrentRow(row);
    };
  
    useEffect(() => {
      fetchPropertyData();
    }, [openAdd, openEdit, openDelete]);


  const columns = [
    {
      field: 'propertyname',
      headerName: t('propertyname'),
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'description',
      headerName: t('description'),
      flex: 1
    },
    {
      field: 'rent',
      headerName: t('rent'),
      flex: 1
    },
    {
      field: 'address',
      headerName: t('Address'),
      flex: 1
    },
    {
      field: 'zipcode',
      headerName: t('zipcode'),
      flex: 1
    },
    {
      field: 'maplink',
      headerName: t('maplink'),
      flex: 1
    },
    {
      field: 'action',
      headerName: t('Action'),
      flex: 1,
      renderCell: (params) => (
        <>
          <div>
            <IconButton
              aria-describedby={params?.row._id}
              variant="contained"
              onClick={(event) => handleClick(event, params?.row)}
            >
              <MoreVertIcon />
            </IconButton>
            <Popover
              id={params?.row._id}
              open={Boolean(anchorEl) && currentRow?._id === params?.row._id}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <MenuItem onClick={handleOpenEditProperty} disableRipple>
                <EditIcon style={{ marginRight: '8px' }} />
                {t('Edit')}
              </MenuItem>
              <MenuItem onClick={handleOpenDeleteProperty} sx={{ color: 'red' }} disableRipple>
                <DeleteIcon style={{ marginRight: '8px', color: 'red' }} />
                {t('Delete')}
              </MenuItem>
            </Popover>
          </div>
        </>
      ),
    },
  ];

  const breadcrumbs = [
    <Link underline="hover" key="1" color="primary" href="/" >
      <IconHome />
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="primary"
      href="/material-ui/getting-started/installation/"
    >
      {t('Add Property')}
    </Link>,
    <Typography key="3" sx={{ color: 'text.primary' }}>
      {t('Items')}
    </Typography>,
  ];

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  return (
    <>
      <AddProperty open={openAdd} handleClose={handleCloseAdd} />
      <EditProperty open={openEdit} handleClose={handleCloseEditProperty} data={rowData} />
      <DeleteProperty open={openDelete} handleClose={handleCloseDeleteCompany} id={rowData?._id}/>
      
      <Container>

        <Card sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }} >
              {t('Property Management')} <Breadcrumbs separator="›" aria-label="breadcrumb">{breadcrumbs}</Breadcrumbs>
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
