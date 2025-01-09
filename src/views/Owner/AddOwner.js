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
// import { postApi } from 'core/apis/api';
import { useTranslation } from 'react-i18next';
import { tokenPayload } from 'helper';

const AddOwner = (props) => {
  const {t} = useTranslation();
  const { open, handleClose } = props;


  const validationSchema = yup.object({
     ownerName: yup
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
    // password: yup.string().required('Password is required')
  });

  // const company = JSON.parse(localStorage.getItem('companyData'));
  const payload = tokenPayload();

  const initialValues = {
    ownerName: '',
    email: '',
    phoneNo: '',
    address: '',
    // password: ''
  };

  const AddOwner = async (values, resetForm) => {
    values.companyId = payload.companyId;
    console.log(values,"valusesvalusesvalusesvaluses.")

    // console.log(companyId,"companyIdcompanyIdcompanyIdcompanyIdcompanyId")
    try {
      const response = await postApi( urls.owner.create , values);
      console.log("response", response)

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
      AddOwner(values, resetForm);
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
          <Typography variant="h6">Create Owner</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </DialogTitle>

        <DialogContent dividers>
       
          <form onSubmit={formik.handleSubmit}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6}>
                <FormLabel>Owner Name</FormLabel>
                <TextField
                  id="ownerName"
                  name="ownerName"
                  size="small"
                  fullWidth
                  value={formik.values.ownerName}
                  onChange={formik.handleChange}
                  error={formik.touched.ownerName && Boolean(formik.errors.ownerName)}
                  helperText={formik.touched.ownerName && formik.errors.ownerName}
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
              {/* <Grid item xs={12} sm={6}>
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
              </Grid> */}
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

AddOwner.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default AddOwner;
