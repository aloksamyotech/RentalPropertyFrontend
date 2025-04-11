/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import { urls } from 'core/Constant/urls';
import { getApi } from 'core/apis/api';
// material-ui
import { Grid, Typography, Box, Avatar, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { gridSpacing } from 'store/constant';
// import { getApi } from 'views/services/api';
import TotalAgent from './TotalAgent'
import TotalCompanies from './TotalCompanies';
import TotalProperties from './TotalProperties';
import TotalTenants from './TotalTenants';
import SingleBedIcon from '@mui/icons-material/SingleBed';
import KingBedIcon from '@mui/icons-material/KingBed';

import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { tokenPayload } from 'helper';
import TotalVacantProperties from './TotalVacantProperty';
import TotalComplains from './TotalComplains';
import TotalBooking from './TotalBooking';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import TotalPendingBill from './TotalPendingBills';
import TotalPaidBill from './TotalPaidBill';
import PopularCard from './PopularCard';

const RoomTypeIcons = {
  single: <SingleBedIcon sx={{ fontSize: '2.5rem' }} />,
  double: <KingBedIcon sx={{ fontSize: '2.5rem' }} />,
  triple: <KingBedIcon sx={{ fontSize: '2.5rem' }} />,
  family: <KingBedIcon sx={{ fontSize: '2.5rem' }} />
};

const MainDashboard = () => {
  const { t } = useTranslation();  
  const theme = useTheme();
     const payload = tokenPayload();
  const [isLoading, setLoading] = useState(true);
  const [openReserveRoom, setOpenReserveRoom] = useState(false);
  const [roomPropsData, setRoomPropsData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, []);

  const [agent, setAgent] = useState([]);
  const [tenant, setTenant] = useState([]);
  const [customerData, setcustomerData] = useState([]);
  const [property, setProperty] = useState([]);
  const [vacantpropertyData,setVacantpropertyData] = useState([]);
  const [complainData,setComplainData] = useState([]);
  const [booking,setBooking] = useState([]);
  const [pendingBill,setPendingBill] = useState([]);
  const [paidBill,setPaidBill] = useState([]);


  const fetchAgentData = async () => {
    try {
      const response = await getApi( urls.agent.agentdata, { id: payload.companyId });
      setAgent(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBookingData = async () => {
    try {
      const response = await getApi( urls.booking.allbooking, { id: payload.companyId });
      setBooking(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPaidData = async () => {
    try {
      const response = await getApi( urls.bill.paidBillCounts, { id: payload.companyId });
      setPaidBill(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVacantPropertyData = async () => {
    try {
      const response = await getApi( urls.property.getVacantProperty, { id: payload.companyId });
      setVacantpropertyData(response?.data);
    } catch (error) {
      console.log(error);
    }
  };


  const fetchPropertyData = async () => {
    try {
      const response = await getApi(urls.property.propertyDataAll, {id: payload.companyId});
      setProperty(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTenantData = async () => {
    try {
      const response = await getApi(urls.tenant.getAllTenants,{id: payload.companyId});
      setTenant(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComplainData = async () => {
    try {
      const response = await getApi(urls.Complaints.allComplainForCompany,{id: payload.companyId});
      setComplainData(response?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchPendingBillData = async () => {
    try {
      const response = await getApi(urls.bill.pendingBillCounts,{id: payload.companyId});
      setPendingBill(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAgentData();
    fetchPaidData();
    fetchPropertyData();
    fetchPendingBillData();
    // fetchcustomerData();
    fetchTenantData();
    fetchVacantPropertyData();
    fetchComplainData();
    fetchBookingData();
  }, [openReserveRoom]);

  const handleCloseReservationDialog = () => {
    setOpenReserveRoom(false);
  };

  const fetchReservationIdForActiveRooms = async (roomNo) => {
    try {
      const response = await getApi(`api/room/activroomreservationid/${roomNo}`);
      navigate(`/dashboard/reservation/view/${response?.data[0]?.reservationId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRoomClick = (roominfo) => {
    setTimeout(() => {
      if (roominfo.bookingStatus === 'active') {
        fetchReservationIdForActiveRooms(roominfo.roomNo);
      } else {
        setOpenReserveRoom(true);
      }
      setRoomPropsData(roominfo);
    }, 300);
  };

  return (
    <>
      {/* <ReserveRoom open={openReserveRoom} handleClose={handleCloseReservationDialog} roomDataByProps={roomPropsData} /> */}
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid
              item
              lg={3}
              md={6}
              sm={6}
              xs={12}
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                navigate('/dashboard/agents');
              }}
            >
              <TotalAgent isLoading={isLoading} agent={agent} />
            </Grid>
            {/* <Grid
              item
              lg={3}
              md={6}
              sm={6}
              xs={12}
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                navigate('/dashboard/customers');
              }}
            >
              <TotalCompanies isLoading={isLoading} customerData={customerData} />
            </Grid> */}
            <Grid
              item
              lg={3}
              md={6}
              sm={6}
              xs={12}
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                navigate('/dashboard/property');
              }}
            >
              <TotalVacantProperties isLoading={isLoading} vacantPropertyData={vacantpropertyData} />
            </Grid>
            <Grid
              item
              sm={6}
              xs={12}
              md={6}
              lg={3}
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                navigate('/dashboard/property');
              }}
            >
              <TotalProperties isLoading={isLoading} property={property} />
            </Grid>

            <Grid
              item
              sm={6}
              xs={12}
              md={6}
              lg={3}
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                navigate('/dashboard/companyComplaints');
              }}
            >
              <TotalComplains isLoading={isLoading} complainData={complainData} />
            </Grid>

            <Grid
              item
              sm={6}
              xs={12}
              md={6}
              lg={3}
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                navigate('/dashboard/booking');
              }}
            >
              <TotalBooking isLoading={isLoading} booking={booking} />
            </Grid>
            <Grid
              item
              sm={6}
              xs={12}
              md={6}
              lg={3}
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                navigate('/dashboard/tenents');
              }}
            >
              <TotalTenants isLoading={isLoading} tenant={tenant} />
            </Grid>
            <Grid
              item
              lg={3}
              md={6}
              sm={6}
              xs={12}
              sx={{ cursor: 'pointer' }}
              // onClick={() => {
              //   navigate('/dashboard/billC');
              // }}
            >
              <TotalPendingBill isLoading={isLoading} TotalPendingBill={pendingBill} />
            </Grid>

            <Grid
              item
              lg={3}
              md={6}
              sm={6}
              xs={12}
              sx={{ cursor: 'pointer' }}
              // onClick={() => {
              //   navigate('/dashboard/billC');
              // }}
            >
              <TotalPaidBill isLoading={isLoading} TotalPaidBill={paidBill} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={8}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>

        {/* <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={12}>
              <Typography variant="h5" sx={{ marginBottom: '10px' }}>
                {t('Total Vacant Properties')} ({agent?.length || 0})
              </Typography>
              <hr />
              {vacantpropertyData?.length > 0 ? (
                <Grid container spacing={gridSpacing} sx={{ marginTop: '10px' }}>
                  {agent?.map((room) => (
                    <Grid
                      item
                      key={room.id}
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      sx={{
                        cursor: 'pointer'
                      }}
                      onClick={() => handleRoomClick(room)}
                    >
                      <Box sx={{ p: 2.25 }}>
                        <Paper
                          elevation={3}
                          sx={{
                            borderRadius: '12px',
                            backgroundColor: room.bookingStatus === 'active' ? '#ffcccc' : '#fff',
                            transition: 'background-color 0.3s'
                          }}
                        >
                          <Box sx={{ p: 2 }}>
                            <Grid container direction="column">
                              <Grid item>
                                <Grid container alignItems="center" justifyContent="center">
                                  <Grid item>
                                    <Avatar
                                      sx={{
                                        cursor: 'pointer',
                                        ...theme.typography.smallAvatar,
                                        backgroundColor: room.bookingStatus === 'active' ? 'white' : theme.palette.primary[200],
                                        color: room.bookingStatus === 'active' ? 'black' : theme.palette.primary.dark,
                                        width: '53px',
                                        height: '53px'
                                      }}
                                    >
                                    </Avatar>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item sx={{ mb: 1.25, marginTop: '10px' }}>
                                <Typography
                                  sx={{
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    color: room.bookingStatus === 'active' ? 'black' : theme.palette.primary[200],
                                    textAlign: 'center'
                                  }}
                                >
                                  {room.roomType}
                                </Typography>
                              </Grid>
                              <Grid item sx={{ mb: 1.25, marginTop: '10px' }}>
                                <Typography
                                  sx={{
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    color: room.bookingStatus === 'active' ? 'white' : 'black',
                                    textAlign: 'center',
                                    backgroundColor: room.bookingStatus === 'active' ? 'red' : 'transparent',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '8px',
                                    display: 'inline-block'
                                  }}
                                >
                                  {room.roomNo}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        </Paper>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="h5" sx={{ textAlign: 'center', color: 'grey', marginTop: '5rem' }}>
                  {t('noRoomsExist')}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid> */}
      </Grid>
    </>
  );
};

export default MainDashboard;
