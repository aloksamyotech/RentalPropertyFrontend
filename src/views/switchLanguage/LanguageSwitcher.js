import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Box from '@mui/material/Box';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    window.location.reload(); // This will reload the page after language change
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '20px' }}>
      <LanguageIcon />
      <Box>
        <FormControl sx={{ fontSize: '0.875rem', padding: '10px' }}>
          <InputLabel sx={{ padding: '15px', display: 'flex', alignItems: 'center' }} id="language-select-label">
            Language
          </InputLabel>
          <Select
            labelId="language-select-label"
            defaultValue={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            label="Language"
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Español</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </div>
  );
};

export default LanguageSwitcher;
