/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
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
import { updateApi, getApi } from 'core/apis/api';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { urls } from 'core/Constant/urls';

const EditCompany = ({ open, handleClose, data }) => {
  const { t } = useTranslation();
  const [ownerName, setOwnerData] = useState([]);

  const company = JSON.parse(localStorage.getItem('companyData'));

  useEffect(() => {
    if (open) {
      fetchOwnerData();
    }
  }, [open]);

  const fetchOwnerData = async () => {
    try {
      const response = await getApi(urls.owner.ownerdata, { id: company._id });
      console.log('Fetched Owner Data:', response.data);
      setOwnerData(response.data);
    } catch (err) {
      console.error('Error fetching owner data:', err);
      toast.error(t('failedToFetchOwnerData'));
    }
  };

  const editCompany = async (values, resetForm) => {
    const updatedValues = { ...values, companyId: company._id };

    try {
      const response = await updateApi(urls.company.edit, updatedValues, { id: data._id });

      if (response.success) {
        toast.success(t('ownerUpdatedSuccessfully'));
        resetForm();
        setTimeout(handleClose, 200);
      } else {
        toast.error(t('failedToUpdateCompany'));
      }
    } catch (err) {
      console.error('Error updating company:', err);
      toast.error(t('somethingWentWrong'));
    }
  };

  const validationSchema = yup.object({
    companyName: yup
      .string()
      .max(50, t('companyNameMaxLength'))
      .required(t('companyNameRequired')),
    email: yup
      .string()
      .email(t('invalidEmail'))
      .required(t('emailRequired')),
    phoneNo: yup
      .string()
      .matches(/^[0-9]{10}$/, t('phoneNoMustBe10Digits'))
      .required(t('phoneNoRequired')),
    address: yup
      .string()
      .max(80, t('addressMaxLength'))
      .required(t('addressRequired')),
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
      editCompany(values, resetForm);
    },
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">{t('editCompany')}</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('companyName')}</FormLabel>
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
              <FormLabel>{t('email')}</FormLabel>
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
              <FormLabel>{t('phoneNo')}</FormLabel>
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
              <FormLabel>{t('address')}</FormLabel>
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
        >
          {t('save')}
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

EditCompany.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default EditCompany;
