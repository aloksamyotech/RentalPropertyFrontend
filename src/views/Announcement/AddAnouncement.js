/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FormControl, FormLabel, Grid, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { tokenPayload } from 'helper';
import { postApi } from 'core/apis/api'; // Import postApi
import { urls } from 'core/Constant/urls';

const AddAnnouncement = (props) => {
  const { t } = useTranslation();
  const { open, handleClose } = props;
  const payload = tokenPayload();

  // API call function
  const AddAnnouncement = async (values, resetForm) => {
    const data = { ...values, companyId: payload.companyId };

    try {
      const response = await postApi(urls.Announcement.create, data);

      if (response.success) {
        toast.success(t('announcementAdded')); // Success message
        resetForm(); // Reset the form
        setTimeout(() => {
          handleClose(); // Close the dialog
        }, 200);
      } else {
        toast.error(response.message || t('errorOccurred'));
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.message || t('errorOccurred'));
    }
  };

  // Validation Schema
  const validationSchema = yup.object({
    topic: yup.string().required(t('topicRequired')),
    details: yup.string().required(t('detailsRequired')),
  });

  // Initial Form Values
  const initialValues = {
    topic: '',
    details: '',
  };

  // Formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      AddAnnouncement(values, resetForm);
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
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography variant="h6">{t('addNewAnnouncement')}</Typography>
        <ClearIcon onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <Typography sx={{ mb: 2 }} variant="h6">
              {t('announcementInformation')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormLabel>{t('topic')}</FormLabel>
                <TextField
                  id="topic"
                  name="topic"
                  size="small"
                  fullWidth
                  value={formik.values.topic}
                  onChange={formik.handleChange}
                  error={formik.touched.topic && Boolean(formik.errors.topic)}
                  helperText={formik.touched.topic && formik.errors.topic}
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel>{t('details')}</FormLabel>
                <TextField
                  id="details"
                  name="details"
                  size="small"
                  fullWidth
                  multiline
                  rows={4}
                  value={formik.values.details}
                  onChange={formik.handleChange}
                  error={formik.touched.details && Boolean(formik.errors.details)}
                  helperText={formik.touched.details && formik.errors.details}
                />
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" color="primary">
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
      </form>
    </Dialog>
  );
};

export default AddAnnouncement;
