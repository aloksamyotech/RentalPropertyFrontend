/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  Select,
  Breadcrumbs,
  TableContainer,
  TableHead,
  MenuItem,
  TableRow,
  FormControl,
  InputLabel
} from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getApi, patchApi } from 'core/apis/api';
import { urls } from 'core/Constant/urls';
import { useTranslation } from 'react-i18next';
import { tokenPayload } from 'helper';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { IconHome } from '@tabler/icons';


const InvoiceDetails = ({ value }) => <Typography variant="subtitle1">{value}</Typography>;
const InvoiceTable = ({ items }) => (
  <TableContainer component={Paper} sx={{ marginY: 2, boxShadow: 3, borderRadius: 2 }}>
    <Table sx={{ minWidth: 650 }}>
      <TableHead>
        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
          <TableCell><b>Description</b></TableCell>
          <TableCell align="right"><b>Amount ({items?.companyId?.currencyCode})</b></TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        <TableRow>
          <TableCell>Rent Amount</TableCell>
          <TableCell align="right">{Number(items.rentAmount).toFixed(2)}</TableCell>
        </TableRow>

        {items?.extraCharges?.map((item) => (
          <TableRow key={item._id}>
            <TableCell>{item.serviceName}</TableCell>
            <TableCell align="right">{Number(item.price).toFixed(2)}</TableCell>
          </TableRow>
        ))}

        <TableRow>
          <TableCell colSpan={2} sx={{ borderBottom: '2px solid #000' }} />
        </TableRow>

        <TableRow>
          <TableCell><b>Total Amount</b></TableCell>
          <TableCell align="right"><b>{items?.companyId?.currencyCode}  {Number(items.totalBillAmount).toFixed(2)}</b></TableCell>
        </TableRow>

        <TableRow>
          <TableCell>GST Amount ({Number(items.gstpercent).toFixed(2)}%)</TableCell>
          <TableCell align="right">{Number(items.totalgst).toFixed(2)}</TableCell>
        </TableRow>

        <TableRow sx={{ backgroundColor: '#e0f7fa' }}>
          <TableCell><b>Total Amount After GST</b></TableCell>
          <TableCell align="right"><b>{items?.companyId?.currencyCode}  {Number(items.totalBillAmountAfterGST).toFixed(2)}</b></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);

const MonthlyInvoiceView = () => {
  const { t } = useTranslation();
  const [invoiceData, setInvoiceData] = useState({});
  const [isPrinted, setIsPrinted] = useState(false);
  const [property, setProperty] = useState({});
  const [tenant, setTenant] = useState({});
  const [company, setCompany] = useState({});
  const [reporter, setReporter] = useState({});
  const [paymentType, setPaymentType] = useState("cash"); 
  const [loading, setLoading] = useState(false);

  const payload = tokenPayload();
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = payload?.role;

  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get('id');
  console.log(invoiceData,"invoiceData");


  const handlePaymentSubmit = async () => {
   
    try {
      setLoading(true);
      const response = await patchApi(
        urls.bill.changeBillStatus,
        { paymentType },
        { id: bookingId }
      );
  
      if (response?.success) {
        toast.success(t("Bill status updated successfully!"));
        handleClose(); 
        resetForm();   
      // } else {
      //   toast.error(t("Failed to update bill status."));
      }
    } catch (error) {
      console.error("Error updating bill:", error);
      toast.error(t("An error occurred. Please try again."));
    } finally {
      setLoading(false);
    }
  };
  
  const handlePaymentChange = (event) => {
    setPaymentType(event.target.value);
  };
  const fetchInvoiceData = async () => {
    try {
      const response = await getApi(urls.bill.getBillById, { id: bookingId });
      setProperty(response?.data?.propertyId || {});
      setTenant(response?.data?.tenantId || {});
      setCompany(response?.data?.companyId || {});
      setInvoiceData(response?.data || {});
      if (response?.data?.tenantId?.reporterId) {
        fetchReporterData(response.data.tenantId.reporterId);
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
    }
  };
     const breadcrumbs = [
          <Link underline="hover" key="home" to="/dashboard/default" style={{ color: 'inherit' }}>
            <IconHome />
          </Link>,
          <Link underline="hover" key="bill-management" to="/dashboard/billC" style={{ color: 'inherit' }}>
            {t('Bill Management')}
          </Link>,
          <Typography key="view" color="text.primary">
            {t('View')}
          </Typography>,
        ];

  useEffect(() => {
    fetchInvoiceData();
  }, [bookingId]);

  const handlePrint = () => {
    setIsPrinted(true);
    window.print();
  };

  const currentDate = new Date().toLocaleDateString();

  return (
    <Grid container justifyContent="center" sx={{ padding: '20px' }}>
     <Grid item xs={12}>
        <Card sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {t('Bill Management')}
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              {breadcrumbs}
            </Breadcrumbs>
          </Typography>
          {/* <Button variant="outlined" sx={{ display: 'flex', alignItems: 'right', gap: 2 }}>
            {t('Create Booking')}
          </Button> */}
        </Stack>
      </Card>
     
        </Grid>

      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={2} sx={{ padding: '20px', maxWidth: '800px', marginTop: '12px' }}>
          <Grid container spacing={2}>
          <Grid item xs={12}>
  <Typography variant="h3" align="center" gutterBottom>
    {company.companyName}
  </Typography>
  <Grid container justifyContent="space-between" alignItems="center">
    <Grid item>
      <Typography variant="h6" gutterBottom>
        {t('GST Number')}: {company.gstnumber}
      </Typography>
    </Grid>
    <Grid item>
      <Typography variant="subtitle1" gutterBottom>
        {t('Date')}: {currentDate}
      </Typography>
    </Grid>
  </Grid>
  <Typography variant="h3" align="center" gutterBottom>
    {t('Rent Invoice')}
  </Typography>
  <Divider />
</Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h4" gutterBottom>
                {t('Property Details')}
              </Typography>
              <InvoiceDetails value={property?.propertyname} />
              <InvoiceDetails value={property?.address} />
              <InvoiceDetails value={property?.zipcode} />
            </Grid>

            {/* <Grid item xs={12} md={4}>
              <Typography variant="h4">{t('Company Details')}</Typography>
              <InvoiceDetails value={company?.companyName} />
              <InvoiceDetails value={company?.email} />
              <InvoiceDetails value={company?.phoneNo} />
            </Grid> */}

            <Grid item xs={12} md={4}>
              <Typography variant="h4" gutterBottom>
                {t('Tenant Details')}
              </Typography>
              <InvoiceDetails value={tenant?.tenantName} />
              <InvoiceDetails value={tenant?.email} />
              <InvoiceDetails value={tenant?.phoneno} />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h4" gutterBottom>
                {t('Reporter Details')}
              </Typography>
              {/* <InvoiceDetails value={reporter?.agentName} /> */}
              <InvoiceDetails value={invoiceData?.companyId?.email} />
              <InvoiceDetails value={invoiceData?.companyId?.phoneNo} />
            </Grid>

            <Grid item xs={12}>
              <InvoiceTable items={invoiceData} />
            </Grid>

            <Grid item xs={12} sx={{ marginTop: '20px' }}>
              <Divider />
              {invoiceData?.totalAmount && (
                <Typography sx={{ textAlign: 'left', marginTop: '10px' }}>
                  <b>
                    {t('Total Amount')} {invoiceData?.haveGST ? `(${t('with GST')})` : ''}:
                  </b>{' '}
                  Rs {invoiceData?.totalAmount}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sx={{ textAlign: 'end', marginTop: '20px' }}>
              <Typography sx={{ fontSize: '15px' }} variant="subtitle1">
                {t('Signature')}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <style>
        {`
          @media print {
            .print-button,
            .back-button.hidden {
              display: none;
            }
          }
        `}
      </style>

      <Grid
        item
        xs={12}
        sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
        className="print-button"
      >
    

    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
  {userRole === "companyAdmin" && (
    <>
      <FormControl variant="outlined" size="small">
        <InputLabel>{t("Payment Type")}</InputLabel>
        <Select value={paymentType} onChange={handlePaymentChange} label={t("Payment Type")}>
          <MenuItem value="cash">{t("Cash")}</MenuItem>
          <MenuItem value="credit_card">{t("Credit Card")}</MenuItem>
          <MenuItem value="upi">{t("UPI")}</MenuItem>
          <MenuItem value="bank_transfer">{t("Bank Transfer")}</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" onClick={handlePaymentSubmit} disabled={loading || invoiceData?.status}>
        {loading ? t("Processing...") : t("Paid")}
      </Button>
    </>
  )}

  <Button variant="contained" onClick={handlePrint}>
    {t("Print")}
  </Button>
</div>



      </Grid>
    </Grid>
  );
};

export default MonthlyInvoiceView;