/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
// @mui
import { Stack, Button, Container, Typography, Box, Card ,Link,Breadcrumbs} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { IconHome } from '@tabler/icons';

import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import AddAnouncement from './AddAnouncement';
import { useTranslation } from 'react-i18next';
import i18n from 'i18n';


// ----------------------------------------------------------------------

const leadData = [
  {
    id: 1,
    unitname: 'C21',
    buildingname: 'c21',
    tenants: 'John F Kennedy',
    concern: '90909090',
    discription: '2000'
  }
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
    {i18n.t('addNewAnnouncement')}
  </Link>,
  <Typography key="3" sx={{ color: 'text.primary' }}>
    Items
  </Typography>,
];

const Announcement = () => {
  const { t } = useTranslation();
  const [openAdd, setOpenAdd] = useState(false);

  const columns = [
    {
      field: 'topic',
      headerName: t('topic'),
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'discription',
      headerName: t('description'),
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'createdOn',
      headerName: t('createdOn'),
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'action',
      headerName: t('action'),
      flex: 1
    }
  ];

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  return (
    <>
      <AddAnouncement open={openAdd} handleClose={handleCloseAdd} />
      <Container>

      <Card sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }} >
            {t('announcement')} <Breadcrumbs separator="›" aria-label="breadcrumb">{breadcrumbs}</Breadcrumbs>
            </Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
            {t('addNewAnnouncement')} 
             </Button>
          </Stack>
        </Card>
        {/* <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4">{t('announcement')}</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenAdd}
            >
              {t('addNewAnnouncement')}
            </Button>
          </Stack>
        </Stack> */}
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

export default Announcement;
