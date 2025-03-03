/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Button, Container, Typography, Box, Card, Breadcrumbs, Popover, MenuItem,IconButton } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { IconHome } from '@tabler/icons';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getApi } from 'core/apis/api';
import { urls } from 'core/Constant/urls';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import AddAnouncement from './AddAnouncement';
import { useTranslation } from 'react-i18next';
import { tokenPayload } from 'helper';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditAnnouncement from './EditAnnouncement';
import DeleteAnnouncement from './DeleteAnnouncement';
import { Link } from 'react-router-dom';

const Announcement = () => {
  const payload = tokenPayload()
  const isCompanyAdmin = payload?.role === 'companyAdmin';
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const handleOpenView = () => {
    navigate(`/dashboard/announcement/view?id=${currentRow._id}`);
  };
  const handleCloseEditAgent = () => {
    setOpenEdit(false);
  };
  const handleOpenDeleteAgent = () => {
    setRowData(currentRow); 
    setOpenDelete(true);
    handleClose();
  };

  
  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };
  const handleCloseDeleteAgent = () => {
    setOpenDelete(false);
  };



  const handleOpenEditAgent = () => {
    setRowData(currentRow); 
    setOpenEdit(true);
    handleClose(); 
  };

  const fetchAnnouncements = async () => {
    const payload = tokenPayload();
    try {
      const response = await getApi(urls.Announcement.getAllAnnouncement, { id: payload.companyId });
      setAnnouncements(response?.data.map(item => ({ ...item, id: item._id })) || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setAnnouncements([]);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [openAdd,openEdit,openDelete]);

  const breadcrumbs = [
    <Link key="home" to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
      <IconHome />
    </Link>,
    <Typography key="announcement" color="text.primary">
      {t('announcementManagement')}
    </Typography>,
  ];

  const columns = [
    { field: 'topic', headerName: t('topic'), flex: 1, cellClassName: 'name-column--cell--capitalize' },
    { field: 'details', headerName: t('Details'), flex: 1, cellClassName: 'name-column--cell--capitalize' },
    {
      field: 'createdAt',
      headerName: t('createdAt'),
      flex: 1,
      cellClassName: 'name-column--cell--capitalize',
      valueGetter: (params) => new Date(params.value).toLocaleString(), 
    },
    { field: 'action', 
      headerName: t('action'), 
      flex: 1 ,
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
              <MenuItem onClick={handleOpenView} disableRipple>
              <VisibilityIcon style={{ marginRight: '8px', color: 'green' }} />
              {t('view')}  
              </MenuItem>
              {isCompanyAdmin && (
              <>
                <MenuItem onClick={handleOpenEditAgent} disableRipple>
                  <EditIcon style={{ marginRight: '8px' }} />
                  {t('Edit')}
                </MenuItem>
                <MenuItem onClick={handleOpenDeleteAgent} sx={{ color: 'red' }} disableRipple>
                  <DeleteIcon style={{ marginRight: '8px', color: 'red' }} />
                  {t('Delete')}
                </MenuItem>
              </>
            )}

          </Popover>
        </>
      ),
    
    },
  ];
  
  return (
    <>
      <AddAnouncement open={openAdd} handleClose={() => setOpenAdd(false)} />
      <EditAnnouncement open={openEdit} handleClose={handleCloseEditAgent} data={rowData} />
      <DeleteAnnouncement open={openDelete} handleClose={handleCloseDeleteAgent} id={rowData?._id}/>
              
      <Container>
        <Card sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {t('announcement')} <Breadcrumbs separator="›" aria-label="breadcrumb">{breadcrumbs}</Breadcrumbs>
            </Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setOpenAdd(true)}>
              {t('addNewAnnouncement')}
            </Button>
          </Stack>
        </Card>
        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              <DataGrid
                rows={announcements}
                columns={columns}
                checkboxSelection
                getRowId={(row) => row.id}
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

export default Announcement;
