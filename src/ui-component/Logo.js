/* eslint-disable prettier/prettier */
// material-ui
import { useTheme } from '@mui/material/styles';

/**
 * Uncomment the following to use an image logo instead of an SVG logo:
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 */
import logo from 'assets/images/rms-removebg-preview.png';

const Logo = () => {
  const theme = useTheme();

  return (
    // Uncomment the image tag below to use an image logo
<img 
  src={logo} 
  alt="CRM" 
  width="180" 
  height="60" 
  style={{ objectFit: "contain", display: "block" }} 
/>
  );
};

export default Logo;
