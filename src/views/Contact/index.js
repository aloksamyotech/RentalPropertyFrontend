/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
// @mui
import { Stack, Button, Link,Container, Breadcrumbs,Typography, Box, Card } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { IconHome } from '@tabler/icons';
import Iconify from '../../ui-component/iconify';
import AddContact from './AddContact';

// ----------------------------------------------------------------------

const leadData = [
  {
    id: 1,
    firstName: 'jonny',
    lastName: 'Doe',
    gender: 'male',
    phoneNumber: '9981923587',
    emailAddress: 'ap@samyotech.com',
    action: 'Edit'
  }
];

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
    Add Contact
  </Link>,
  <Typography key="3" sx={{ color: 'text.primary' }}>
    Items
  </Typography>,
];
const Contact = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const columns = [
    {
      field: 'firstName',
      headerName: 'First Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'gender',
      headerName: 'Gender',
      flex: 1
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone Number',
      flex: 1
    },
    {
      field: 'emailAddress',
      headerName: 'Email Address',
      flex: 1
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1
      // eslint-disable-next-line arrow-body-style
    }
  ];

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  return (
    <>
      <AddContact open={openAdd} handleClose={handleCloseAdd} />
      <Container>
        {/* <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4">Contact-Management</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              New Contact
            </Button>
          </Stack>
        </Stack> */}
        <Card sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }} >
            Contact-Management <Breadcrumbs separator="›" aria-label="breadcrumb">{breadcrumbs}</Breadcrumbs>
            </Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
            New Contact
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

export default Contact;
