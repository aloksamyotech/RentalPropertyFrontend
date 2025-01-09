/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  FormControl,
  FormLabel,
  Grid,
  TextField,
  MenuItem,
  Select,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import Autocomplete from '@mui/material/Autocomplete';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { urls } from 'core/Constant/urls';
import PropTypes from 'prop-types';
import { postApi, getApi } from 'core/apis/api';
import { useTranslation } from 'react-i18next';
import { tokenPayload } from 'helper';

const AddProperty = (props) => {
  const { t } = useTranslation();
  const { open, handleClose } = props;
  const [ownerName, setOwnerData] = useState([]);
  const [typeData, setTypeData] = useState([]);

  // Fetch company data from localStorage
  // const company = JSON.parse(localStorage.getItem('companyData'));
  const payload = tokenPayload();

  const fetchOwnerData = async () => {
    try {
      const response = await getApi(urls.owner.ownerdata, { id: payload._id });
      console.log("Fetched Owner Data:", response.data);
      setOwnerData(response.data);
    } catch (err) {
      console.error("Error fetching owner data:", err);
      toast.error('Failed to fetch owner data!');
    }
  };

  const fetchTypeData = async () => {
    try {
      const response = await getApi(urls.propertyTypes.getdata, { id: payload._id });
      console.log("Fetched Type Data:", response.data);
      setTypeData(response.data);
    } catch (err) {
      console.error("Error fetching type data:", err);
      toast.error('Failed to fetch property types!');
    }
  };

  const addProperty = async (values, resetForm) => {
    values.companyId = payload._id;
    console.log("Property Data:", values);

    try {
      const response = await postApi(urls.property.create, values);
      if (response.success) {
        toast.success('Successfully registered property!');
        resetForm();
        setTimeout(() => {
          handleClose();
        }, 200);
      } else {
        toast.error('Failed to register property!');
      }
    } catch (err) {
      console.error("Error adding property:", err);
      toast.error('Something went wrong!');
    }
  };

  // Fetch data when dialog opens
  useEffect(() => {
    if (open) {
      fetchOwnerData();
      fetchTypeData();
    }
  }, [open]);

  // Validation schema
  const validationSchema = yup.object({
    propertyname: yup
      .string()
      .max(50, 'Property Name must be at most 50 characters')
      .required('Property Name is required'),
    typeId: yup.string().required('Type is required'),
    description: yup
      .string()
      .required('Description is required')
      .max(200, t('Description cannot exceed 200 characters')),
      rent: yup
      .number()
      .typeError('Rent must be a number')
      .min(100000, 'Rent must be at least 6 digits')
      .max(999999, 'Rent cannot exceed 6 digits')
      .required('Rent is required'),
    address: yup
      .string()
      .max(100, t('Address cannot exceed 100 characters'))
      .required(t('Address is required')),
    zipcode: yup.string().required('Zip Code is required'),
    maplink: yup
      .string()
      .url('Must be a valid URL')
      .required('Google Map Link is required'),
    ownerId: yup.string().required('Owner Name is required'),
  });

  // Initial values for Formik
  const initialValues = {
    propertyname: '',
    typeId: '',
    description: '',
    rent: '',
    address: '',
    zipcode: '',
    maplink: '',
    ownerId: '',
  };

  // Formik setup
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      console.log("Submitted Values:", values);
      addProperty(values, resetForm);
    },
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle
        id="scroll-dialog-title"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Typography variant="h6">Add Property</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Property Name */}
            <Grid item xs={12} sm={6}>
              <FormLabel>Property Name</FormLabel>
              <TextField
                id="propertyname"
                name="propertyname"
                size="small"
                fullWidth
                value={formik.values.propertyname}
                onChange={formik.handleChange}
                error={formik.touched.propertyname && Boolean(formik.errors.propertyname)}
                helperText={formik.touched.propertyname && formik.errors.propertyname}
              />
            </Grid>

            {/* Type */}
            <Grid item xs={12} sm={6}>
              <FormLabel>Type</FormLabel>
              <Select
                id="typeId"
                name="typeId"
                size="small"
                fullWidth
                value={formik.values.typeId}
                onChange={formik.handleChange}
                error={formik.touched.typeId && Boolean(formik.errors.typeId)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Type
                </MenuItem>
                {typeData.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.typeId && formik.errors.typeId && (
                <Typography variant="body2" color="error">
                  {formik.errors.typeId}
                </Typography>
              )}
            </Grid>

            {/* Owner Name */}
            <Grid item xs={12} sm={6}>
              <FormLabel>Owner Name</FormLabel>
              <Autocomplete
                disablePortal
                size="small"
                options={ownerName.map((owner) => ({
                  label: owner.ownerName,
                  value: owner._id,
                }))}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.ownerId && Boolean(formik.errors.ownerId)}
                    helperText={formik.touched.ownerId && formik.errors.ownerId}
                  />
                )}
                onChange={(event, value) => {
                  formik.setFieldValue('ownerId', value ? value.value : '');
                }}
              />
            </Grid>
               {/* Rent */}
               <Grid item xs={12} sm={6}>
              <FormLabel>Rent</FormLabel>
              <TextField
                id="rent"
                name="rent"
                type="number"
                size="small"
                fullWidth
                value={formik.values.rent}
                onChange={formik.handleChange}
                error={formik.touched.rent && Boolean(formik.errors.rent)}
                helperText={formik.touched.rent && formik.errors.rent}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <FormLabel>Description</FormLabel>
              <TextField
                id="description"
                name="description"
                size="small"
                fullWidth
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
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

         

            {/* Zip Code */}
            <Grid item xs={12} sm={6}>
              <FormLabel>Zip Code</FormLabel>
              <TextField
                id="zipcode"
                name="zipcode"
                size="small"
                fullWidth
                value={formik.values.zipcode}
                onChange={formik.handleChange}
                error={formik.touched.zipcode && Boolean(formik.errors.zipcode)}
                helperText={formik.touched.zipcode && formik.errors.zipcode}
              />
            </Grid>

            {/* Google Map Link */}
            <Grid item xs={12} sm={6}>
              <FormLabel>Google Map Link</FormLabel>
              <TextField
                id="maplink"
                name="maplink"
                size="small"
                fullWidth
                value={formik.values.maplink}
                onChange={formik.handleChange}
                error={formik.touched.maplink && Boolean(formik.errors.maplink)}
                helperText={formik.touched.maplink && formik.errors.maplink}
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
        >
          Save
        </Button>
        <Button
          onClick={() => {
            formik.resetForm();
            handleClose();
          }}
          variant="outlined"
          color="error"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddProperty.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddProperty;
