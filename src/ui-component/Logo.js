// material-ui
import { useTheme } from '@mui/material/styles';

/**
 * Uncomment the following to use an image logo instead of an SVG logo:
 * 
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 */

const Logo = () => {
  const theme = useTheme();

  return (
    // Uncomment the image tag below to use an image logo
    // <img src={logo} alt="CRM" width="100" />

    // SVG Logo (default)
    <svg width="92" height="40" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 512 512" id="insurance">
      <path
        fill="#f8be32"
        d="M256 280.83c-28.894-15.999-53.134-37.256-70.601-62.02C165.512 190.616 155 158.455 155 125.805V47.713a223.034 223.034 0 0 0 70.264-20.868A198.853 198.853 0 0 0 256.758 7.5a227.413 227.413 0 0 0 42.845 23.405A246.967 246.967 0 0 0 357 46.939v78.866c0 32.65-10.512 64.81-30.399 93.005-17.467 24.764-41.707 46.021-70.601 62.02Z"
      ></path>
      <path
        fill="#fddd5a"
        d="M256 245.724c-18.546-12.412-34.292-27.484-46.086-44.206C193.615 178.41 185 152.23 185 125.805V72.782a246.107 246.107 0 0 0 53.554-19.041q9.638-4.763 18.748-10.361a262.312 262.312 0 0 0 30.777 15.223A274.855 274.855 0 0 0 327 71.466v54.34c0 26.424-8.615 52.605-24.914 75.712-11.794 16.722-27.54 31.794-46.086 44.206Z"
      ></path>
      <path
        fill="#fed030"
        d="M288.08 58.603a262.31 262.31 0 0 1-30.778-15.223q-7.115 4.373-14.59 8.246 7.54 3.717 15.367 6.977A274.856 274.856 0 0 0 297 71.466v54.34c0 26.424-8.615 52.605-24.914 75.712A169.201 169.201 0 0 1 241 234.594q7.144 5.857 15 11.13c18.546-12.412 34.292-27.484 46.086-44.206C318.385 178.411 327 152.23 327 125.805V71.466a274.856 274.856 0 0 1-38.92-12.863Z"
      ></path>
      {/* Add more path elements here if needed */}
    </svg>
  );
};

export default Logo;
