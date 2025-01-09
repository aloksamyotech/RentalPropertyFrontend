/* eslint-disable prettier/prettier */

/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Card,
  Box,
  IconButton,
  Popover,
  Breadcrumbs,
  MenuItem,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getApi } from 'core/apis/api';
import { Link } from 'react-router-dom';
import TableStyle from '../../ui-component/TableStyle';
import { IconHome } from '@tabler/icons';
import Iconify from '../../ui-component/iconify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTranslation } from 'react-i18next';
import { urls } from 'core/Constant/urls';
import AddBooking from './AddBooking';
import EditBooking from './EditBooking';
import { tokenPayload } from 'helper';
import DeleteBooking from './DeleteBooking';



const Booking = () => {
  const { t } = useTranslation();
  const payload = tokenPayload();
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);

  const fetchBookingData = async () => {
    const response = await getApi(urls.booking.bookingdata, { id: payload._id });
    if (response?.data && Array.isArray(response.data)) {
      const formattedData = response.data.map((item) => ({
        ...item,
        tenantName: item.tenantId?.tenantName,
        propertyName: item.propertyId?.propertyname,
        startingDate: item.startingDate
          ? new Date(item.startingDate).toLocaleDateString()
          : 'N/A',
        endingDate: item.endingDate
          ? new Date(item.endingDate).toLocaleDateString()
          : 'N/A',
      }));
      setBookingData(formattedData);
    } else {
      setBookingData([]);
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, [openAdd]);

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
    setRowData(row);  
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const handleCloseDelete = () => setOpenDelete(false);

  const handleCloseEditBooking = () => setOpenEdit(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const breadcrumbs = [
    <Link key="home" to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
      <IconHome />
    </Link>,
    <Typography key="booking" color="text.primary">
      {t('Booking Management')}
    </Typography>,
  ];

  const columns = [
    {
      field: 'propertyName',
      headerName: t('Property Name'),
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'tenantName',
      headerName: t('Tenant Name'),
      flex: 1,
    },
    {
      field: 'startingDate',
      headerName: t('Starting Date'),
      flex: 1,
    },
    {
      field: 'endingDate',
      headerName: t('Ending Date'),
      flex: 1,
    },
    {
      field: 'rentAmount',
      headerName: t('Rent Amount'),
      flex: 1,
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
            id={params?.row._id}
            open={Boolean(anchorEl) && currentRow?._id === params?.row._id}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <MenuItem
              disableRipple
              onClick={() => { 
                handleClose(); 
                setOpenEdit(true); 
              }}
            >
              <EditIcon style={{ marginRight: '8px' }} />
              {t('Edit')}
            </MenuItem>
            <MenuItem sx={{ color: 'red' }} disableRipple>
              <DeleteIcon style={{ marginRight: '8px', color: 'red' }} />
              {t('Delete')}
            </MenuItem>
          </Popover>
        </>
      ),
    },
  ];

  return (
    <>
      <AddBooking open={openAdd} handleClose={handleCloseAdd} />
      <EditBooking open={openEdit} handleClose={handleCloseEditBooking} data={rowData} />
      <DeleteBooking open={openDelete} handleClose={handleCloseDelete} id={rowData?._id} />
  
      {/* Main content */}
      <Container>
        <Card sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {t('Booking Management')}
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                {breadcrumbs}
              </Breadcrumbs>
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenAdd}
            >
              {t('Add Booking')}
            </Button>
          </Stack>
        </Card>
        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              <DataGrid
                rows={bookingData}
                columns={columns}
                checkboxSelection
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

export default Booking;
