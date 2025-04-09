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
import { useNavigate , useLocation} from 'react-router';
import { getApi } from 'core/apis/api';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import AddOwner from './AddOwner';
import EditOwner from './EditOwner';
import DeleteOwner from './DeleteOwner';
import TableStyle from '../../ui-component/TableStyle';
import Iconify from '../../ui-component/iconify';
import { urls } from 'core/Constant/urls';
import { IconHome } from '@tabler/icons';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { tokenPayload } from 'helper';
import BulkUploadOwner from './BulkUploadOwner';


const Owner = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openBulkUploadDialog, setOpenBulkUploadDialog] = useState(false);
  const [dialogState, setDialogState] = useState({ add: false, edit: false, delete: false });
  const [rowData, setRowData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [ownerData, setOwnerData] = useState([]);
  const payload = tokenPayload();

  const fetchOwnerData = async () => {
    try {
      const response = await getApi(urls.owner.ownerdata, { id: payload.companyId });
      setOwnerData(response.data);
    } catch (error) {
      console.error('Error fetching owner data:', error);
      toast.error(t('Failed to fetch owner data!'));
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, [dialogState]);

  const openDialog = (type, row = null) => {
    setRowData(row);
    setDialogState((prev) => ({ ...prev, [type]: true }));
  };

  const bulkDialogOpen = () => {
    setOpenBulkUploadDialog(true);
  };

  const handleBulkDialogClose = () => {
    setOpenBulkUploadDialog(false); 
  };

  const closeDialog = (type) => {
    setDialogState((prev) => ({ ...prev, [type]: false }));
    setRowData(null);
  };

  const handleOpenView = () => {
    navigate(`/dashboard/owner/view?id=${rowData._id}`);
  };

  const handlePopoverOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setRowData(row);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setRowData(null);
  };

  const breadcrumbs = [
    <Link key="home" to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
      <IconHome />
    </Link>,
    <Typography key="owners" color="text.primary">
      {t('Landlord/Owner')}
    </Typography>,
  ];

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
      field: 'ownerName',
      headerName: t('Owner Name'),
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: (params) => (
        <Button
          variant="text"
          color="primary"
          onClick={() =>
            navigate(`/dashboard/owner/view?id=${params.row._id}`) 
          }
        >
          {params.row.ownerName}  
        </Button>
      ),
    },
    {
      field: 'email',
      headerName: t('Email'),
      flex: 1,
    },
    {
      field: 'phoneNo',
      headerName: t('Phone No'),
      flex: 1,
    },
    {
      field: 'address',
      headerName: t('Address'),
      flex: 1,
      cellClassName: 'name-column--cell--capitalize',
    },
    {
      field: 'action',
      headerName: t('Action'),
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            aria-describedby={params?.row._id}
            onClick={(event) => handlePopoverOpen(event, params.row)}
          >
            <MoreVertIcon />
          </IconButton>
          <Popover
            open={Boolean(anchorEl) && rowData?._id === params?.row._id}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <MenuItem onClick={() => openDialog('edit', rowData)} disableRipple>
              <EditIcon sx={{ mr: 1 }} />
              {t('Edit')}
            </MenuItem>
            <MenuItem onClick={handleOpenView} >
              <VisibilityIcon style={{ marginRight: '8px', color: 'green' }} />
              {t('view')}
            </MenuItem>
            <MenuItem
              onClick={() => openDialog('delete', rowData)}
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

  return (
    <>
  
      <AddOwner open={dialogState.add} handleClose={() => closeDialog('add')} />
      <EditOwner open={dialogState.edit} handleClose={() => closeDialog('edit')} data={rowData} />
      <DeleteOwner open={dialogState.delete} handleClose={() => closeDialog('delete')} id={rowData?._id} />
      <BulkUploadOwner open={openBulkUploadDialog} data={payload} onClose={handleBulkDialogClose} />
      <Container>
        {/* Breadcrumbs and Header */}
        <Card sx={{ p: 2, mb: 2 }}>
  <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
    <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {t('Landlord/Owner Management')} 
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
    </Typography>
    
    <Stack direction="row" spacing={2}>
      <Button
        variant="contained"
        startIcon={<Iconify icon="eva:plus-fill" />}
        onClick={() => openDialog('add')}
      >
        {t('Add Owner')}
      </Button>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={bulkDialogOpen}
      >
        {t('Bulk Upload Owners')} {/* Changed from "Tenants" to "Owners" */}
      </Button>
    </Stack>
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

export default Owner;
