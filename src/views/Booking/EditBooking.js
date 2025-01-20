/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
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
import Autocomplete from '@mui/material/Autocomplete';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { updateApi, getApi } from 'core/apis/api';
import { tokenPayload } from 'helper';
import { urls } from 'core/Constant/urls';

const EditBooking = ({ open, handleClose, data }) => {
  const { t } = useTranslation();
  const [tenantData, setTenantData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const payload = tokenPayload();
 console.log(data,"data")
  const fetchTenantData = async () => {
    try {
      setLoading(true);
      const response = await getApi(urls.tenant.tenantdata, { id: payload.companyId });
      setTenantData(response?.data || []);
    } catch (error) {
      toast.error(t('failedToFetchTenantData'));
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertyData = async () => {
    try {
      setLoading(true);
      const response = await getApi(urls.property.propertydata, { id: payload.companyId });
      setPropertyData(response?.data || []);
    } catch (error) {
      toast.error(t('failedToFetchPropertyData'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchTenantData();
      fetchPropertyData();
    }
  }, [open]);
  const editBooking = async (values, resetForm) => {
    const updatedValues = {
      ...values,
      companyId: payload.companyId,
      createdBy: payload._id,
      startingDate: new Date(values.startingDate).toISOString().split('T')[0],
      endingDate: new Date(values.endingDate).toISOString().split('T')[0],
    };
  
    try {
      const response = await updateApi(urls.booking.updateBooking, updatedValues, { id: data._id });
      if (response.success) {
        toast.success(t('bookingUpdatedSuccessfully'));
        resetForm();
        setTimeout(handleClose, 200);
      } else {
        toast.error(t('failedToUpdateBooking'));
      }
    } catch (error) {
      toast.error(t('failedToUpdateBooking'));
    }
  };
  

  const validationSchema = yup.object({
    tenantId: yup.string().required(t('Tenant is required')),
    propertyId: yup.string().required(t('Property is required')),
    startingDate: yup.date().required(t('Starting Date is required')),
    endingDate: yup
      .date()
      .required(t('Ending Date is required'))
      .min(yup.ref('startingDate'), t('Ending date must be after starting date')),
    rentAmount: yup
      .number()
      .required(t('Rent Amount is required'))
      .positive(t('Rent Amount must be positive')),
    advanceAmount: yup
      .number()
      .required(t('Advance Amount is required'))
      .min(0, t('Advance Amount cannot be negative')),
  });

  const formik = useFormik({
    initialValues: {
      tenantId: data?.tenantId?._id || '',
      propertyId: data?.propertyId?._id || '',
      startingDate: data?.startingDate
        ? new Date(data.startingDate).toISOString().split('T')[0]
        : '',
      endingDate: data?.endingDate
        ? new Date(data.endingDate).toISOString().split('T')[0]
        : '',
      rentAmount: data?.rentAmount || '',
      advanceAmount: data?.advanceAmount || '',   
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      editBooking(values, resetForm);
    },
  });
  

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">{t('editBooking')}</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Tenant Name')}</FormLabel>
              <Autocomplete
                disablePortal
                size="small"
                options={tenantData.map((tenant) => ({
                  label: tenant.tenantName,
                  value: tenant._id,
                }))}
                getOptionLabel={(option) => option.label || ''}
                value={
                  tenantData
                    .map((tenant) => ({ label: tenant.tenantName, value: tenant._id }))
                    .find((option) => option.value === formik.values.tenantId) || null
                }
                onChange={(event, value) => formik.setFieldValue('tenantId', value?.value || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.tenantId && Boolean(formik.errors.tenantId)}
                    helperText={formik.touched.tenantId && formik.errors.tenantId}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Property')}</FormLabel>
              <Autocomplete
                disablePortal
                size="small"
                options={propertyData.map((property) => ({
                  label: property.propertyname,
                  value: property._id,
                  rentAmount: property.rent,
                }))}
                value={
                  propertyData
                    .map((property) => ({
                      label: property.propertyname,
                      value: property._id,
                    }))
                    .find((option) => option.value === formik.values.propertyId) || null
                }
                onChange={(event, value) => {
                  formik.setFieldValue('propertyId', value?.value || '');
                  formik.setFieldValue('rentAmount', value?.rentAmount || formik.values.rentAmount);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.propertyId && Boolean(formik.errors.propertyId)}
                    helperText={formik.touched.propertyId && formik.errors.propertyId}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Rent Amount')}</FormLabel>
              <TextField
                id="rentAmount"
                name="rentAmount"
                type="number"
                size="small"
                fullWidth
                value={formik.values.rentAmount}
                onChange={formik.handleChange}
                error={formik.touched.rentAmount && Boolean(formik.errors.rentAmount)}
                helperText={formik.touched.rentAmount && formik.errors.rentAmount}
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Advance Amount')}</FormLabel>
              <TextField
                id="advanceAmount"
                name="advanceAmount"
                type="number"
                size="small"
                fullWidth
                value={formik.values.advanceAmount}
                onChange={formik.handleChange}
                error={formik.touched.advanceAmount && Boolean(formik.errors.advanceAmount)}
                helperText={formik.touched.advanceAmount && formik.errors.advanceAmount}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Starting Date')}</FormLabel>
              <TextField
                id="startingDate"
                name="startingDate"
                type="date"
                size="small"
                fullWidth
                value={formik.values.startingDate}
                onChange={formik.handleChange}
                error={formik.touched.startingDate && Boolean(formik.errors.startingDate)}
                helperText={formik.touched.startingDate && formik.errors.startingDate}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Ending Date')}</FormLabel>
              <TextField
                id="endingDate"
                name="endingDate"
                type="date"
                size="small"
                fullWidth
                value={formik.values.endingDate}
                onChange={formik.handleChange}
                error={formik.touched.endingDate && Boolean(formik.errors.endingDate)}
                helperText={formik.touched.endingDate && formik.errors.endingDate}
              />
            </Grid>
          </Grid>

          <DialogActions>
            <Button type="submit" variant="contained" color="secondary">
              {t('Save')}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                formik.resetForm();
                handleClose();
              }}
            >
              {t('Cancel')}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBooking;
