/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {
  FormControl,
  FormLabel,
  Grid,
  TextField,
} from '@mui/material';
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

const AddAnouncement = (props) => {
  const { t } = useTranslation();
  const { open, handleClose } = props;

  // -----------  validationSchema
  const validationSchema = yup.object({
    topic: yup.string().required(t('topicRequired')),
    description: yup.string().required(t('descriptionRequired')),
  });

  // -----------   initialValues
  const initialValues = {
    topic: '',
    description: '',
  };

  // formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      console.log('Announcement Values', values);
      handleClose();
      toast.success(t('announcementAdded'));
    }
  });

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6">{t('addNew')}</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <form>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <Typography style={{ marginBottom: '15px' }} variant="h6">
                {t('announcementInformation')}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6}>
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
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>{t('description')}</FormLabel>
                  <TextField
                    id="description"
                    name="description"
                    size="small"
                    fullWidth
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
          <Button onClick={formik.handleSubmit} variant="contained" color="primary" type="submit">
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
    </div>
  );
};

export default AddAnouncement;
