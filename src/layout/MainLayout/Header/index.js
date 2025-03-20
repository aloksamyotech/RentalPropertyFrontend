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

  // Fetch company name data
  const fetchCompanyData = async () => {
    const response = await getApi(urls.company.getCompanyById, { id: payload.companyId });
    setCompany(response?.data?.companyName || '');
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: 'flex',
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

      {/* Company name in header */}
      {company && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 2,
            paddingRight: 2,
            flexShrink: 0,
          }}
        >
         <Tooltip title="Company" arrow>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          fontSize: '1.4rem',
          color: theme.palette.primary.main,
          transition: 'color 0.3s ease-in-out, transform 0.3s ease-in-out', // Added transition for scale
          '&:hover': {
            color: theme.palette.primary.dark,
            cursor: 'pointer',
            transform: 'scale(1.05)', // Slightly enlarges text on hover
          },
        }}
      >
        Welcome to {company}
      </Typography>
    </Tooltip>
        </Box>
      )}

      {/* header search (if needed) */}
      {/* <SearchSection /> */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Language switcher, notification & profile */}
      <LanguageSwitcher />
      <NotificationSection />
      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func,
};

export default Header;
