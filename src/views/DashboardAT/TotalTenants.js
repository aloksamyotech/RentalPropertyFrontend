import PropTypes from 'prop-types';
// import FastfoodIcon from '@mui/icons-material/Fastfood';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import { useTranslation } from 'react-i18next';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  height: '100%',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    // background: theme.palette.secondary[800],
    borderRadius: '50%',
    top: -85,
    right: -95,
    [theme.breakpoints.down('sm')]: {
      top: -105,
      right: -140
    }
  },
  '&:before': {
    zIndex: -1,
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.secondary[800],
    borderRadius: '50%',
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70
    }
  }
}));

// ===========================|| DASHBOARD Contact CARD ||=========================== //

const TotalTenants = ({ isLoading, tenant }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2.25, height: '100%' }}>
            <Grid container direction="column" justifyContent="space-between" sx={{ height: '100%' }}>
              {/* Top left: Title */}
              <Grid item>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: theme.palette.secondary.light
                  }}
                >
                  {t('Total Tenants')}
                </Typography>
              </Grid>

              {/* Bottom left: Icon and Number (Icon on Left, Bigger Icon) */}
              <Grid item>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Avatar
                      sx={{
                        ...theme.typography.smallAvatar,
                        backgroundColor: theme.palette.secondary[200],
                        color: theme.palette.secondary.dark,
                        width: 48,  // Bigger size
                        height: 48, // Bigger size
                      }}
                    >
                      <SkeletonTotalOrderCard fontSize="large" />  {/* Bigger Icon */}
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <Typography
                      sx={{
                        fontSize: '2.125rem',
                        fontWeight: 700
                      }}
                    >
                      {tenant?.length ?? 0}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

TotalTenants.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  tenant: PropTypes.array
};

export default TotalTenants;
