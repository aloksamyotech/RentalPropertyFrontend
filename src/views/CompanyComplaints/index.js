/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
// @mui
import {
  Stack,
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
import { IconHome } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { urls } from 'core/Constant/urls';
import { getApi } from 'core/apis/api';
import { tokenPayload } from 'helper';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteComplain from './DeleteCompalainByCompany';
import { Link } from 'react-router-dom';

const CompanyComplaints = () => {
  const { t } = useTranslation();
  const [openDelete, setOpenDelete] = useState(false);
  const [tenantComplaintData, setTenantComplaintData] = useState([]);
  const [agentComplaintData, setAgentComplaintData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [value, setValue] = useState('1'); // Keep track of the current tab (1 = Tenant, 2 = Agent)
  const navigate = useNavigate();
  const payload = tokenPayload();

  // Fetch complaints for Tenant
  const fetchComplaintDataForTenant = async () => {
    try {
      const response = await getApi(urls.Complaints.allComplainForCompany, { id: payload._id });
      if (response?.data && Array.isArray(response.data)) {
        const formattedData = response.data.map((item) => ({
          ...item,
          tenantName: item.tenantId?.tenantName,
          propertyname: item.propertyId?.propertyname,
          phoneNo: item.tenantId?.phoneno,
        }));
        setTenantComplaintData(formattedData);
      } else {
        setTenantComplaintData([]);
      }
    } catch (error) {
      console.error(t('Error fetching tenant complaints data:'), error);
    }
  };

  const fetchComplaintDataForAgent = async () => {
    try {
      const response = await getApi(urls.Complaints.getAllComplainCompanyAgent, { id: payload._id });
      if (response?.data && Array.isArray(response.data)) {
        const formattedData = response.data.map((item) => ({
          ...item,
          agentName: item.agentId?.agentName,
          propertyname: item.propertyId?.propertyname,
          phoneNo: item?.agentId?.phoneNo,
        }));
        setAgentComplaintData(formattedData);
      } else {
        setAgentComplaintData([]);
      }
    } catch (error) {
      console.error(t('Error fetching agent complaints data:'), error);
    }
  };

  const handleCloseDeleteComplain = () => setOpenDelete(false);

  const handleOpenView = () => {
    navigate(`/dashboard/complain/view?id=${currentRow._id}&reporterName=${currentRow.reporterName}`);
  };

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const handleDeleteComplaint = () => {
    setOpenDelete(true);
    handleClose();
  };

  useEffect(() => {
    if (value === '1') {
      fetchComplaintDataForTenant(); 
    } else {
      fetchComplaintDataForAgent(); 
    }
  }, [value]);

  const columns = [
    {
      field: 'serialNo',
      headerName: 'S.No.',
      width: 30,
      renderCell: (params) => {
        const rowIndex = tenantComplaintData.findIndex((row) => row._id === params.row._id);
        return rowIndex + 1; 
      }},
    {
      field: 'tenantName',
      headerName: t('Tenant Name'),
      flex: 1,
         renderCell: (params) => (
              <Button
                variant="text"
                color="primary"
                onClick={() =>
                  navigate(`/dashboard/complain/tenant/view?id=${params.row._id}`) 
                }
              >
                {params.row.tenantName}  
              </Button>
            ),
    },
    {
      field: 'phoneNo',
      headerName: t('Phone No'),
      flex: 1,
    },
    {
      field: 'concernTopic',
      headerName: t('Topic'),
      flex: 1,
    },
    {
      field: 'comment',
      headerName: t('Comments'),
      flex: 1,
    },
    {
      field: 'status',
      headerName: t('Status'),
      flex: 1,
      renderCell: (params) => (
        <Typography
          style={{
            color: params.row.status ? 'green' : 'red',
            fontWeight: 'bold',
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
              {t('View')}
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

  const columnsA = [
    {
      field: 'serialNo',
      headerName: 'S.No.',
      width: 30,
      renderCell: (params) => {
        const rowIndex = agentComplaintData.findIndex((row) => row._id === params.row._id);
        return rowIndex + 1; 
      }},
    {
      field: 'agentName',
      headerName: t('Agent Name'),
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="text"
          color="primary"
          onClick={() =>
            navigate(`/dashboard/complain/view?id=${params.row._id}`) 
          }
        >
          {params.row.agentName}  
        </Button>
      ),
    },
    {
      field: 'phoneNo',
      headerName: t('Phone No'),
      flex: 1,
    },
    {
      field: 'concernTopic',
      headerName: t('Topic'),
      flex: 1,
    },
    {
      field: 'comment',
      headerName: t('Comments'),
      flex: 1,
    },
    {
      field: 'status',
      headerName: t('Status'),
      flex: 1,
      renderCell: (params) => (
        <Typography
          style={{
            color: params.row.status ? 'green' : 'red',
            fontWeight: 'bold',
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
              {t('View')}
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
    <Link underline="hover" key="home" to="/" style={{ color: 'inherit' }}>
      <IconHome />
    </Link>,
    <Link underline="hover" key="property-management" to="/dashboard/companyComplaints" style={{ color: 'inherit' }}>
      {t('Complaint Management')}
    </Link>,
  ];

  return (
    <>
      <DeleteComplain open={openDelete} handleClose={handleCloseDeleteComplain} id={currentRow?._id} />

      <Container>
        <Card sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {t('Complaints')}
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                {breadcrumbs}
              </Breadcrumbs>
            </Typography>
          </Stack>
        </Card>

        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={(event, newValue) => setValue(newValue)} aria-label="Complaint tabs">
                    <Tab label={t('Tenant Complaints')} value="1" />
                    <Tab label={t('Agent Complaints')} value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <DataGrid
                    rows={tenantComplaintData}
                    columns={columns}
                    getRowId={(row) => row._id || row.id}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{ toolbar: { showQuickFilter: true } }}
                  />
                </TabPanel>
                <TabPanel value="2">
                  <DataGrid
                    rows={agentComplaintData}
                    columns={columnsA}
                    getRowId={(row) => row._id || row.id}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{ toolbar: { showQuickFilter: true } }}
                  />
                </TabPanel>
              </TabContext>
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default CompanyComplaints;