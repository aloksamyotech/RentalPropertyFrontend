/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import { updateApi } from 'core/apis/api';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { FormLabel } from '@mui/material';
import { toast } from 'react-toastify';
import { urls } from 'core/Constant/urls';
import { useTranslation } from 'react-i18next';
import { tokenPayload } from 'helper';

const EditServiceProvider = ({ open, handleClose, data }) => {
  const { t } = useTranslation();

  const validationSchema = yup.object({
    name: yup.string().max(50, t('Owner Name cannot exceed 50 characters')).required(t('Owner Name is required')),
    phoneNo: yup.string().matches(/^[0-9]{10}$/, t('Phone Number must be exactly 10 digits')).required(t('Phone Number is required')),
    workType: yup.string().max(80, t('Work Type cannot exceed 80 characters')).required(t('Work Type is required')),
    address: yup.string().max(80, t('Address cannot exceed 80 characters')).required(t('Address is required')),
  });

  const payload = tokenPayload();

  const initialValues = {
    name: data?.name || '',
    phoneNo: data?.phoneNo || '',
    workType: data?.workType || '',
    address: data?.address || ''
  };

  const editServiceProvider = async (values, resetForm) => {
    values.companyId = payload.companyId;
    try {
      const response = await updateApi(urls.serviceProvider.updateServiceProvider, values,{ id: data._id },);
      if (response.success) {
        toast.success('Successfully updated');
        resetForm();
        setTimeout(handleClose, 200);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      editServiceProvider(values, resetForm);
    },
    enableReinitialize: true
  });

  return (
    <Dialog open={open} aria-labelledby="scroll-dialog-title">
      <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Edit Service Provider</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
            <Grid item xs={12} sm={6}>
              <FormLabel>Service Provider Name</FormLabel>
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
              <FormLabel>{t('Phone No')}</FormLabel>
              <TextField
                id="phoneNo"
                name="phoneNo"
                size="small"
                type="text"
                fullWidth
                value={formik.values.phoneNo}
                onChange={formik.handleChange}
                error={formik.touched.phoneNo && Boolean(formik.errors.phoneNo)}
                helperText={formik.touched.phoneNo && formik.errors.phoneNo}
                inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Work Type')}</FormLabel>
              <TextField
                id="workType"
                name="workType"
                size="small"
                fullWidth
                value={formik.values.workType}
                onChange={formik.handleChange}
                error={formik.touched.workType && Boolean(formik.errors.workType)}
                helperText={formik.touched.workType && formik.errors.workType}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Address')}</FormLabel>
              <TextField
                id="address"
                name="address"
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
        <Button type="submit" variant="contained" onClick={formik.handleSubmit} style={{ textTransform: 'capitalize' }} color="secondary">
        {t('Save')}
        </Button>
        <Button
          type="button"
          variant="outlined"
          style={{ textTransform: 'capitalize' }}
          onClick={() => {
            formik.resetForm();
            handleClose();
          }}
          color="error"
        >
            {t('Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditServiceProvider.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default EditServiceProvider;
