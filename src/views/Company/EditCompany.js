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

const EditComplain = ({ open, handleClose, data }) => {
  const { t } = useTranslation();
  const [complainData, setComplainData] = useState([]);
  const payload = tokenPayload();

  useEffect(() => {
    if (open) {
      fetchComplainData();
    }
  }, [open]);

  const fetchComplainData = async () => {
    try {
      const response = await getApi(urls.property.propertydata, { id: payload.companyId });
      if (Array.isArray(response?.data)) {
        setComplainData(response.data);
      } else {
        setComplainData([]);
        toast.error(t('noPropertyDataAvailable'));
      }
    } catch (err) {
      console.error('Error fetching property data:', err);
      toast.error(t('failedToFetchPropertyData'));
    }
  };

  const editComplain = async (values, resetForm) => {
    try {
      const response = await updateApi(urls.Complaints.edit, values, { id: data._id });

      if (response.success) {
        toast.success(t('complaintUpdatedSuccessfully'));
        resetForm();
        handleClose();
      } else {
        toast.error(t('failedToUpdateComplaint'));
      }
    } catch (err) {
      console.error('Error updating complaint:', err);
      toast.error(t('somethingWentWrong'));
    }
  };

  const validationSchema = yup.object({
    propertyId: yup.string().required(t('Property is required')),
    concernTopic: yup
      .string()
      .max(30, t('Topic cannot exceed 30 characters'))
      .required(t('Topic is required')),
    description: yup
      .string()
      .max(200, t('Description cannot exceed 200 characters'))
      .required(t('Description is required')),
  });

  const formik = useFormik({
    initialValues: {
      propertyId: data?.propertyId?._id || '',
      concernTopic: data?.concernTopic || '',
      description: data?.description || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      console.log(values,"vlaues")
      editComplain(values, resetForm);
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
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            {t('Complaint Information')}
          </Typography>
          <Grid container spacing={2}>
            {/* Property Selection */}
            <Grid item xs={12}>
              <FormLabel>{t('Property')}</FormLabel>
              <Autocomplete
                disablePortal
                size="small"
                options={complainData.map((property) => ({
                  label: property.propertyName,
                  value: property._id,
                }))}
                getOptionLabel={(option) => option?.label || ''}
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
                }}
              />
            </Grid>

            {/* Concern Topic */}
            <Grid item xs={12}>
              <FormLabel>{t('Topic')}</FormLabel>
              <TextField
                id="concernTopic"
                name="concernTopic"
                size="small"
                fullWidth
                value={formik.values.concernTopic}
                onChange={formik.handleChange}
                error={formik.touched.concernTopic && Boolean(formik.errors.concernTopic)}
                helperText={formik.touched.concernTopic && formik.errors.concernTopic}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <FormLabel>{t('Description')}</FormLabel>
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
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={formik.handleSubmit} variant="contained" color="primary">
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
