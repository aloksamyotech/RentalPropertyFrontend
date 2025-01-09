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
// import { postApi } from 'views/Services/api';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { FormControl, FormHelperText, FormLabel } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { toast } from 'react-toastify';
import { urls } from 'core/Constant/urls';
import { useTranslation } from 'react-i18next';
// import { postApi } from 'core/apis/api';

const AddCompany = (props) => {
  const{t} = useTranslation();
  const { open, handleClose } = props;


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
      password: yup.string().required('Password is required')
  });

    // const validationSchema = yup.object({
    //   companyName: yup
    //     .string()
    //     .max(50, t('Owner Name cannot exceed 50 characters'))
    //     .required(t('Owner Name is required')),
    //   email: yup
    //     .string()
    //     .email(t('Invalid email address'))
    //     .required(t('Email is required')),
    //   phoneNo: yup
    //     .string()
    //     .matches(/^[0-9]{10}$/, t('Phone Number must be exactly 10 digits'))
    //     .required(t('Phone Number is required')),
    //   address: yup
    //     .string()
    //     .max(80, t('Address cannot exceed 80 characters'))
    //     .required(t('Address is required')),
    // });
  
  const initialValues = {
    companyName: '',
    email: '',
    phoneNo: '',
    address: '',
    password: ''
  };

  

  const AddCompany = async (values, resetForm) => {
    try {
      const response = await postApi( urls.company.create , values);

      if (response.success === true) 
      toast.success('Successfully registered');
      resetForm();
      setTimeout(() => {
        handleClose();
      }, 200);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      values.email = values.email.toLowerCase();
      console.log(values);
      AddCompany(values, resetForm);
    }
  });

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
          <Typography variant="h6">Create Company</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </DialogTitle>

        <DialogContent dividers>
       
          <form onSubmit={formik.handleSubmit}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6}>
                <FormLabel>Company Name</FormLabel>
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
                <FormLabel>Email</FormLabel>
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
                <FormLabel>Phone No</FormLabel>
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
                <FormLabel>Address</FormLabel>
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
              <Grid item xs={12} sm={6}>
                <FormLabel>Password</FormLabel>
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
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" onClick={formik.handleSubmit} style={{ textTransform: 'capitalize' }} color="secondary">
            Save
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
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

AddCompany.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default AddCompany;
