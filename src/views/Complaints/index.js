/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
// @mui
import { Stack, Link, Button, Container, Typography, Breadcrumbs, Box, Card } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import AddComplaints from './AddComplaints';
import TaskIcon from '@mui/icons-material/Task';
import {
  IconHome
} from '@tabler/icons';
import { useTranslation } from 'react-i18next';
// ----------------------------------------------------------------------

const leadData = [
  {
    id: 1,
    unitname: 'C21',
    buildingname: 'c21',
    tenants: 'John F Kennedy',
    concern: '90909090',
    discription: '2000',
  },
];

const Complaints = () => {
  const { t } = useTranslation();
  const [openAdd, setOpenAdd] = useState(false);

  const columns = [
    {
      field: 'unitname',
      headerName: t('Unit Name'), // Translated
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
    },
    {
      field: 'buildingname',
      headerName: t('Building Name'), // Translated
      flex: 1,
      cellClassName: 'name-column--cell--capitalize',
    },
    {
      field: 'tenants',
      headerName: t('Tenant Name'), // Translated
      flex: 1,
      cellClassName: 'name-column--cell--capitalize',
    },
    {
      field: 'concern',
      headerName: t('Concern'), // Translated
      flex: 1,
    },
    {
      field: 'discription',
      headerName: t('Description'), // Translated
      flex: 1,
    },
    {
      field: 'action',
      headerName: t('Action'), // Translated
      flex: 1,
    },
  ];

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleClick = (event) => {
    event.preventDefault();
    console.log('Breadcrumb clicked');
  };

  const breadcrumbs = [
    <Link underline="hover" key="1" color="primary" href="/" onClick={handleClick}>
      <IconHome />
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="primary"
      href="/material-ui/getting-started/installation/"
      onClick={handleClick}
    >
      {t('Add Complaints')} 
    </Link>,
    <Typography key="3" sx={{ color: 'text.primary' }}>
      {t('Items')}
    </Typography>,
  ];

  return (
    <>
      <AddComplaints open={openAdd} handleClose={handleCloseAdd} />
      <Container>
        <Card sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }} >
              {t('Complaints')} <Breadcrumbs separator="›" aria-label="breadcrumb">{breadcrumbs}</Breadcrumbs>
            </Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              {t('Add New Complaint')}
            </Button>
          </Stack>
        </Card>
        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              <DataGrid
                rows={leadData}
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

export default Complaints;
