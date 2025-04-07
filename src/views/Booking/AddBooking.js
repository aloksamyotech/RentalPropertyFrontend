/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import Autocomplete from '@mui/material/Autocomplete';
import { postApi, getApi } from 'core/apis/api';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { FormLabel } from '@mui/material';
import { toast } from 'react-toastify';
import { urls } from 'core/Constant/urls';
import { useTranslation } from 'react-i18next';
import { tokenPayload } from 'helper';
import { data } from 'currency-codes';

const AddBooking = (props) => {
  const { t } = useTranslation();
  const { open, handleClose } = props;
  const [tenantData, setTenantData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(false);

  const validationSchema = yup.object({
    tenantId: yup.string().required(t('Tenant is required')),
    propertyId: yup.string().required(t('Property is required')),
    startingDate: yup.date().required(t('Starting Date is required')),
    endingDate: yup
      .date()
      .required(t('Ending Date is required'))
      .test('is-greater', t('Ending Date must be greater than Starting Date'), function(value) {
        const { startingDate } = this.parent;
        return new Date(startingDate) < new Date(value); 
      })
      .test('is-not-same', t('Ending Date must not be the same as Starting Date'), function(value) {
        const { startingDate } = this.parent;
        return new Date(startingDate).getTime() !== new Date(value).getTime(); 
      }),
  rentAmount: yup.number().required(t('Rent Amount is required'))
    .min(0, t('Rent Amount cannot be negative')) 
    .max(1000000, t('Rent Amount cannot exceed 1000000')),
    advanceAmount: yup.number()
    .typeError(t('Rent must be a number'))
    .min(1, t('must be positive'))
    .max(100000, t('Advance amount shoud be smaller than 100000'))
    .test('is-positive', t('Rent must be greater than zero'), (value) => value > 0)
  });

  const initialValues = {
    tenantId: '',
    propertyId: '',
    startingDate: '',
    endingDate: '',
    rentAmount: '',
    advanceAmount: '',
  };

  const payload = tokenPayload();

  const fetchTenantData = async () => {
    setLoading(true);
    try {
      const response = await getApi(urls.tenant.tenantdata, { id: payload.companyId });
        setTenantData(response.data);
    } catch (err) {
      toast.error(t('Failed to fetch tenant data!'));
      setTenantData([]); 
    } finally {
      setLoading(false);
    }
  };
  

  const fetchPropertyData = async () => {
    setLoading(true);
    try {
      const response = await getApi(urls.property.propertydata, { id: payload.companyId });
      setPropertyData(response?.data || []);
    } catch (err) {
      console.error('Error fetching property data:', err);
      toast.error(t('Failed to fetch property data!'));
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

  const addBooking = async (values, resetForm) => {
    setLoading(true);
    values.companyId = payload.companyId;
    values.createdBy = payload._id;

    try {
      const response = await postApi(urls.booking.create, values);
      if (response.success) {
        toast.success(t('Booking successfully created'));
        resetForm();
        handleClose();
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error(t('Something went wrong!'));
    } finally {
      handleClose();
      resetForm()
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      addBooking(values, resetForm);
    },
  });

  return (
    <Dialog open={open} aria-labelledby="dialog-title" aria-describedby="dialog-description">
      <DialogTitle
        id="dialog-title"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">{t('Create Booking')}</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {/* Tenant Name */}
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Tenant Name')}</FormLabel>
              <Autocomplete
  disablePortal
  size="small"
  options={(tenantData || []).map((tenant) => ({
    label: tenant.tenantName,
    value: tenant._id,
  }))}
  getOptionLabel={(option) => option.label}
  renderInput={(params) => (
    <TextField
      {...params}
      fullWidth
      error={formik.touched.tenantId && Boolean(formik.errors.tenantId)}
      helperText={formik.touched.tenantId && formik.errors.tenantId}
    />
  )}
  onChange={(event, value) => {
    formik.setFieldValue('tenantId', value?.value || '');
  }}
/>

            </Grid>

            {/* Property */}
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
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.propertyId && Boolean(formik.errors.propertyId)}
                    helperText={formik.touched.propertyId && formik.errors.propertyId}
                  />
                )}
                onChange={(event, value) => {
                  formik.setFieldValue('propertyId', value?.value || '');
                  formik.setFieldValue('rentAmount', value?.rentAmount || '');
                }}
              />
            </Grid>

            {/* Rent Amount */}
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

            {/* Advance Amount */}
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

            {/* Starting Date */}
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

            {/* Ending Date */}
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
            <Button type="submit" variant="contained" disabled={loading} color="secondary" style={{ textTransform: 'capitalize' }}>
            {loading ? t('Saving...') : t('Save')} 
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                formik.resetForm();
                handleClose();
              }}
              style={{ textTransform: 'capitalize' }}
            >
              {t('Cancel')}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

AddBooking.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddBooking;
