/* eslint-disable prettier/prettier */ 
/* eslint-disable react/prop-types */ 
import React, { useEffect, useState } from 'react'; 
import { Button, Dialog, FormLabel, Grid, TextField, Typography, DialogActions, DialogContent, DialogTitle } from '@mui/material'; 
import ClearIcon from '@mui/icons-material/Clear'; 
import Autocomplete from '@mui/material/Autocomplete'; 
import { useFormik } from 'formik'; 
import * as yup from 'yup'; 
import { toast } from 'react-toastify'; 
import { useTranslation } from 'react-i18next'; 
import { updateApi, getApi } from 'core/apis/api'; 
import { tokenPayload } from 'helper'; 
import { urls } from 'core/Constant/urls'; 

const GenerateMonthlyBill = ({ open, handleClose, data }) => { 
  const { t } = useTranslation(); 
  const [tenantData, setTenantData] = useState([]); 
  const [propertyData, setPropertyData] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const payload = tokenPayload(); 
  console.log(data, "data");

  const fetchTenantData = async () => { 
    try { 
      setLoading(true); 
      const response = await getApi(urls.tenant.tenantdata, { id: payload.companyId }); 
      setTenantData(response?.data || []); 
    } catch (error) { 
      toast.error(t('failedToFetchTenantData')); 
    } finally { 
      setLoading(false); 
    } 
  }; 

  const fetchPropertyData = async () => { 
    try { 
      setLoading(true); 
      const response = await getApi(urls.property.propertydata, { id: payload.companyId }); 
      setPropertyData(response?.data || []); 
    } catch (error) { 
      toast.error(t('failedToFetchPropertyData')); 
    } finally { 
      setLoading(false); 
    } 
  };

  useEffect(() => { 
    if (open) { 
      fetchTenantData(); 
      fetchPropertyData(); 
    } 
  }, [open]);

  // Function to generate the bill
  const generateBill = async (values, resetForm) => {
    const updatedValues = {
      ...values,
      companyId: payload.companyId,
      createdBy: payload._id,
      billingMonth: new Date(values.billingMonth).toISOString().split('T')[0], 
      rentAmount: parseFloat(values.rentAmount),
      extraAmount: parseFloat(values.extraAmount), 
      electricityBillAmount: calculateElectricityBill(values.electricityUnit, values.electricityRate),
      totalBillAmount: calculateTotalBill(values.rentAmount, values.extraAmount, values.billDuration, values.electricityBillAmount),
    };

    try {
      const response = await updateApi(urls.billing.generateBill, updatedValues);
      if (response.success) {
        toast.success(t('billGeneratedSuccessfully'));
        resetForm();
        setTimeout(handleClose, 200);
      } else {
        toast.error(t('failedToGenerateBill'));
      }
    } catch (error) {
      toast.error(t('failedToGenerateBill'));
    }
  };

  const calculateElectricityBill = (units, rate) => {
    return units * rate; // Electricity bill is calculated by multiplying units and rate
  };

  const calculateTotalBill = (rent, extra, duration, electricityBill) => {
    const totalRent = rent * duration; 
    const totalAmount = totalRent + electricityBill + extra; 
    return totalAmount;
  };

  const validationSchema = yup.object({
    tenantId: yup.string().required(t('Tenant is required')),
    propertyId: yup.string().required(t('Property is required')),
    billingMonth: yup.date().required(t('Billing Month is required')),
    rentAmount: yup.number().required(t('Rent Amount is required')).positive(t('Rent Amount must be positive')),
    extraAmount: yup.number().required(t('Extra Amount is required')).min(0, t('Extra Amount cannot be negative')),
    electricityUnit: yup.number().required(t('Electricity Bill Unit is required')).min(0, t('Electricity Bill Unit cannot be negative')),
    electricityRate: yup.number().required(t('Rate of Electricity Bill Unit is required')).positive(t('Electricity Rate must be positive')),
    billDuration: yup.number().required(t('Bill Duration (in months) is required')).min(1, t('Duration must be at least 1 month')),
  });

  const formik = useFormik({
    initialValues: {
      tenantId: data?.tenantId?._id || '',
      propertyId: data?.propertyId?._id || '',
      billingMonth: data?.billingMonth ? new Date(data.billingMonth).toISOString().split('T')[0] : '',
      rentAmount: data?.rentAmount || '',
      extraAmount: data?.extraAmount || '',
      electricityUnit: data?.electricityUnit || 0, 
      electricityRate: data?.electricityRate || 0, 
      billDuration: data?.billDuration || 1, 
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      generateBill(values, resetForm);
    },
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">{t('generateMonthlyBill')}</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Tenant Name')}</FormLabel>
                 <TextField
                              id="ownerName"
                              name="ownerName"
                              size="small"
                              fullWidth
                              value={formik.values.tenantId}
                              onChange={formik.handleChange}
                              error={formik.touched.ownerName && Boolean(formik.errors.ownerName)}
                              helperText={formik.touched.ownerName && formik.errors.ownerName}
                            />
            
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Property')}</FormLabel>
              <Autocomplete
                disablePortal
                size="small"
                options={propertyData.map((property) => ({
                  label: property.propertyname,
                  value: property._id,
                  rentAmount: property.rent,
                }))}
                value={
                  propertyData
                    .map((property) => ({ label: property.propertyname, value: property._id }))
                    .find((option) => option.value === formik.values.propertyId) || null
                }
                onChange={(event, value) => {
                  formik.setFieldValue('propertyId', value?.value || '');
                  formik.setFieldValue('rentAmount', value?.rentAmount || formik.values.rentAmount);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.propertyId && Boolean(formik.errors.propertyId)}
                    helperText={formik.touched.propertyId && formik.errors.propertyId}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Rent Amount')}</FormLabel>
              <TextField
                id="rentAmount"
                name="rentAmount"
                type="number"
                size="small"
                fullWidth
                value={formik.values.rentAmount}
                onChange={formik.handleChange}
                error={formik.touched.rentAmount && Boolean(formik.errors.rentAmount)}
                helperText={formik.touched.rentAmount && formik.errors.rentAmount}
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Extra Amount')}</FormLabel>
              <TextField
                id="extraAmount"
                name="extraAmount"
                type="number"
                size="small"
                fullWidth
                value={formik.values.extraAmount}
                onChange={formik.handleChange}
                error={formik.touched.extraAmount && Boolean(formik.errors.extraAmount)}
                helperText={formik.touched.extraAmount && formik.errors.extraAmount}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Electricity Bill Unit')}</FormLabel>
              <TextField
                id="electricityUnit"
                name="electricityUnit"
                type="number"
                size="small"
                fullWidth
                value={formik.values.electricityUnit}
                onChange={formik.handleChange}
                error={formik.touched.electricityUnit && Boolean(formik.errors.electricityUnit)}
                helperText={formik.touched.electricityUnit && formik.errors.electricityUnit}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Rate of Electricity Bill Unit')}</FormLabel>
              <TextField
                id="electricityRate"
                name="electricityRate"
                type="number"
                size="small"
                fullWidth
                value={formik.values.electricityRate}
                onChange={formik.handleChange}
                error={formik.touched.electricityRate && Boolean(formik.errors.electricityRate)}
                helperText={formik.touched.electricityRate && formik.errors.electricityRate}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Total Electricity Bill')}</FormLabel>
              <TextField
                id="electricityBillAmount"
                name="electricityBillAmount"
                type="number"
                size="small"
                fullWidth
                value={calculateElectricityBill(formik.values.electricityUnit, formik.values.electricityRate)}
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Billing Month')}</FormLabel>
              <TextField
                id="billingMonth"
                name="billingMonth"
                type="month"
                size="small"
                fullWidth
                value={formik.values.billingMonth}
                onChange={formik.handleChange}
                error={formik.touched.billingMonth && Boolean(formik.errors.billingMonth)}
                helperText={formik.touched.billingMonth && formik.errors.billingMonth}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Bill Duration (Months)')}</FormLabel>
              <TextField
                id="billDuration"
                name="billDuration"
                type="number"
                size="small"
                fullWidth
                value={formik.values.billDuration}
                onChange={formik.handleChange}
                error={formik.touched.billDuration && Boolean(formik.errors.billDuration)}
                helperText={formik.touched.billDuration && formik.errors.billDuration}
              />
            </Grid>

          </Grid>
          <DialogActions>
            <Button type="submit" variant="contained" color="secondary">
              {t('Generate Bill')}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                formik.resetForm();
                handleClose();
              }}
            >
              {t('Cancel')}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateMonthlyBill;
