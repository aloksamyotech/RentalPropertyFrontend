/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
// @mui
import { Stack, Button, Container, Typography, Card, Box } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { toast } from 'react-toastify'; 

import TableStyle from '../../ui-component/TableStyle';
import Iconify from '../../ui-component/iconify';
import AddDocuments from './AddDocuments';
import { getApi } from 'core/apis/api';
import { urls } from 'core/Constant/urls';
import { tokenPayload } from 'helper';
// ----------------------------------------------------------------------//

const VacantProperties = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const Payload = tokenPayload()

  // Fetch data using useEffect if necessary.
  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const response = await getApi(urls.property.getVacantProperty, { id: Payload.companyId }); 
        setPropertyData(response.data);
        console.log(response.data,"sadaskd")
      } catch (error) {
        console.error('Error fetching owner data:', error);
        toast.error('Failed to fetch owner data!');
      }
    };

    fetchOwnerData();
  }, []);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const columns = [
    {
      field: 'propertyname',
      headerName: 'Property Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'description',
      headerName: 'Discription',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'rent',
      headerName: 'Rent Amount',
      flex: 1
    }
  ];

  return (
    <>
      <AddDocuments open={openAdd} handleClose={handleCloseAdd} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent="space-between">
          <Typography variant="h4">Documents List</Typography>
          <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              New Document
            </Button>
          </Stack>
        </Stack>
        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
                <DataGrid
                              rows={propertyData}
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

export default VacantProperties;
