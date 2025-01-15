import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getApi } from 'core/apis/api';
// import { getApi } from 'views/services/api';
// import DeleteCustomer from '../DeleteCustomer';
// import AddCustomer from '../AddCustomer';
// import EditCustomer from '../EditCustomer';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'left',
  color: theme.palette.text.secondary
}));

export default function ComplainViewDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [value, setValue] = useState('1');
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const hotel = JSON.parse(localStorage.getItem('hotelData'));
  

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const handleOpenEditlead = () => setOpenEdit(true);
  const handleCloseEditlead = () => setOpenEdit(false);
  const handleOpenDeleteCustomer = () => setDeleteDialogOpen(true);
  const handleCloseDeleteLead = () => setDeleteDialogOpen(false);

  const [customerData, setCustomerData] = useState({});
  const [customerObjId, setCustomerObjId] = useState(null);
  const [reservationHistory, setReservationHistory] = useState([]);
 
  const params = useParams();
  const phone = params.phone;
  const _id = params._id;

  const fetchCustomerData = async () => {
    try {
      const response = await getApi(`api/customer/view/${phone}?hotelId=${hotel?.hotelId}`);
      const customer = response?.data?.customerData[0];
      setCustomerData(customer);
      setCustomerObjId(customer?._id);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCustomerReservationHistory = async () => {
    if (!customerObjId) return;
    try {
      const response = await getApi(`api/customer/history/${customerObjId}?hotelId=${hotel?.hotelId}`);
      setReservationHistory(response?.data || []);
    } catch (error) {
      console.log('error ==>', error);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [openAdd, openEdit, deleteDialogOpen]);

  useEffect(() => {
    fetchCustomerReservationHistory();
  }, [customerObjId]);

  const handleNavigate = (id) => {
    navigate(`/dashboard/customer/view/specificbooking/${id}`);
  };

  return (
    <>
      {/* <DeleteCustomer open={deleteDialogOpen} handleClose={handleCloseDeleteLead} />
      <AddCustomer open={openAdd} handleClose={handleCloseAdd} />
      <EditCustomer open={openEdit} handleClose={handleCloseEditlead} data={customerData} /> */}

      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example" textColor="secondary" indicatorColor="secondary">
              <Tab label={t('information')} value="1" />
              <Tab label={t('history')} value="2" />
            </TabList>

            <div>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                sx={{ marginLeft: 2, color: '#673ab7', borderColor: '#673ab7' }}
                onClick={() => navigate(-1)}
              >
                {t('back')}
              </Button>
            </div>
          </Box>

          <TabPanel value="1">
            <Box sx={{ flexGrow: 1, overflowX: 'auto' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <Item sx={{ height: '100%' }}>
                    <Typography variant="h4" fontWeight="bold">
                      {t('customer_information')}
                    </Typography>
                    <hr />
                    <Grid container spacing={2} sx={{ justifyContent: 'between', alignItems: 'center', marginTop: '1px' }}>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">{t('first_name')}</Typography>
                        <Typography style={{ color: 'black' }}>{customerData.firstName || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">{t('last_name')}</Typography>
                        <Typography style={{ color: 'black' }}>{customerData.lastName || t('not_available')}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ justifyContent: 'between', alignItems: 'center', marginTop: '1px' }}>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">{t('email')}</Typography>
                        <Typography style={{ color: 'black' }}>{customerData.email || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">{t('address')}</Typography>
                        <Typography style={{ color: 'black' }}>{customerData.address || t('not_available')}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ justifyContent: 'between', alignItems: 'center', marginTop: '1px' }}>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">{t('id_card_type')}</Typography>
                        <Typography style={{ color: 'black' }}>{customerData.idCardType || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">{t('id_card_number')}</Typography>
                        <Typography style={{ color: 'black' }}>{customerData.idcardNumber || t('not_available')}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ justifyContent: 'between', alignItems: 'center', marginTop: '1px' }}>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">{t('phone_number')}</Typography>
                        <Typography style={{ color: 'black' }}>{customerData.phoneNumber || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">{t('id_proof_front')}</Typography>
                        <Typography style={{ color: 'black', marginTop: '7px' }}>
                          <a href={customerData?.idFile} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                            <Button startIcon={<VisibilityIcon style={{ marginRight: '1px', color: 'white' }} />} variant="contained" color="primary">
                              {t('view_id_proof_front')}
                            </Button>
                          </a>
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h5">{t('id_proof_back')}</Typography>
                        <Typography style={{ color: 'black', marginTop: '7px' }}>
                          <a href={customerData?.idFile2} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                            <Button startIcon={<VisibilityIcon style={{ marginRight: '1px', color: 'white' }} />} variant="contained" color="primary">
                              {t('view_id_proof_back')}
                            </Button>
                          </a>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Item>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value="2">
            <Box sx={{ flexGrow: 1, overflowX: 'auto' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <Item sx={{ height: '100%' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ p: 2 }}>
                      {t('reservation_history')}
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>{t('room_no')}</TableCell>
                            <TableCell>{t('check_in_date')}</TableCell>
                            <TableCell>{t('check_out_date')}</TableCell>
                            <TableCell>{t('advance_amount')}</TableCell>
                            <TableCell>{t('total_amount')}</TableCell>
                            <TableCell>{t('remaining_amount')}</TableCell>
                            <TableCell>{t('status')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reservationHistory.map((reservation) => (
                            <TableRow key={reservation._id}>
                              <TableCell
                                onClick={() => handleNavigate(reservation._id)}
                                style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}
                              >
                                {reservation.roomNo}
                              </TableCell>
                              <TableCell>{new Date(reservation.checkInDate).toLocaleDateString()}</TableCell>
                              <TableCell>{new Date(reservation.checkOutDate).toLocaleDateString()}</TableCell>
                              <TableCell>{hotel.currencyCode} {reservation.advanceAmount}</TableCell>
                              <TableCell>{hotel.currencyCode} {reservation.advanceAmount + reservation.totalAmount}</TableCell>
                              <TableCell>{hotel.currencyCode} {reservation.totalAmount}</TableCell>
                              <TableCell>{reservation.status}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Item>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
}
