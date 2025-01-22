/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  Button,
  Dialog,
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

const AddPropertyTypes = ({ open, handleClose }) => {
  const { t } = useTranslation();

  const payload = tokenPayload();

  const AddPropertyTypes = async (values, resetForm) => {
    try {
      values.companyId = payload._id;

      const response = await postApi(urls.propertyTypes.create, values);
      console.log(response, "Response received");

      if (response.success) {
        toast.success(t('Successfully registered property type!'));
        resetForm();
  
        setTimeout(() => {
          handleClose();
        }, 200);
      }
    } catch (error) {
      console.error('Error in AddPropertyTypes:', error);

      if (error.status === 409) {
        toast.error(t('Property type already exists!'));
      } else {
        toast.error(t('Failed to register property type!'));
      }
    }
  };
  
  

  // Validation schema
  const validationSchema = yup.object({
    name: yup
      .string()
      .max(30, t('Property Name must be at most 30 characters'))
      .required(t('Property Name is required')),
      description: yup
      .string()
      .max(200, t('Property Name must be at most 200 characters'))
      .required(t('Description is required')),
  });

  // Initial values
  const initialValues = {
    name: '',
    description: ''
  };

  // Formik setup
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      console.log('Submitted Values:', values);
      AddPropertyTypes(values, resetForm);
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
        <Typography variant="h6">{t('Add Property Types')}</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Typography variant="h6" style={{ marginBottom: '15px' }}>
            {t('Property Types')}
          </Typography>
          <Grid container spacing={3}>
            {/* Property Name */}
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Property Type Name')}</FormLabel>
              <TextField
                id="name"
                name="name"
                size="small"
                fullWidth
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Description')}</FormLabel>
              <TextField
                id="description"
                name="description"
                size="small"
                fullWidth
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
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

AddPropertyTypes.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddPropertyTypes;
