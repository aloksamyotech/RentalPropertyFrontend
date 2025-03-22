/* eslint-disable prettier/prettier */
// material-ui
import { useTheme } from '@mui/material/styles';

/**
 * Uncomment the following to use an image logo instead of an SVG logo:
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 */
import logo from 'assets/images/image-180x70 (1).jpg';

const Logo = () => {
  const theme = useTheme();

  return (
    // Uncomment the image tag below to use an image logo
    <img src={logo} alt="CRM" width="180px" height="70px" style={{ objectFit: 'cover' }} />
  );
};

export default Logo;
