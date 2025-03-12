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
  FormHelperText,
  IconButton,
  Paper
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { postApi } from 'core/apis/api';
import PropTypes from 'prop-types';
import { useFormik, FieldArray as FormikFieldArray, getIn } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { urls } from 'core/Constant/urls';
import { tokenPayload } from 'helper';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const AddTenants = ({ open, handleClose }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const payload = tokenPayload();
  const AddTenants = async (values, resetForm) => {
    setLoading(true);
  
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
  

    const documentsArray = values.documents.map((doc) => ({
      name: doc.name,
      file: doc.file
    }));
  
    formData.append('documents', JSON.stringify(documentsArray)); 
    values.documents.forEach((doc) => {
      if (doc.file) {
        formData.append('files', doc.file);
      }
    });
  
    try {
      const response = await postApi(urls.tenant.create, formData, {
        'Content-Type': 'multipart/form-data'
      });
  
      if (response.success) {
        toast.success(t('Successfully registered tenant!'));
        handleClose();
        resetForm();
      }
    } finally {
      handleClose();
      resetForm();
      setLoading(false);
    }
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
    identityNo: yup.string().max(12, t('Identity No. should be smaller than 12 characters')).required(t('Identity Number is required')),
    address: yup.string().max(100, t('Address must be at most 100 characters')).required(t('Address is required')),
    documents: yup.array().of(
      yup.object().shape({
        name: yup.string().required(t('Document name is required')),
        file: yup.mixed().required(t('Document file is required'))
      })
    )
  });

  const initialValues = {
    tenantName: '',
    email: '',
    password: '',
    phoneno: '',
    identityCardType: '',
    identityNo: '',
    address: '',
    documents: []
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      AddTenants(values, resetForm);
    }
  });

  const handleFileChange = (event, index, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue(`documents[${index}].file`, file);
    }
  };

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

            {/* Documents - Using Manual Implementation Instead of FieldArray */}
            {/* <Grid item xs={12}>
              <Box mb={1}>
                <FormLabel>{t('Documents')}</FormLabel>
              </Box>
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={() => {
                  const documents = [...formik.values.documents];
                  documents.push({ name: '', file: null });
                  formik.setFieldValue('documents', documents);
                }}
                sx={{ mb: 2 }}
              >
                {t('Add Document')}
              </Button>
              
              {formik.values.documents.map((document, index) => {
                const documentNameError = getIn(formik.errors, `documents[${index}].name`);
                const documentNameTouched = getIn(formik.touched, `documents[${index}].name`);
                
                const documentFileError = getIn(formik.errors, `documents[${index}].file`);
                const documentFileTouched = getIn(formik.touched, `documents[${index}].file`);
                
                return (
                  <Paper key={index} elevation={1} sx={{ p: 2, mb: 2, position: 'relative' }}>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => {
                        const documents = [...formik.values.documents];
                        documents.splice(index, 1);
                        formik.setFieldValue('documents', documents);
                      }}
                      sx={{ position: 'absolute', top: 5, right: 5 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    
                    <Grid container spacing={2} alignItems="center"> */}
  {/* Document Name Input */}
  {/* <Grid item xs={12} sm={4}>
    <TextField
      fullWidth
      size="small"
      label={t('Document Name')}
      name={`documents[${index}].name`}
      value={document.name}
      onChange={formik.handleChange}
      error={documentNameTouched && Boolean(documentNameError)}
      helperText={documentNameTouched && documentNameError}
    />
  </Grid> */}

  {/* File Upload Button */}
  {/* <Grid item xs={12} sm={4}>
    <Button variant="contained" component="label" size="small" fullWidth>
      {document.file ? t('Change File') : t('Upload File')}
      <input
        type="file"
        hidden
        onChange={(event) => handleFileChange(event, index, formik.setFieldValue)}
      />
    </Button>
  </Grid> */}

  {/* File Name Display */}
  {/* <Grid item xs={12} sm={4}>
    {document.file ? (
      <Typography variant="body2" color="textSecondary" sx={{ wordBreak: 'break-word' }}>
        📄 {document.file.name}
      </Typography>
    ) : (
      <Typography variant="body2" color="GrayText">
        {t('No file selected')}
      </Typography>
    )}
    {documentFileTouched && documentFileError && (
      <FormHelperText error>{documentFileError}</FormHelperText>
    )}
  </Grid>
</Grid>

                  </Paper>
                );
              })}
            </Grid> */}

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
        <Button variant="contained" color="primary" type="submit" onClick={formik.handleSubmit} disabled={loading}>
          {loading ? t('Saving...') : t('Save')}
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
  handleClose: PropTypes.func.isRequired
};

export default AddTenants;