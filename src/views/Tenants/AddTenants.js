/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  MenuItem,
  Select,
  Button,
  Dialog,
  FormControl,
  FormLabel,
  Grid,
  TextField,
  Typography,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';
import { postApi } from 'core/apis/api';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { urls } from 'core/Constant/urls';
import { tokenPayload } from 'helper';

const AddTenants = ({ open, handleClose }) => {
  const { t } = useTranslation();

  // const company = JSON.parse(localStorage.getItem('companyData'));
  const payload = tokenPayload();

  const AddTenants = async (values, resetForm) => {
    values.companyId = payload.companyId;
    values.reporterId = payload._id;
    try {
      const response = await postApi(urls.tenant.create, values);
      if (response.success) {
        toast.success('Successfully registered tenant!');
        resetForm();
        setTimeout(() => {
          handleClose();
        }, 200);
      } else {
        toast.error('Failed to register tenant!');
      }
    } catch (err) {
      console.error('Error adding tenant:', err);
      toast.error('Something went wrong!');
    }
  };

  // Validation schema
  const validationSchema = yup.object({
    tenantName: yup
      .string()
      .max(50, t('Tenant Name must be at most 50 characters'))
      .required(t('Tenant Name is required')),
    email: yup.string().email(t('Invalid email')).required(t('Email is required')),
    password: yup.string().required(t('Password is required')),
    phoneno: yup
      .string()
      .matches(/^[0-9]{10}$/, t('Phone number must be 10 digits'))
      .required(t('Phone number is required')),
    identityCardType: yup.string().required(t('Identity Card Type is required')),
    identityNo: yup.string().required(t('Identity Number is required')),
    identityImage: yup.mixed().nullable(),
    emergencyNo: yup
      .string()
      .matches(/^[0-9]{10}$/, t('Emergency number must be 10 digits'))
      .required(t('Emergency number is required')),
    address: yup
      .string()
      .max(100, t('Address must be at most 100 characters'))
      .required(t('Address is required')),
  });

  // Initial values
  const initialValues = {
    tenantName: '',
    email: '',
    password: '',
    phoneno: '',
    identityCardType: '',
    identityNo: '',
    identityImage: null,
    emergencyNo: '',
    address: '',
  };

  // Formik setup
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      console.log('Submitted Values:', values);
      AddTenants(values, resetForm);
    },
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        id="scroll-dialog-title"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">{t('Add New Tenant')}</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>
 <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Typography variant="h6" style={{ marginBottom: '15px' }}>
            {t('Tenant Information')}
          </Typography>
          <Grid container spacing={3}>
            {/* Tenant Name */}
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Tenant Name')}</FormLabel>
              <TextField
                id="tenantName"
                name="tenantName"
                size="small"
                fullWidth
                value={formik.values.tenantName}
                onChange={formik.handleChange}
                error={formik.touched.tenantName && Boolean(formik.errors.tenantName)}
                helperText={formik.touched.tenantName && formik.errors.tenantName}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Email')}</FormLabel>
              <TextField
                id="email"
                name="email"
                type="email"
                size="small"
                fullWidth
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>

            {/* Password */}
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Password')}</FormLabel>
              <TextField
                id="password"
                name="password"
                type="password"
                size="small"
                fullWidth
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>

            {/* Phone Number */}
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Phone Number')}</FormLabel>
              <TextField
                id="phoneno"
                name="phoneno"
                type="tel"
                size="small"
                fullWidth
                value={formik.values.phoneno}
                onChange={formik.handleChange}
                error={formik.touched.phoneno && Boolean(formik.errors.phoneno)}
                helperText={formik.touched.phoneno && formik.errors.phoneno}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Emergency Number')}</FormLabel>
              <TextField
                id="emergencyNo"
                name="emergencyNo"
                type="tel"
                size="small"
                fullWidth
                value={formik.values.emergencyNo}
                onChange={formik.handleChange}
                error={formik.touched.emergencyNo && Boolean(formik.errors.emergencyNo)}
                helperText={formik.touched.emergencyNo && formik.errors.emergencyNo}
              />
            </Grid>

            {/* Identity Card Type */}
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Identity Card Type')}</FormLabel>
              <Select
                id="identityCardType"
                name="identityCardType"
                size="small"
                fullWidth
                value={formik.values.identityCardType}
                onChange={formik.handleChange}
                error={
                  formik.touched.identityCardType &&
                  Boolean(formik.errors.identityCardType)
                }
              >
                <MenuItem value="" disabled>
                  {t('Select Identity Card Type')}
                </MenuItem>
                <MenuItem value="Aadhar">{t('Aadhar')}</MenuItem>
                <MenuItem value="Passport">{t('Passport')}</MenuItem>
                <MenuItem value="DriverLicense">{t('Driver License')}</MenuItem>
              </Select>
            </Grid>

            {/* Identity Number */}
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Identity Number')}</FormLabel>
              <TextField
                id="identityNo"
                name="identityNo"
                size="small"
                fullWidth
                value={formik.values.identityNo}
                onChange={formik.handleChange}
                error={formik.touched.identityNo && Boolean(formik.errors.identityNo)}
                helperText={formik.touched.identityNo && formik.errors.identityNo}
              />
            </Grid>

            {/* Identity Image */}
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Identity Image')}</FormLabel>
              <input
                id="identityImage"
                name="identityImage"
                type="file"
                onChange={(event) => {
                  formik.setFieldValue('identityImage', event.currentTarget.files[0]);
                }}
              />
              {formik.touched.identityImage && formik.errors.identityImage && (
                <Typography color="error">{formik.errors.identityImage}</Typography>
              )}
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <FormLabel>{t('Address')}</FormLabel>
              <TextField
                id="address"
                name="address"
                multiline
                rows={4}
                size="small"
                fullWidth
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          color="primary"
          type="submit"
        >
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
  );
};

AddTenants.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddTenants;
