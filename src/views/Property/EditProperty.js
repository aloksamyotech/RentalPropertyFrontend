/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  MenuItem,
  Select,
  Button,
  Dialog,
  Box,
  Chip,
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
import { updateApi, getApi } from 'core/apis/api'; // Ensure getApi is imported
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete from '@mui/material/Autocomplete';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { urls } from 'core/Constant/urls';
import { tokenPayload } from 'helper';

const EditProperty = ({ open, handleClose, data }) => {
  const { t } = useTranslation();
  const [ownerName, setOwnerData] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const payload = tokenPayload();

  useEffect(() => {
    if (open) {
      fetchOwnerData();
      fetchTypeData();
    }
  }, [open]);

  const fetchOwnerData = async () => {
      const response = await getApi(urls.owner.ownerdata, { id: payload._id });
      setOwnerData(response.data);
  };

  const fetchTypeData = async () => {
      const response = await getApi(urls.propertyTypes.getdata, { id: payload._id });
      setTypeData(response.data);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  const handleFileRemove = (filename) => {
    setAttachments((prev) => prev.filter((file) => file.name !== filename));
  };

  const editProperty = async (values, resetForm) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key !== 'files') formData.append(key, values[key]);
    });
    attachments.forEach((file) => formData.append('files', file));
    formData.append('companyId', payload._id);

    try {
      const response = await updateApi(urls.property.editdata, formData,{ id: data._id }, { 'Content-Type': 'multipart/form-data' });

      if (response.success) {
        toast.success(t('Property updated successfully!'));
        resetForm();
        setTimeout(handleClose, 200);
      } else {
        toast.error(t('Failed to update property!'));
      }
    } catch (err) {
      console.error('Error updating property:', err);
      toast.error(t('Something went wrong!'));
    }
  };

  const validationSchema = yup.object({
    propertyname: yup.string().max(50, t('Property Name must be at most 50 characters')).required(t('Property Name is required')),
    typeId: yup.string().required(t('Type is required')),
    description: yup.string().max(200, t('Description cannot exceed 200 characters')).required(t('Description is required')),
    rent: yup.number().min(100, t('Rent must be at least 3 digits')).max(999999, t('Rent cannot exceed 6 digits')).required(t('Rent is required')),
    address: yup.string().max(100, t('Address cannot exceed 100 characters')).required(t('Address is required')),
    zipcode: yup.string().required(t('Zip Code is required')),
    maplink: yup.string().url(t('Must be a valid URL')).required(t('Google Map Link is required')),
    ownerId: yup.string().required(t('Owner Id is required')),
  });

  const formik = useFormik({
    initialValues: {
      propertyname: data?.propertyname || '',
      typeId: data?.typeId || '',
      description: data?.description || '',
      rent: data?.rent || '',
      address: data?.address || '',
      zipcode: data?.zipcode || '',
      maplink: data?.maplink || '',
      ownerId: data?.ownerId || '',
      files: [],
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { resetForm }) => editProperty(values, resetForm),
  });


  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">{t('Edit Property')}</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </div>
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
           {/* Owner Name */}
<Grid item xs={12} sm={6}>
  <FormLabel>Owner Name</FormLabel>
  <Autocomplete
    disablePortal
    size="small"
    options={ownerName}
    getOptionLabel={(option) => option.ownerName || ''}
    renderInput={(params) => (
      <TextField
        {...params}
        fullWidth
        error={formik.touched.ownerId && Boolean(formik.errors.ownerId)}
        helperText={formik.touched.ownerId && formik.errors.ownerId}
      />
    )}
    value={ownerName.find((owner) => owner._id === formik.values.ownerId) || null}
    onChange={(event, value) => {
      formik.setFieldValue('ownerId', value ? value._id : '');
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

                   <Grid item xs={12}>
              <Box mb={1}>
                <FormLabel>{t('Attachment')}</FormLabel>
              </Box>
              <Button variant="contained" component="label">
                {t('Upload Files')}
                <input type="file" multiple hidden onChange={handleFileChange} />
              </Button>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1,
                  flexWrap: 'wrap',
                  maxHeight: '100px',
                  overflowY: 'auto',
                  marginTop: 1,
                }}
              >
                {attachments.map((file, index) => (
                  <Chip
                    key={index}
                    sx={{ background: 'green', color: 'white' }}
                    label={file.name}
                    onDelete={() => handleFileRemove(file.name)}
                    deleteIcon={<CloseIcon />}
                  />
                ))}
              </Box>
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
  );
};

EditProperty.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default EditProperty;
