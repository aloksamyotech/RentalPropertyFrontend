/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  MenuItem,
  Select,
  Button,
  Dialog,
  FormLabel,
  Grid,
  Chip,
  Box,
  TextField,
  Typography,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText
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
import CloseIcon from '@mui/icons-material/Close';

const AddTenants = ({ open, handleClose }) => {
  const { t } = useTranslation();
  const [attachments, setAttachments] = useState([]);

  const payload = tokenPayload();

  const AddTenants = async (values, resetForm) => {
    const formData = new FormData();
    formData.append('tenantName', values.tenantName);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('phoneno', values.phoneno);
    formData.append('identityCardType', values.identityCardType);
    formData.append('identityNo', values.identityNo);
    formData.append('address', values.address);
    formData.append('companyId', payload.companyId);
    formData.append('reporterId', payload._id);

    attachments.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await postApi(urls.tenant.create, formData, {
        'Content-Type': 'multipart/form-data'
      });

      if (response.success) {
        toast.success(t('Successfully registered tenant!'));
        resetForm();
        setAttachments([]);
        handleClose();
      } else {
        throw new Error();
      }
    } catch (err) {
      console.error('Error adding tenant:', err);
      toast.error(t('Something went wrong!'));
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length) {
      setAttachments((prev) => [...prev, ...files]);
    }
  };

  const handleFileRemove = (fileName) => {
    setAttachments((prev) => prev.filter((file) => file.name !== fileName));
  };

  const validationSchema = yup.object({
    tenantName: yup.string().max(50, t('Tenant Name must be at most 50 characters')).required(t('Tenant Name is required')),
    email: yup.string().email(t('Invalid email')).required(t('Email is required')),
    password: yup.string().required(t('Password is required')),
    phoneno: yup
      .string()
      .matches(/^[0-9]{10}$/, t('Phone number must be 10 digits'))
      .required(t('Phone number is required')),
    identityCardType: yup.string().required(t('Identity Card Type is required')),
    identityNo: yup.string().required(t('Identity Number is required')),
    address: yup.string().max(100, t('Address must be at most 100 characters')).required(t('Address is required'))
  });

  const initialValues = {
    tenantName: '',
    email: '',
    password: '',
    phoneno: '',
    identityCardType: '',
    identityNo: '',
    address: '',
    document: []
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      AddTenants({ ...values, document: attachments }, resetForm);
    }
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                required
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
                required
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
                required
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
                required
              />
            </Grid>

            {/* Identity Card Type */}
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Identity Card Type')}</FormLabel>
              <FormControl fullWidth size="small" error={formik.touched.identityCardType && Boolean(formik.errors.identityCardType)}>
                <Select
                  id="identityCardType"
                  name="identityCardType"
                  value={formik.values.identityCardType}
                  onChange={formik.handleChange}
                  required
                >
                  <MenuItem value="" disabled>
                    {t('Select Identity Card Type')}
                  </MenuItem>
                  <MenuItem value="Aadhar">{t('Aadhar')}</MenuItem>
                  <MenuItem value="Passport">{t('Passport')}</MenuItem>
                  <MenuItem value="DriverLicense">{t('Driver License')}</MenuItem>
                </Select>
                {formik.touched.identityCardType && formik.errors.identityCardType && (
                  <FormHelperText>{formik.errors.identityCardType}</FormHelperText>
                )}
              </FormControl>
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
                required
              />
            </Grid>

            {/* Documents */}
            <Grid item xs={12}>
              <Box mb={1}>
                <FormLabel>{t('Documents')}</FormLabel>
              </Box>
              <Button variant="contained" component="label">
                {t('Upload Files')}
                <input type="file" multiple hidden onChange={handleFileChange} />
              </Button>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1,
                  flexWrap: 'wrap',
                  maxHeight: '100px',
                  overflowY: 'auto',
                  marginTop: 1
                }}
              >
                {attachments.map((file, index) => (
                  <Chip
                    key={index}
                    sx={{ background: 'green', color: 'white' }}
                    label={file.name}
                    onDelete={() => handleFileRemove(file.name)}
                    deleteIcon={<CloseIcon />}
                  />
                ))}
              </Box>
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
                required
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="primary" type="submit" onClick={formik.handleSubmit}>
          {t('Save')}
        </Button>
        <Button
          onClick={() => {
            formik.resetForm();
            setAttachments([]);
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
  handleClose: PropTypes.func.isRequired
};

export default AddTenants;