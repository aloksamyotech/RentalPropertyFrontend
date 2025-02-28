/* eslint-disable prettier/prettier */
import React, { useState, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { patchApi } from 'core/apis/api';
import { urls } from 'core/Constant/urls';
import { debounce } from 'lodash';

const DeleteServiceProvider = ({ open, handleClose, id }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDeleteSubmit = async () => {
    setLoading(true);
    try {
      const result = await patchApi(urls.serviceProvider.delete, { isDeleted: true }, { id });

      if (result?.status === 200 || result?.success) {
        toast.success(t('Service Provider Deleted Successfully'));
        handleClose();  // Close the dialog after successful delete
      } else {
        toast.error(t('Cannot Delete Service Provider'));
      }
    } catch (error) {
      console.error('Error deleting service provider:', error);
      toast.error(t('Error deleting Service Provider'));
    } finally {
      setLoading(false);
    }
  };

  // Debounced version of the handleDeleteSubmit function
  // const debouncedDelete = useCallback(debounce(handleDeleteSubmit, 500), []);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('Delete Service Provider')}</DialogTitle>
      <DialogContent>
        <p>{t('Are you sure you want to delete this service provider?')}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={loading}>
          {t('Cancel')}
        </Button>
        <Button
          onClick={handleDeleteSubmit}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading ? t('Deleting...') : t('Delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteServiceProvider.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default DeleteServiceProvider;
