/* eslint-disable prettier/prettier */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, CardActions, CardContent, Divider, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import BajajAreaChartCard from './BajajAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
import { urls } from 'core/Constant/urls';
// import { getApi } from 'api'; // Make sure to import your API function
import { getApi } from 'core/apis/api';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

const PopularCard = ({ isLoading }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [companies, setCompanies] = useState([]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchCompanyData = async () => {
    try {
      const response = await getApi(urls.company.activeCompany); 
      if (response?.success && response?.data) {
        setCompanies(response.data);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false} sx={{ height: '600px', overflow: 'auto' }}>
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Grid container alignContent="center" justifyContent="space-between" >
                  <Grid item>
                    <Typography variant="h4">Active Companies</Typography>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                {companies.map((company) => (
                  <div key={company._id}>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          {company.companyName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {company.email}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              {company.phoneNo}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '5px',
                                backgroundColor: company.status 
                                  ? theme.palette.success.light 
                                  : theme.palette.error.light,
                                color: company.status 
                                  ? theme.palette.success.dark 
                                  : theme.palette.error.dark,
                                ml: 2
                              }}
                            >
                              {company.status ? (
                                <KeyboardArrowUpOutlinedIcon fontSize="small" color="inherit" />
                              ) : (
                                <KeyboardArrowDownOutlinedIcon fontSize="small" color="inherit" />
                              )}
                            </Avatar>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Divider sx={{ my: 1.5 }} />
                  </div>
                ))}
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button size="small" disableElevation>
              View All
              <ChevronRightOutlinedIcon />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
};

PopularCard.propTypes = {
  isLoading: PropTypes.bool
};

export default PopularCard;