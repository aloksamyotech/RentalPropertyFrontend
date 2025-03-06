/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
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
import { updateApi, getApi } from 'core/apis/api';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { urls } from 'core/Constant/urls';
import { tokenPayload } from 'helper';
import { useCallback } from 'react';
import { debounce, throttle } from 'lodash';

const EditComplain = ({ open, handleClose, data }) => {
  const { t } = useTranslation();
  const [companyData, setCompanyData] = useState([]);
  const [loading, setLoading] = useState(false);

  const payload = tokenPayload();

  useEffect(() => {
    if (open) {
      fetchComplainData();
    }
  }, [open]);

  const fetchComplainData = async () => {
    try {
      const response = await getApi(urls.property.propertydata, { id: payload.companyId });
      setCompanyData(response.data);
    } catch (err) {
      console.error('Error fetching property data:', err);
      toast.error(t('failedToFetchPropertyData'));
    }
  };

  const editCompany = async (values, resetForm) => {
    setLoading(true);  
    try {
      const response = await updateApi(urls?.company?.edit, values, { id: data._id });

      if (response.success) {
        toast.success(t('companyUpdatedSuccessfully'));
        resetForm();
        handleClose();
      }
    } catch (err) {
      console.error('Error updating company:', err);
      toast.error(t('somethingWentWrong'));
    } finally {
      setLoading(false); 
      resetForm();
      handleClose();
    }
  };

  const validationSchema = yup.object({
    companyName: yup
      .string()
      .max(50, t('Owner Name cannot exceed 50 characters'))
      .required(t('Owner Name is required')),
    email: yup
      .string()
      .email(t('Invalid email address'))
      .required(t('Email is required')),
    phoneNo: yup
      .string()
      .matches(/^[0-9]{10}$/, t('Phone Number must be exactly 10 digits'))
      .required(t('Phone Number is required')),
    address: yup
      .string()
      .max(80, t('Address cannot exceed 80 characters'))
      .required(t('Address is required')),
  });

  const formik = useFormik({
    initialValues: {
      companyName: data?.companyName || '',
      email: data?.email || '',
      phoneNo: data?.phoneNo || '',
      address: data?.address || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      console.log(values, 'values');
      editCompany(values, resetForm);
    },
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{t('editComplaint')}</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Company Name')}</FormLabel>
              <TextField
                id="companyName"
                name="companyName"
                size="small"
                fullWidth
                value={formik.values.companyName}
                onChange={formik.handleChange}
                error={formik.touched.companyName && Boolean(formik.errors.companyName)}
                helperText={formik.touched.companyName && formik.errors.companyName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Email')}</FormLabel>
              <TextField
                id="email"
                name="email"
                size="small"
                fullWidth
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Phone No')}</FormLabel>
              <TextField
                id="phoneNo"
                name="phoneNo"
                size="small"
                fullWidth
                value={formik.values.phoneNo}
                onChange={formik.handleChange}
                error={formik.touched.phoneNo && Boolean(formik.errors.phoneNo)}
                helperText={formik.touched.phoneNo && formik.errors.phoneNo}
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
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}  // Disable button when loading is true
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
          {t('cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditComplain.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    propertyId: PropTypes.shape({
      _id: PropTypes.string,
    }),
    concernTopic: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default EditComplain;
