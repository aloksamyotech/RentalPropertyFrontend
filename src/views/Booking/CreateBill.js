import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  FormLabel,
  Grid,
  TextField,
  Typography,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { postApi } from 'core/apis/api';
import { tokenPayload } from 'helper';
import { urls } from 'core/Constant/urls';
import AddIcon from '@mui/icons-material/Add';

const GenerateMonthlyBill = ({ open, handleClose, data }) => {
  const { t } = useTranslation();
  const payload = tokenPayload();
  const [property, setProperty] = useState(null);
  const [tenant, setTenant] = useState(null);

  useEffect(() => {
    if (data?.propertyId) setProperty(data.propertyId);
    if (data?.tenantId) setTenant(data.tenantId);
  }, [data]);

  const calculateElectricityBill = (units, rate) => {
    return Number(units) * Number(rate);
  };

  const calculateTotalBill = (rate, units, rent, extraCharges) => {
    const totalElectricity = calculateElectricityBill(units, rate);
    const totalExtraCharges = extraCharges.reduce((sum, charge) => sum + Number(charge.price), 0);
    return Number(rent) + totalElectricity + totalExtraCharges;
  };

  const validationSchema = yup.object({
    tenantId: yup.string().required(t('Tenant is required')),
    propertyId: yup.string().required(t('Property is required')),
    billingMonth: yup.date().required(t('Billing Month is required')),
    rentAmount: yup.number().required(t('Rent Amount is required')).min(0, t('Rent Amount cannot be negative')),
    extraCharges: yup.array().of(
      yup.object({
        serviceName: yup.string(),
        price: yup.number().min(0, t('Price cannot be negative')),
      })
    ),
    electricityUnit: yup.number().required(t('Electricity Bill Unit is required')).min(0, t('Electricity Bill Unit cannot be negative')),
    electricityRate: yup.number().required(t('Rate of Electricity Bill Unit is required')).positive(t('Electricity Rate must be positive')),
    note: yup.string(),
  });

  const initialValues = {
    tenantId: tenant?._id || '',
    propertyId: property?._id || '',
    billingMonth: data?.billingMonth ? new Date(data.billingMonth).toISOString().split('T')[0] : '',
    rentAmount: data?.rentAmount || 0,
    extraCharges: Array.isArray(data?.extraCharges) ? data.extraCharges : [],
    electricityUnit: data?.electricityUnit || 0,
    electricityRate: data?.electricityRate || 0,
    electricityBillAmount: 0,
    totalBillAmount: 0,
    note: data?.note || '',
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">{t('generateMonthlyBill')}</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const updatedValues = {
              ...values,
              companyId: payload.companyId,
              createdBy: payload._id,
              billingMonth: new Date(values.billingMonth).toISOString().split('T')[0],
              rentAmount: Number(values.rentAmount),
              extraAmount: values.extraCharges.reduce((sum, charge) => sum + Number(charge.price), 0),
              electricityBillAmount: calculateElectricityBill(values.electricityUnit, values.electricityRate),
              totalBillAmount: calculateTotalBill(
                values.electricityRate,
                values.electricityUnit,
                values.rentAmount,
                values.extraCharges
              ),
            };

            try {
              const response = await postApi(urls.bill.createBill, updatedValues);
              if (response.success) {
                toast.success(t('billGeneratedSuccessfully'));
                resetForm();
                handleClose();
              } else {
                toast.error(t('failedToGenerateBill'));
              }
            } catch (error) {
              toast.error(t('failedToGenerateBill'));
            }
          }}
        >
          {({ values, errors, touched }) => {
            const electricityBillAmount = calculateElectricityBill(
              values.electricityUnit,
              values.electricityRate
            );
            
            const totalAmount = calculateTotalBill(
              values.electricityRate,
              values.electricityUnit,
              values.rentAmount,
              values.extraCharges
            );

            return (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormLabel>{t('Tenant Name')}</FormLabel>
                    <Field
                      as={TextField}
                      name="tenantId"
                      size="small"
                      fullWidth
                      error={touched.tenantId && errors.tenantId}
                      helperText={touched.tenantId && errors.tenantId}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormLabel>{t('Property Name')}</FormLabel>
                    <Field
                      as={TextField}
                      name="propertyId"
                      size="small"
                      fullWidth
                      error={touched.propertyId && errors.propertyId}
                      helperText={touched.propertyId && errors.propertyId}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6">{t('Extra Charges')}</Typography>
                    <FieldArray name="extraCharges">
                      {({ push, remove }) => (
                        <div>
                          {values.extraCharges.map((_, index) => (
                            <Grid container spacing={2} key={index} alignItems="center">
                              <Grid item xs={5}>
                                <Field
                                  as={TextField}
                                  name={`extraCharges.${index}.serviceName`}
                                  label={t('Service Name')}
                                  size="small"
                                  fullWidth
                                  error={
                                    touched.extraCharges?.[index]?.serviceName &&
                                    errors.extraCharges?.[index]?.serviceName
                                  }
                                  helperText={
                                    touched.extraCharges?.[index]?.serviceName &&
                                    errors.extraCharges?.[index]?.serviceName
                                  }
                                  required
                                />
                              </Grid>
                              <Grid item xs={5}>
                                <Field
                                  as={TextField}
                                  name={`extraCharges.${index}.price`}
                                  label={t('Price')}
                                  type="number"
                                  size="small"
                                  fullWidth
                                  error={
                                    touched.extraCharges?.[index]?.price &&
                                    errors.extraCharges?.[index]?.price
                                  }
                                  helperText={
                                    touched.extraCharges?.[index]?.price &&
                                    errors.extraCharges?.[index]?.price
                                  }
                                  required
                                />
                              </Grid>
                              <Grid item xs={2}>
                                <IconButton onClick={() => remove(index)}>
                                  <ClearIcon />
                                </IconButton>
                              </Grid>
                            </Grid>
                          ))}
                          <Button
                            type="button"
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => push({ serviceName: '', price: 0 })}
                            style={{ marginTop: '16px' }}
                          >
                            {t('Add Extra Charge')}
                          </Button>
                        </div>
                      )}
                    </FieldArray>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormLabel>{t('Rent Amount')}</FormLabel>
                    <Field
                      as={TextField}
                      name="rentAmount"
                      type="number"
                      size="small"
                      fullWidth
                      error={touched.rentAmount && errors.rentAmount}
                      helperText={touched.rentAmount && errors.rentAmount}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormLabel>{t('Electricity Bill Unit')}</FormLabel>
                    <Field
                      as={TextField}
                      name="electricityUnit"
                      type="number"
                      size="small"
                      fullWidth
                      error={touched.electricityUnit && errors.electricityUnit}
                      helperText={touched.electricityUnit && errors.electricityUnit}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormLabel>{t('Rate of Electricity Bill Unit')}</FormLabel>
                    <Field
                      as={TextField}
                      name="electricityRate"
                      type="number"
                      size="small"
                      fullWidth
                      error={touched.electricityRate && errors.electricityRate}
                      helperText={touched.electricityRate && errors.electricityRate}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormLabel>{t('Total Electricity Bill')}</FormLabel>
                    <TextField
                      value={electricityBillAmount}
                      type="number"
                      size="small"
                      fullWidth
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormLabel>{t('Billing Month')}</FormLabel>
                    <Field
                      as={TextField}
                      name="billingMonth"
                      type="month"
                      size="small"
                      fullWidth
                      error={touched.billingMonth && errors.billingMonth}
                      helperText={touched.billingMonth && errors.billingMonth}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormLabel>{t('Note')}</FormLabel>
                    <Field
                      as={TextField}
                      name="note"
                      size="small"
                      fullWidth
                      error={touched.note && errors.note}
                      helperText={touched.note && errors.note}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormLabel>{t('Total Amount')}</FormLabel>
                    <TextField
                      value={totalAmount}
                      type="number"
                      size="small"
                      fullWidth
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
                    onClick={handleClose}
                  >
                    {t('Cancel')}
                  </Button>
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateMonthlyBill;