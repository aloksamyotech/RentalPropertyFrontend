/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Rating,
  Select,
  TextField
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
// import { useState,useEffect } from 'react';
// import { apiget, apipost } from '../../service/api';
import Palette from '../../ui-component/ThemePalette';

const AddComplaints = (props) => {
  const {t} = useTranslation();
  const { open, handleClose } = props;

  // -----------  validationSchema
  const validationSchema = yup.object({
    unitname: yup.string().required(t('Unit Name is required')), // Translated
    tenants: yup.string().required(t('Tenant is required')), // Translated
    buildingname: yup.string().required(t('Building Name is required')), // Translated
    concern: yup.date().required(t('Concern is required')), // Translated
    description: yup.string().required(t('Description is required')) // Translated
  });

  // -----------   initialValues
  const initialValues = {
    unitname: '',
    tenants: '',
    buildingname: '',
    concern: '',
    description: ''
  };

  // formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      console.log('leadValues', values);
      handleClose();
      toast.success(t('lead Add successfully')); 
    }
  });

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h6">{t('Add New')}</Typography> 
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <form>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <Typography style={{ marginBottom: '15px' }} variant="h6">
                {t('Complaints Information')} 
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>{t('Unit Name')}</FormLabel> 
                  <TextField
                    id="unitname"
                    name="unitname"
                    size="small"
                    fullWidth
                    value={formik.values.unitname}
                    onChange={formik.handleChange}
                    error={formik.touched.unitname && Boolean(formik.errors.unitname)}
                    helperText={formik.touched.unitname && formik.errors.unitname}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>{t('Building Name')}</FormLabel> 
                  <TextField
                    id="buildingname"
                    name="buildingname"
                    size="small"
                    fullWidth
                    value={formik.values.buildingname}
                    onChange={formik.handleChange}
                    error={formik.touched.buildingname && Boolean(formik.errors.buildingname)}
                    helperText={formik.touched.buildingname && formik.errors.buildingname}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>{t('Tenants Name')}</FormLabel>
                  <TextField
                    id="tenants"
                    name="tenants"
                    size="small"
                    fullWidth
                    value={formik.values.tenants}
                    onChange={formik.handleChange}
                    error={formik.touched.tenants && Boolean(formik.errors.tenants)}
                    helperText={formik.touched.tenants && formik.errors.tenants}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>{t('Concern Topic')}</FormLabel> 
                  <TextField
                    id="concern"
                    name="concern"
                    size="small"
                    fullWidth
                    value={formik.values.concern}
                    onChange={formik.handleChange}
                    error={formik.touched.concern && Boolean(formik.errors.concern)}
                    helperText={formik.touched.concern && formik.errors.concern}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormLabel>{t('Description')}</FormLabel> 
                  <TextField
                    id="description"
                    name="description"
                    size="small"
                    fullWidth
                    multiline
                    rows={3} // Number of lines
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                  />
                </Grid>
              </Grid>
            </DialogContentText>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={formik.handleSubmit} variant="contained" color="primary" type="submit">
            {t('Save')} 
          </Button>
          <Button
            onClick={() => {
              formik.resetForm();
              handleClose();
            }}
            variant="outlined"
            color="error"
          >
            {t('Cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddComplaints;
