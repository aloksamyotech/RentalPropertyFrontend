/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getApi } from 'core/apis/api';
import { urls } from 'core/Constant/urls';
import { useTranslation } from 'react-i18next';
import { tokenPayload } from 'helper';

const InvoiceDetails = ({ value }) => <Typography variant="subtitle1">{value}</Typography>;

const InvoiceTable = ({ items }) => (
  <TableContainer component={Paper} sx={{ marginY: 2 }}>
    <Table sx={{ minWidth: 650 }}>
      <TableHead>
        <TableRow>
          <TableCell><b>Description</b></TableCell>
          {/* <TableCell><b>Price</b></TableCell>
          <TableCell><b>Quantity</b></TableCell> */}
          <TableCell><b>Amount</b></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items?.map((item) => (
          <TableRow key={item._id}>
            <TableCell><b>{item.serviceName}</b></TableCell>
            {/* <TableCell>{item.price}</TableCell>
            <TableCell>{item.quantity}</TableCell> */}
            <TableCell>Rs {item.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const MonthlyInvoiceView = () => {
  const { t } = useTranslation();
  const [invoiceData, setInvoiceData] = useState({});
  const [isPrinted, setIsPrinted] = useState(false);
  const [property,setProperty] = useState([]);
  const [tenant,setTenant] = useState([]);
  const [company, setCompany] = useState([]);
  const payload = tokenPayload();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get('id');

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await getApi(urls.bill.getBillById, { id: bookingId });
        setProperty(response?.data?.propertyId);
        setTenant(response?.data?.tenantId);
        setCompany(response?.data?.companyId);
        setInvoiceData(response?.data);
      } catch (error) {
        console.error('Error fetching invoice:', error);
      }
    };
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
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{
            marginLeft: 2,
            color: '#673ab7',
            borderColor: '#673ab7',
            position: 'absolute',
            right: 10,
          }}
          onClick={() => navigate(-1)}
          className={`back-button ${isPrinted ? 'hidden' : ''}`}
        >
          {t('Back')}
        </Button>
      </Grid>

      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={2} sx={{ padding: '20px', maxWidth: '800px', marginTop: '12px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h3" align="center" gutterBottom>
                {t('Rent Invoice')}
              </Typography>
              <Typography variant="subtitle1" align="center" gutterBottom>
                {t('Date')}: {currentDate}
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

              <br />
              <Typography variant="h4" gutterBottom>
                {t('Tenant Details')}
              </Typography>
              <InvoiceDetails value={tenant?.tenantName} />
              <InvoiceDetails value={tenant?.email} />
              <InvoiceDetails value={tenant?.phoneno} />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h4">{t('Invoice Number')}</Typography>
              <Typography variant="subtitle1">{invoiceData?.invoiceNo}</Typography>
              <br />

              <Typography variant="h4">{t('GST Number')}</Typography>
              <Typography variant="subtitle1">{company?.gstnumber}</Typography>
              <br />
              <Typography variant="h4">{t('Company Details')}</Typography>
              <Typography variant="subtitle1">{company?.companyName}</Typography>
              <Typography variant="subtitle1">{company?.email}</Typography>
              <Typography variant="subtitle1">{company?.phoneNo}</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h4">{t('Payment Method')}</Typography>
              <Typography variant="subtitle1">{invoiceData?.paymentMethod}</Typography>
            </Grid>

            <Grid item xs={12}>
              <InvoiceTable items={invoiceData?.extraCharges || []} />
            </Grid>

            <Grid item xs={12} sx={{ marginTop: '20px' }}>
              <Divider />
              <Typography sx={{ textAlign: 'left', marginTop: '20px' }}>
                <b>{t('Discount')}:</b> Rs {invoiceData?.discount || 0}
              </Typography>
              {invoiceData?.haveGST && (
                <Typography sx={{ textAlign: 'left', marginTop: '10px' }}>
                  <b>{t('GST Amount')}:</b> Rs {invoiceData?.gstAmount}
                </Typography>
              )}
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
        <Button variant="contained" onClick={handlePrint}>
          {t('Print')}
        </Button>
      </Grid>
    </Grid>
  );
};

export default MonthlyInvoiceView;
