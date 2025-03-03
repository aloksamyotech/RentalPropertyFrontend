/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import { postApi } from 'core/apis/api';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { FormControl, FormHelperText, FormLabel } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { toast } from 'react-toastify';
import { urls } from 'core/Constant/urls';
import { useTranslation } from 'react-i18next';
import { tokenPayload } from 'helper';
import { useCallback } from 'react';
import { debounce } from 'lodash';
import { useState } from 'react';

const AddServiceProvider = (props) => {
  const { t } = useTranslation(); 
  const [loading, setLoading] = useState(false);
  
  const { open, handleClose } = props;

  const validationSchema = yup.object({
    name: yup
      .string()
      .max(50, t('Owner Name cannot exceed 50 characters'))
      .required(t('Owner Name is required')),
    phoneNo: yup
      .string()
      .matches(/^[0-9]{10}$/, t('Phone Number must be exactly 10 digits'))
      .required(t('Phone Number is required')),
    workType: yup
      .string()
      .max(80, t('Worktype cannot exceed 80 characters'))
      .required(t('Worktype is required')),
    address: yup
      .string()
      .max(80, t('Address cannot exceed 80 characters'))
      .required(t('Address is required')),
  });

  const payload = tokenPayload();

  const initialValues = {
    ownerName: '',
    phoneNo: '',
    workType: '',
    address: ''
  };

  const AddServiceProvider = async (values, resetForm) => {
    setLoading(true);
    const startTime = Date.now();
    values.companyId = payload.companyId;
    try {
      const response = await postApi(urls.serviceProvider.create, values);
      if (response.success === true) {
        toast.success(t('Successfully registered'));
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 1000 - elapsedTime);
        setTimeout(() => {
          setLoading(false);
          handleClose();
        }, remainingTime);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error(t('Something went wrong!'));
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      AddServiceProvider(values, resetForm);
    }
  });

  const debounceSubmit =  useCallback(debounce(formik.handleSubmit, 500), [formik.handleSubmit]);
  

  return (
    <div>
      <Dialog open={open} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h6">{t('Create Owner')}</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={debounceSubmit}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6}>
                <FormLabel>{t('Service Provider Name')}</FormLabel>
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
                  type="number"
                  fullWidth
                  value={formik.values.phoneNo}
                  onChange={formik.handleChange}
                  error={formik.touched.phoneNo && Boolean(formik.errors.phoneNo)}
                  helperText={formik.touched.phoneNo && formik.errors.phoneNo}
                  inputProps={{ maxLength: 10 }}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
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
          <Button
            type="submit"
            variant="contained"
            onClick={debounceSubmit}
            style={{ textTransform: 'capitalize' }}
            color="secondary"
            disabled={loading}
          >
         {loading ? t('Saving...') : t('Save')} 
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
    </div>
  );
};

AddServiceProvider.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default AddServiceProvider;
