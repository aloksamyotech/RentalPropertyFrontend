/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Card,
  Box,
  Breadcrumbs,
  Popover,
  MenuItem,
  IconButton,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getApi } from 'core/apis/api';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import TableStyle from '../../ui-component/TableStyle';
import Iconify from '../../ui-component/iconify';
import { urls } from 'core/Constant/urls';
import { IconHome } from '@tabler/icons';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddPropertyTypes from './AddPropertyTypes';
import EditPropertyTypes from './EditPropertyType';
import DeletePropertyType from './DeletePropertyType';
import { tokenPayload } from 'helper';

const PropertyTypes = () => {
  const { t } = useTranslation();
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [ownerData, setOwnerData] = useState([]);
  const [currentRow, setCurrentRow] = useState([]);

  const payload = tokenPayload();

  const fetchPropertyData = async () => {
    try {
      const response = await getApi(urls.propertyTypes.getdata, { id: payload._id });
      setOwnerData(response?.data);
    } catch (error) {
      console.error('Error fetching owner data:', error);
      toast.error(t('Failed to fetch owner data!'));
    }
  };

  const handleCloseEditPropertyType = () => {
    setOpenEdit(false);
  };

  const handleCloseDeletePropertyType = () => {
    setOpenDelete(false);
  };

  const handleOpenEditProperty = (currentRow) => {

    setRowData(currentRow);
    setOpenEdit(true);
    handleClose();
  };

  const handleOpenDeleteProperty = (currentRow) => {
    setRowData(currentRow);
    setOpenDelete(true);
    handleClose();
  };


  const handleCloseAdd = () => setOpenAdd(false);

  const handleOpenAdd = () => setOpenAdd(true);

  const handlePopoverOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setRowData(row);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setRowData(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const breadcrumbs = [
    <Link key="home" to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
      <IconHome />
    </Link>,
    <Typography key="owners" color="text.primary">
      {t('Property Types')}
    </Typography>,
  ];

  // DataGrid Columns
  const columns = [
    {
      field: 'serialNo',
      headerName: 'S.No.',
      width: 30,
      renderCell: (params) => {
        const rowIndex = ownerData.findIndex((row) => row._id === params.row._id);
        return rowIndex + 1; 
      }},
    {
      field: 'name',
      headerName: t('Property Type'),
      flex: 1,
      // cellClassName: 'name-column--cell name-column--cell--capitalize',
    },
    {
      field: 'description',
      headerName: t('Description'),
      flex: 1,
    },
    {
      field: 'action',
      headerName: t('Action'),
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            aria-describedby={params.row._id}
            onClick={(event) => handlePopoverOpen(event, params.row)}
          >
            <MoreVertIcon />
          </IconButton>
          <Popover
            open={Boolean(anchorEl) && rowData?._id === params.row._id}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <MenuItem onClick={() => handleOpenEditProperty(params.row)} disableRipple>
              <EditIcon sx={{ mr: 1 }} />
              {t('Edit')}
            </MenuItem>
            <MenuItem
              onClick={() => handleOpenDeleteProperty(params.row)}
              sx={{ color: 'red' }}
              disableRipple
            >
              <DeleteIcon sx={{ mr: 1, color: 'red' }} />
              {t('Delete')}
            </MenuItem>
          </Popover>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchPropertyData();
  }, [openAdd, openEdit,openDelete]);

  return (
    <>
      <AddPropertyTypes open={openAdd} handleClose={handleCloseAdd} />
      <EditPropertyTypes open={openEdit} handleClose={handleCloseEditPropertyType} data={rowData} />
      <DeletePropertyType open={openDelete} handleClose={handleCloseDeletePropertyType} data={rowData}/>
      <Container>
        {/* Breadcrumbs and Header */}  
        <Card sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {t('Property Types')}
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                {breadcrumbs}
              </Breadcrumbs>
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenAdd}
            >
              {t('Add Types')}
            </Button>
          </Stack>
        </Card>

        {/* Data Table */}
        <TableStyle>
          <Box width="100%">
            <Card sx={{ height: '600px', pt: 2 }}>
              <DataGrid
                rows={ownerData}
                columns={columns}
                // checkboxSelection
                getRowId={(row) => row._id || row.id}
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

export default PropertyTypes;
