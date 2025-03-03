/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { patchApi } from 'core/apis/api';
import { urls } from 'core/Constant/urls';

const DeleteBooking = ({ open, handleClose, id }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleDeleteSubmit = async () => {
    setLoading(true); 
    const startTime = Date.now();

   
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    try {
      const result = await patchApi(urls.booking.breakTheBooking, {}, { id });

      if (result?.success) {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 1000 - elapsedTime);

        setTimeout(() => {
          handleClose();
        }, remainingTime);

        toast.success(t('bookingDeletedSuccessfully'));
      } else {
        toast.error(t('cannotDeleteBooking'));
      }
    } catch (error) {
      toast.error(t('cannotDeleteBooking'));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('Delete Booking')}</DialogTitle>
      <DialogContent>
        <p>{t('areYouSureDeleteBooking')}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={loading}>
          {t('cancel')}
        </Button>
        <Button
          onClick={handleDeleteSubmit}
          color="error"
          variant="contained"
          disabled={loading} 
        >
          {loading ? t('deleting') : t('delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteBooking.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default DeleteBooking;