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


const DeleteBill = ({ open, handleClose, id }) => {
  const { t } = useTranslation(); 
  const [loading, setLoading] = useState(false); 

  const handleDelete = async () => {
    setLoading(true); 
    try {
      const result = await patchApi(urls.bill.delete, { isDeleted: true }, { id });

      if (result?.success) {
        toast.success(t('BillDeletedSuccessfully')); 
        handleClose(); 
      }
    } catch (error) {
      console.error('Error deleting Bill:', error);
      toast.error(t('cannot delete bill')); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('deleteBill')}</DialogTitle>
      <DialogContent>
        <p>{t('areYouSureDeleteBill')}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={loading}>
          {t('cancel')}
        </Button>
        <Button
          onClick={handleDelete}
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


DeleteBill.propTypes = {
  open: PropTypes.bool.isRequired, 
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired, 
};

export default DeleteBill;
