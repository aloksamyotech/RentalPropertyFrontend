/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'; 
import { Button, Dialog, FormLabel, Grid,Paper, TextField, Typography, DialogActions, DialogContent, DialogTitle } from '@mui/material'; 
import ClearIcon from '@mui/icons-material/Clear'; 
import { useFormik, FieldArray } from 'formik'; 
import * as yup from 'yup'; 
import { toast } from 'react-toastify'; 
import { useTranslation } from 'react-i18next'; 
import { updateApi } from 'core/apis/api'; 
import { tokenPayload } from 'helper'; 
import { urls } from 'core/Constant/urls';
import Divider from '@mui/material/Divider';

const GenerateMonthlyBill = ({ open, handleClose, data }) => { 
  const { t } = useTranslation(); 
  const payload = tokenPayload(); 
  const [property , setProperty] = useState(null); 
  const [tenant , setTenant] = useState(null); 
  console.log("data",data);

  useEffect(() => {
    if (data?.propertyId) setProperty(data.propertyId);
    if (data?.tenantId) setTenant(data.tenantId);
  }, [data]);

  const calculateElectricityBill = (units, rate) => {
    return units * rate; 
  };

  const calculateTotalBill = (rate, units, rent, extra) => {
    // please check this 
    console.log(rate, units, rent, extra)
    const totalElectricity = calculateElectricityBill(units, rate); 
    const totalAmount = rent + totalElectricity + extra; 
    return totalAmount;
  };
  // const billingMonth = new Date(values.billingMonth).toISOString().split('T')[0]
  // console.log( billingMonth,"billingMonth")
  const generateBill = async (values, resetForm) => {
    const updatedValues = {
      ...values,
      companyId: payload.companyId,
      createdBy: payload._id,
      billingMonth: new Date(values.billingMonth).toISOString().split('T')[0],
      rentAmount :values.rentAmount,
      extraAmount: values.extraAmount, 
      electricityBillAmount: calculateElectricityBill(values.electricityUnit, values.electricityRate),
      totalBillAmount: calculateTotalBill(values.electricityRate, values.electricityUnit, values.rentAmount, values.extraAmount),
    };

    try {
      const response = await updateApi(urls.bill.createBill, updatedValues);
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

  const validationSchema = yup.object({
    tenantId: yup.string().required(t('Tenant is required')),
    propertyId: yup.string().required(t('Property is required')),
    billingMonth: yup.date().required(t('Billing Month is required')),
    rentAmount: yup.number(),
    extraAmount: yup.number().required(t('Extra Amount is required')).min(0, t('Extra Amount cannot be negative')),
    electricityUnit: yup.number().required(t('Electricity Bill Unit is required')).min(0, t('Electricity Bill Unit cannot be negative')),
    electricityRate: yup.number().required(t('Rate of Electricity Bill Unit is required')).positive(t('Electricity Rate must be positive')),
    electricityBillAmount: yup.number(),
    note: yup.string(),
    totalBillAmount: yup.number()
  });

  const formik = useFormik({
    initialValues: {
      tenantId: tenant?._id || '', 
      propertyId: property?._id || '', 
      billingMonth: data?.billingMonth ? new Date(data.billingMonth).toISOString().split('T')[0] : '',
      rentAmount: data?.rentAmount  ,  
      extraAmount: data?.extraAmount || 0,
      electricityUnit: data?.electricityUnit || 0, 
      electricityRate: data?.electricityRate || 0,
      electricityBillAmount: 0,
      totalBillAmount: 0, 
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      generateBill(values, resetForm);
    },
  });

  useEffect(() => {
    const electricityBillAmount = calculateElectricityBill(formik.values.electricityUnit, formik.values.electricityRate);
    const totalAmount = calculateTotalBill(formik.values.electricityRate, formik.values.electricityUnit, formik.values.rentAmount, formik.values.extraAmount);

    formik.setFieldValue('electricityBillAmount', electricityBillAmount);
    formik.setFieldValue('totalBillAmount', totalAmount);
  }, [formik.values.electricityUnit, formik.values.electricityRate, formik.values.extraAmount, formik.values.rentAmount]);

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
                id="tenantId"
                name="tenantId"
                size="small"
                fullWidth
                value={formik.values.tenantId}
                onChange={formik.handleChange}
                error={formik.touched.tenantId && Boolean(formik.errors.tenantId)}
                helperText={formik.touched.tenantId && formik.errors.tenantId}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Property Name')}</FormLabel>
              <TextField
                id="propertyId"
                name="propertyId"
                size="small"
                fullWidth
                value={formik.values.propertyId}
                onChange={formik.handleChange}
                error={formik.touched.propertyId && Boolean(formik.errors.propertyId)}
                helperText={formik.touched.propertyId && formik.errors.propertyId}
                required
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

            {/* <Grid item xs={12} sm={6}>
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
            </Grid> */}

<FieldArray name="extraCharges">
  {({ push, remove }) => (
    (formik.values.extraCharges || []).map((charge, index) => (
      <Grid container spacing={2} key={index}>
        <Grid item xs={6}>
          <TextField 
            name={`extraCharges[${index}].description`} 
            label={t('Description')} 
            fullWidth 
            onChange={formik.handleChange} 
            value={charge.description || ''}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField 
            name={`extraCharges[${index}].price`} 
            label={t('Price')} 
            type="number" 
            fullWidth 
            onChange={formik.handleChange} 
            value={charge.price || ''}
          />
        </Grid>
        <Grid item xs={2}>
          <Button onClick={() => remove(index)}>Remove</Button>
        </Grid>
      </Grid>
    ))
  )}
</FieldArray>

            <Divider />
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
                value={formik.values.electricityBillAmount}
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
              <FormLabel>{t('Note')}</FormLabel>
              <TextField
                id="note"
                name="note"
                size="small"
                fullWidth
                value={formik.values.note}
                onChange={formik.handleChange}
                error={formik.touched.note && Boolean(formik.errors.note)}
                helperText={formik.touched.note && formik.errors.note}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel>{t('Total Amount')}</FormLabel>
              <TextField
                id="totalBillAmount"
                name="totalBillAmount"
                type="number"
                size="small"
                fullWidth
                value={formik.values.totalBillAmount}
                disabled
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
