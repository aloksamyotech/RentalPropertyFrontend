/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
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
import { debounce, throttle } from 'lodash';
import { useCallback } from 'react';

const DeleteProperty = ({ open, handleClose, id }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await patchApi(urls.property.delete, { isDeleted: true }, { id });

      if (result?.status === 200 || result?.success) {
        toast.success(t('Property Deleted Successfully'));
        // navigate('/dashboard/property');
        handleClose();
      } else {
        toast.error(t('cannot delete property'));
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error(t('cannotDeleteProperty'));
    } finally {
      setLoading(false);
    }
  };

  // const handleDelete = useCallback(debounce(handleDeleteRequest, 500),[]);
  

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('delete property')}</DialogTitle>
      <DialogContent>
        <p>{t('are you sure you want to delete property?')}</p>
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

DeleteProperty.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default DeleteProperty;
