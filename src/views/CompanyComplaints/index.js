/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
// @mui
import {
  Stack,
  Link,
  Button,
  Container,
  Typography,
  Breadcrumbs,
  Box,
  Card,
  IconButton,
  Popover,
  MenuItem,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
// import AddComplaints from './AddComplaints';
import { IconHome } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import { urls } from 'core/Constant/urls';
import { getApi, patchApi } from 'core/apis/api';
import { tokenPayload } from 'helper';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router';
import DeleteIcon from '@mui/icons-material/Delete';
// import EditComplain from './EditComplain';
// import DeleteComplain from './DeleteCompalain';

const CompanyComplaints = () => {
  const { t } = useTranslation();
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [complaintData, setComplaintData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const navigate = useNavigate()
  const payload = tokenPayload();

  const fetchComplaintData = async () => {
    try {
      const response = await getApi(urls.Complaints.allComplainForCompany, { id: payload._id });
      if (response?.data && Array.isArray(response.data)) {
        const formattedData = response.data.map((item) => ({
          ...item,
          tenantName: item.tenantId?.tenantName,
          propertyname: item.propertyId?.propertyname,
          phoneNo: item.tenantId?.phoneno
        }));
        setComplaintData(formattedData);
      } else {
        setComplaintData([]);
      }
    } catch (error) {
      console.error(t('Error fetching complaints data:'), error);
    }
  };
  const handleCloseDeleteComplain = () => setOpenDelete(false);

  
  const handleOpenView = () => {
    console.log(currentRow,"currentRow")
    navigate(`/dashboard/complain/view?id=${currentRow._id}&reporterName=${currentRow.reporterName}`);
  };

  useEffect(() => {
    fetchComplaintData();
  }, [openAdd, openEdit, openDelete]);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleCloseEditComplain = () => setOpenEdit(false);
  // const handleOpenEditComplain = () => {
  //   setRowData(currentRow);
  //   setOpenEdit(true);
  //   handleClose();
  // };

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const handleEditComplaint = () => {
    setRowData(currentRow);
    setOpenEdit(true);
    handleClose();
  };

  // const handleOpenDeleteCompany = () => {
  //   setRowData(currentRow);
  //   setOpenDelete(true);
  //   handleClose();
  // };


  const handleDeleteComplaint = () => {
    console.log('Delete complaint:', currentRow);
    setRowData(currentRow);
    setOpenDelete(true);
    handleClose();
  };

  // Define table columns
  const columns = [

    {
      field: 'tenantName',
      headerName: t('Tenant Name'),
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
    },
    {
      field: 'phoneNo',
      headerName: t('Phone No'),
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
    },
    {
      field: 'concernTopic',
      headerName: t('Topic'),
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
    },
    {
      field: 'reporterName',
      headerName: t('Created By'),
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
    },
    {
      field: 'comment',
      headerName: t('Comments'),
      flex: 1,
      cellClassName: 'name-column--cell--capitalize',
    },
    {
      field: 'status',
      headerName: t('Status'),
      flex: 1,
      cellClassName: 'name-column--cell--capitalize',
      renderCell: (params) => (
        <Typography 
          style={{ 
            color: params.row.status ? 'green' : 'red', 
            fontWeight: 'bold' 
          }}
        >
          {params.row.status ? t('Resolved') : t('Pending')}
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
            aria-describedby={params.row._id}
            onClick={(event) => handleClick(event, params.row)}
          >
            <MoreVertIcon />
          </IconButton>
          <Popover
            id={params.row._id}
            open={Boolean(anchorEl) && currentRow?._id === params.row._id}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
             <MenuItem onClick={handleOpenView} disableRipple>
              <VisibilityIcon style={{ marginRight: '8px', color: 'green' }} />
              {t('view')}  
              </MenuItem>
            <MenuItem onClick={handleDeleteComplaint} sx={{ color: 'red' }} disableRipple>
              <DeleteIcon style={{ marginRight: '8px', color: 'red' }} />
              {t('Delete')}
            </MenuItem>
          </Popover>
        </>
      ),
    },
  ];

  const breadcrumbs = [
    <Link underline="hover" key="1" color="primary" href="/" onClick={(e) => e.preventDefault()}>
      <IconHome />
    </Link>,
    <Link underline="hover" key="2" color="primary" href="/add-complaints" onClick={(e) => e.preventDefault()}>
      {t('Add Complaints')}
    </Link>,
    <Typography key="3" sx={{ color: 'text.primary' }}>
      {t('Items')}
    </Typography>,
  ];

  return (
    <>
 
      {/* <AddComplaints open={openAdd} handleClose={handleCloseAdd} />
      <EditComplain open={openEdit} handleClose={handleCloseEditComplain} data={rowData} />
      <DeleteComplain open={openDelete} handleClose={handleCloseDeleteComplain} id={rowData?._id}/> */}
    

      <Container>
        <Card sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {t('Complaints')}
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                {breadcrumbs}
              </Breadcrumbs>
            </Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              {t('Add New Complaint')}
            </Button>
          </Stack>
        </Card>

        {/* Table Style */}
        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              <DataGrid
                rows={complaintData}
                columns={columns}
                checkboxSelection
                getRowId={(row) => row.id || row._id}
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

export default CompanyComplaints;
