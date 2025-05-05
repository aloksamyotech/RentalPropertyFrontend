/* eslint-disable prettier/prettier */
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Typography, Tooltip } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';

// assets
import { IconMenu2 } from '@tabler/icons';
import LanguageSwitcher from 'views/switchLanguage/LanguageSwitcher';
import { useState, useEffect } from 'react';
import { getApi } from 'core/apis/api';
import { urls } from 'core/Constant/urls';
import { tokenPayload } from 'helper';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const payload = tokenPayload();
  const [company, setCompany] = useState('');
  const theme = useTheme();

  const userRole = payload.role;

  const fetchCompanyData = async () => {
    const response = await getApi(urls.company.getCompanyById, { id: payload.companyId });
    setCompany(response?.data?.companyName || '');
  };

  useEffect(() => {
    if (userRole !== 'admin') {
      fetchCompanyData();
    }
  }, [userRole]);

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const day = now.toLocaleDateString('en-US', { weekday: 'long' });
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString();
      setCurrentTime(`${day}, ${date} ${time}`);
    };

    updateTime(); // Initialize
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer); 
  }, []);

  return (
    <>
      {/* Logo & Toggler Button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: 228,
          [theme.breakpoints.down('md')]: {
            width: 'auto',
          },
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              '&:hover': {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light,
              },
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </Box>

      {/* Company Name and Date */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          pl: 2,
          pr: 2,
          pt: 1,
        }}
      >
        {/* Company Name */}
        {company && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              flexGrow: 1,  // This allows the company name box to take available space
            }}
          >
            {/* Welcome text */}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 400,
                fontSize: '1.1rem', // Smaller size for the "Welcome"
                color: theme.palette.text.secondary,
                textAlign: 'left',
              }}
            >
              Welcome to
            </Typography>

            {/* Company Name */}
            <Tooltip title="Click to view company profile" arrow>
              <Typography
                variant="h4"
                noWrap
                sx={{
                  fontWeight: 700,
                  fontSize: '1.7rem', 
                  color: theme.palette.primary.main,
                  maxWidth: '90%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  '&:hover': {
                    color: theme.palette.primary.dark,
                    transform: 'scale(1.05)',
                    cursor: 'pointer',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {company}
              </Typography>
            </Tooltip>
          </Box>
        )}

        {/* Date & Time */}
        <Box
          sx={{
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: '1.1rem',
              fontWeight: 500,
              color: theme.palette.text.secondary,
            }}
          >
            Today is 
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
                fontSize: '1.1rem', // Smaller size for the "Welcome"
                color: theme.palette.text.secondary,
                
            }}
          >
            {currentTime}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      {/* Language Switcher, Notification & Profile */}
      <LanguageSwitcher />
      {/* <NotificationSection /> */}
      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func,
};

export default Header;
