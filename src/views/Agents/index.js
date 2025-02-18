/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
// @mui

import { Stack, Button, Container, Typography, Box, Card,Link ,Breadcrumbs,   IconButton,
  Popover, MenuItem} from '@mui/material';
import { IconHome } from '@tabler/icons';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
// import AddLead from './AddLead.js';
import AddAgents from './AddAgents';
import { useTranslation } from 'react-i18next';
import { getApi } from 'core/apis/api';
import i18n from 'i18n';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { urls } from 'core/Constant/urls';
import EditAgent from './EditAgent';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect } from 'react';
import DeleteAgent from './DeleteAgent';
import { tokenPayload } from 'helper';
// ----------------------------------------------------------------------

const Agents = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [agentData, setagentData] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [rowData, setRowData] = useState([]);
  // const company = JSON.parse(localStorage.getItem('companyData'));
  const payload =  tokenPayload();


  const fetchAgentData= async()=>{
    try {
      const response = await getApi(urls.agent.agentdata, { id: payload._id });
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setagentData(data);
    } catch (error) {
      console.error("Error fetching company data:", error);
      setagentData([]);
    }
  }

  
  const handleCloseDeleteAgent = () => {
    setOpenDelete(false);
  };

  
  const handleOpenView = () => {
    navigate(`/dashboard/agent/view?id=${currentRow._id}`);
  };

  
  const handleOpenEditAgent = () => {
    setRowData(currentRow); 
    setOpenEdit(true);
    handleClose(); 
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

  const handleCloseEditAgent = () => {
    setOpenEdit(false);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

    useEffect(() => {
        fetchAgentData();
    }, [openAdd, openEdit, openDelete]);

  const columns = [
    {
      field: 'agentName',
      headerName: 'Agent Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
    },
    {
      field: 'phoneNo',
      headerName: 'Phone No',
      flex: 1,
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize',
    },
    {
      field: 'action',
      headerName: 'Action',
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
            <MenuItem onClick={handleOpenEditAgent} disableRipple>
              <EditIcon style={{ marginRight: '8px' }} />
              Edit
            </MenuItem>
            <MenuItem onClick={handleOpenView} disableRipple>
              <VisibilityIcon style={{ marginRight: '8px', color: 'green' }} />
              {t('view')}  
              </MenuItem>
            <MenuItem onClick={handleOpenDeleteAgent} sx={{ color: 'red' }} disableRipple>
              <DeleteIcon style={{ marginRight: '8px', color: 'red' }} />
              Delete
            </MenuItem>
          </Popover>
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
      Add Agents
    </Link>,
    <Typography key="3" sx={{ color: 'text.primary' }}>
      Items
    </Typography>,
  ];

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  return (
    <>
      <AddAgents open={openAdd} handleClose={handleCloseAdd} />
      <EditAgent open={openEdit} handleClose={handleCloseEditAgent} data={rowData} />
      <DeleteAgent open={openDelete} handleClose={handleCloseDeleteAgent} id={rowData?._id}/>
      
      <Container>
      <Card sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }} >
            {t('agents')} <Breadcrumbs separator="›" aria-label="breadcrumb">{breadcrumbs}</Breadcrumbs>
            </Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
            {t('addNewAgent')}
            </Button>
          </Stack>
        </Card>
        {/* <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4">{t('agents')}</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenAdd}
            >
              {t('addNewAgent')}
            </Button>
          </Stack>
        </Stack> */}
        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
            <DataGrid
                rows={agentData}
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

export default Agents;
