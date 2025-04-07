import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, Box } from '@mui/material';
import AuthWrapper1 from '../AuthWrapper1.js';
import AuthCardWrapper from '../AuthCardWrapper.js';
// import AuthLogin from '../auth-forms/AuthLogin.js';
import Logo from 'layout/MainLayout/LogoSection';

import InventoryImage from 'assets/images/mklp.png';
import FirebaseLogin from '../auth-forms/AuthLogin.js';
const Login = () => {
  const theme = useTheme();
  return (
    <AuthWrapper1>
      <Grid container sx={{ minHeight: '100vh', backgroundColor: '#441572' }}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <AuthCardWrapper
            sx={{
              maxWidth: 400,
              width: '100%',
              boxShadow: theme.shadows[3],
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item sx={{ mb: 2, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '2px',
                    marginLeft: 12
                  }}
                >
                  <Logo />
                </Box>
              </Grid>
              <Grid item xs={12} sx={{ marginTop: '-20px' }}>
                <Stack alignItems="center">
                  <Typography variant="h3" sx={{ fontWeight: 700, textAlign: 'center', color: '#240046' }}>
                    Welcome to RMS
                  </Typography>
                  <Typography textAlign="center" variant="body2" sx={{ color: 'black' }}>
                    Login to use the platform
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <FirebaseLogin />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ backgroundColor: '#FFFFFF' }} />
              </Grid>
            </Grid>
          </AuthCardWrapper>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#2F124C',
              padding: '4px',
              flexDirection: 'column'
            }}
          >
            <Box
              component="img"
              src={InventoryImage}
              alt="Inventory Management"
              sx={{
                maxWidth: '60%',
                maxHeight: '60%',
                objectFit: 'contain',
                borderRadius: '20px'
              }}
            />
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: '16px'
              }}
            >
              Rentals Management System <br />
              <span style={{ fontSize: '12px' }}>Revolutionize your rental business with our easy-to-use system – manage bills, bookings, track rentals, and deliver seamless customer experiences!</span>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};
export default Login;