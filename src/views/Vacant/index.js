/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
// @mui
import { Stack, Button, Container, Typography, Card, Box, Breadcrumbs, Link } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import Iconify from '../../ui-component/iconify';
import AddVacantNotice from './AddVacantNotice';
import { IconHome } from '@tabler/icons';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

const policyData ={

}

const Vacant = () => {
  const { t } = useTranslation();
  const [openAdd, setOpenAdd] = useState(false);

  const breadcrumbs = [
    <Link underline="hover" key="1" color="primary" href="/">
      <IconHome />
    </Link>,
    <Link underline="hover" key="2" color="primary" href="/material-ui/getting-started/installation/">
      {t('Add Vacant Notice')}
    </Link>,
    <Typography key="3" sx={{ color: 'text.primary' }}>
      {t('Items')}
    </Typography>,
  ];

  const columns = [
    {
      field: 'tenantname',
      headerName: t('Tenant Name'),
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'buildingname',
      headerName: t('Building Name'),
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'unitname',
      headerName: t('Unit Name'),
      flex: 1
    },
    {
      field: 'vacantnoticedate',
      headerName: t('Vacant Notice Date'),
      flex: 1
    },
    {
      field: 'lastdate',
      headerName: t('Last Date of Vacant'),
      flex: 1
    },
    {
      field: 'action',
      headerName: t('Action'),
      flex: 1
    }
  ];

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  return (
    <>
      <AddVacantNotice open={openAdd} handleClose={handleCloseAdd} />
      <Container>
        <Card sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {t('Vacant Notice')} 
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                {breadcrumbs}
              </Breadcrumbs>
            </Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              {t('New Vacant Notice')}
            </Button>
          </Stack>
        </Card>
        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              <DataGrid
                rows={policyData}
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

export default Vacant;
