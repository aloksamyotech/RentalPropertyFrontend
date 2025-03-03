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
import { updateApi } from 'core/apis/api';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { urls } from 'core/Constant/urls';
import { tokenPayload } from 'helper';
import { useState } from 'react';
import { useCallback } from 'react';
import { throttle } from 'lodash';

const EditPropertyTypes = ({ open, handleClose, data }) => {
  const { t } = useTranslation();
  const payload = tokenPayload();
  const [loading, setLoading] = useState(false);
  
  const EditPropertyType = async (values, resetForm) => {
    const updatedValues = { ...values, companyId: payload._id };
    setLoading(true);
    const startTime = Date.now();
    try {
      const response = await updateApi(urls.propertyTypes.edit, updatedValues, { id: data._id });

      if (response.success) {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 1000 - elapsedTime);
        setTimeout(() => {
          setLoading(false);
          handleClose();
        }, remainingTime);
        toast.success(t('Property type updated successfully!'));
        resetForm();
      } else {
        toast.error(t('Failed to update property!'));
      }
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error(t('An unexpected error occurred!'));
    }
  };

  const validationSchema = yup.object({
    name: yup
      .string()
      .max(30, t('Name cannot exceed 30 characters'))
      .required(t('Property Type Name is required')),
    description: yup
      .string()
      .max(200, t('Description cannot exceed 200 characters'))
  });

  const formik = useFormik({
    initialValues: {
      name: data?.name || '',
      description: data?.description || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      EditPropertyType(values, resetForm);
    },
  });

  // const throttledSubmit = useCallback(throttle(formik.handleSubmit, 4000), [formik.handleSubmit]);
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="edit-property-dialog-title"
      aria-describedby="edit-property-dialog-description"
    >
      <DialogTitle id="edit-property-dialog-title">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">{t('Edit Property')}</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </div>
      </DialogTitle>
      <DialogContent dividers id="edit-property-dialog-description">
        <form onSubmit={formik.handleSubmit}>
          <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
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
          type="submit"
          disabled={loading}
        >
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

EditPropertyTypes.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default EditPropertyTypes;
