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

const DeleteAgent = ({ open, handleClose, id }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const startTime = Date.now(); // Ensure startTime is defined
    try {
      const result = await patchApi(urls.agent.delete, { isDeleted: true }, { id });

      if (result?.success) {
        toast.success(t('agent Deleted successfully'));
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 500 - elapsedTime);
        setTimeout(() => {
          setLoading(false);
          handleClose();
        }, remainingTime);
      } else {
        toast.error(t('cannot delete agent'));
        setLoading(false); // Ensure loading is set to false in case of failure
      }
    } catch (error) {
      console.error('Error deleting Agent:', error);
      toast.error(t('cannot delete Agent'));
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('deleteAgent')}</DialogTitle>
      <DialogContent>
        <p>{t('areYouSureDeleteAgent')}</p>
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

DeleteAgent.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default DeleteAgent;
