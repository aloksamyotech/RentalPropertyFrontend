/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Rating,
  Select,
  TextField
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
// import { useState,useEffect } from 'react';
// import { apiget, apipost } from '../../service/api';
// import Palette from '../../ui-component/ThemePalette';

const AddVacantNotice = (props) => {
  const { t } = useTranslation();
  const { open, handleClose } = props;

  // -----------  validationSchema
  const validationSchema = yup.object({
    tenantname: yup.string().required(t('Tenant Name is required')),
    buildingname: yup.string().required(t('Building Name is required')),
    unitname: yup.string().required(t('Unit Name is required')),
    vacantnoticedate: yup.date().required(t('Vacant Notice Date is required')),
    lastdate: yup.string().required(t('LastDate is required'))
  });

  // -----------   initialValues
  const initialValues = {
    tenantname: '',
    buildingname: '',
    unitname: '',
    vacantnoticedate: '',
    lastdate: ''
  };

  // formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      console.log('leadValues', values);
      handleClose();
      toast.success(t('lead Add successfully'));
      // addLead(values);
    }
  });

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        // TransitionComponent={Transition}
      >
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between'
            // backgroundColor: "#2b4054",
            // color: "white",
          }}
        >
          <Typography variant="h6">{t('Add New')}</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <form>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <Typography style={{ marginBottom: '15px' }} variant="h6">
                {t('Tenants Information')}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>{t('Tenant Name')}</FormLabel>
                  <TextField
                    id="tenantname"
                    name="tenantname"
                    size="small"
                    fullWidth
                    value={formik.values.tenantname}
                    onChange={formik.handleChange}
                    error={formik.touched.tenantname && Boolean(formik.errors.tenantname)}
                    helperText={formik.touched.tenantname && formik.errors.tenantname}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>{t('Building Name')}</FormLabel>
                  <TextField
                    id="buildingname"
                    name="buildingname"
                    size="small"
                    fullWidth
                    value={formik.values.buildingname}
                    onChange={formik.handleChange}
                    error={formik.touched.buildingname && Boolean(formik.errors.buildingname)}
                    helperText={formik.touched.buildingname && formik.errors.buildingname}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <FormLabel>{t('Unit Name')}</FormLabel>
                  <TextField
                    id="unitname"
                    name="unitname"
                    type="number"
                    size="small"
                    fullWidth
                    value={formik.values.unitname}
                    onChange={formik.handleChange}
                    error={formik.touched.unitname && Boolean(formik.errors.unitname)}
                    helperText={formik.touched.unitname && formik.errors.unitname}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>{t('Vacant Notice Date')}</FormLabel>
                  <TextField
                    id="vacantnoticedate"
                    name="vacantnoticedate"
                    size="small"
                    fullWidth
                    value={formik.values.vacantnoticedate}
                    onChange={formik.handleChange}
                    error={formik.touched.vacantnoticedate && Boolean(formik.errors.vacantnoticedate)}
                    helperText={formik.touched.vacantnoticedate && formik.errors.vacantnoticedate}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormLabel>{t('Last Date For Vacant')}</FormLabel>
                  <TextField
                    id="lastdate"
                    name="lastdate"
                    size="small"
                    type="datetime-local"
                    fullWidth
                    value={formik.values.lastdate}
                    onChange={formik.handleChange}
                    error={formik.touched.lastdate && Boolean(formik.errors.lastdate)}
                    helperText={formik.touched.lastdate && formik.errors.lastdate}
                  />
                </Grid>
              </Grid>
            </DialogContentText>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={formik.handleSubmit} variant="contained" color="primary" type="submit">
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
    </div>
  );
};

export default AddVacantNotice;
