/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  FormLabel,
  Grid,
  TextField,
  Autocomplete,
  Typography,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { getApi, postApi } from 'core/apis/api';
import { urls } from 'core/Constant/urls';
import { tokenPayload } from 'helper';

const AddComplaints = ({ open, handleClose }) => {
  const { t } = useTranslation();
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(false); 
  const payload = tokenPayload();

  const fetchPropertyData = async () => {
    setLoading(true);
    try {
      const response = await getApi(urls.property.propertydata, { id: payload.companyId });
      setPropertyData(response?.data || []);
    } catch (err) {
      console.error('Error fetching property data:', err);
      toast.error(t('Failed to fetch property data!'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchPropertyData();
  }, [open]);

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
      propertyId: '',
      concernTopic: '',
      description: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const complaintData = {
        ...values,
        AgentId: payload.reporterId,
        companyId: payload.companyId,
        tenantId: payload._id,
      };

      try {
        const response = await postApi(urls.Complaints.create, complaintData);
        if (response.success) {
          toast.success(t('Complaint successfully registered!'));
          resetForm();
          setTimeout(() => {
            handleClose();
          }, 200);
        }
      } catch (err) {
        console.error(err);
        toast.error(t('Something went wrong!'));
      }
    },
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">{t('Add New Complaint')}</Typography>
        <ClearIcon onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <DialogContentText>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              {t('Complaint Information')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormLabel>{t('Property')}</FormLabel>
                <Autocomplete
                  disablePortal
                  size="small"
                  options={propertyData.map((property) => ({
                    label: property.propertyname,
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
          </DialogContentText>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          color="primary"
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

export default AddComplaints;
