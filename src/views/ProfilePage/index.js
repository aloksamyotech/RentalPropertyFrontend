/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState, useEffect } from 'react';
import React from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Card,
  Box,
  Breadcrumbs,
  ListItemSecondaryAction,
  FormControlLabel,
  Paper,
  Grid,
  Dialog,
  FormGroup,
  Switch,
  DialogContent,
  TextField,
  IconButton,
  Divider, 
} from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Close } from '@mui/icons-material';
import { getApi } from 'core/apis/api';
import Tab from '@mui/material/Tab';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { urls } from 'core/Constant/urls';
import { useLocation, Link } from 'react-router-dom';
import { IconHome } from '@tabler/icons';
import { tokenPayload } from 'helper';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { patchApi } from 'core/apis/api';


const ProfilePage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const payload = tokenPayload();
  const userRole = payload.role;
  const queryParams = new URLSearchParams(location.search);
  const propertyId = queryParams.get('id');

  const [value, setValue] = useState('1');
  const [CompanyData, setCompanyData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [ownerData, setOwnerData] = useState({});
  const [typeData, setTypeData] = useState({});
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
      fetchPropertyData();
  }, [propertyId, openAdd, openDelete]);

  const fetchPropertyData = async () => {
    const response = await getApi(urls.company.getCompanyById , { id: payload.companyId });
    setCompanyData(response.data);
  };

  const validationSchema = yup.object({
    smtpCode: yup
      .string()
      .required(t('SMTP Code is required'))
      .min(10, t('SMTP Code must be at least 4 characters'))
      .max(20, t('SMTP Code cannot exceed 20 characters')),
    smtpMail: yup
      .string()
      .required(t('Email is required'))
      .email(t('Invalid email address'))
  });

  const formik = useFormik({
    initialValues: {
      smtpCode: CompanyData?.smtpCode,
      smtpMail: CompanyData?.smtpMail
    },
    enableReinitialize:true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await patchApi(urls?.company?.addSmtpMailPassword, {
          id: payload?.companyId,
          smtpMail: values.smtpMail,
          smtpCode: values.smtpCode 
        });       
        if (response.success) {
          toast.success(t('SMTP settings updated successfully!'));
          fetchPropertyData(); // Refresh company data
        }
      } catch (err) {
        toast.error(t('Something went wrong!'));
      }
    },
  });

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCloseDialog = () => {
    setSelectedImage(null);
  };



  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const breadcrumbs = [
    <Link key="home" to="/dashboard/default" style={{ color: 'inherit', textDecoration: 'none' }}>
      <IconHome />
    </Link>,
     <Typography key="company Profile" color="text.primary">
          {t('Company Profile')}
        </Typography>
  ];

  return (
    <>
      <Container>
        {/* Breadcrumb and Heading */}
        <Card sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {t('Company Profile')}
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                {breadcrumbs}
              </Breadcrumbs>
            </Typography>
          </Stack>
        </Card>

        <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleTabChange} aria-label="Property tabs">
                <Tab label={t('Company Details')} value="1" />
                {userRole === 'companyAdmin' && (
  <Tab label={t('updateMailSettings')} value="2" />
)}

              </TabList>
            </Box>

            {/* Property Details Tab */}
            <TabPanel value="1">
              <Grid container spacing={3}>
                {/* Property Information Section */}
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      padding: 3,
                      border: '1px solid #333',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <Typography variant="h4" gutterBottom>
                      {t('Company Information')}
                    </Typography>
                    <Divider sx={{ marginBottom: 2 }} />
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Company Name')}</Typography>
                        <Typography>{CompanyData.companyName || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Email Id')}</Typography>
                        <Typography>{CompanyData.email || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Phone No')}</Typography>
                        <Typography>{CompanyData.phoneNo || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Address')}</Typography>
                        <Typography>{CompanyData.address || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('GST number')}</Typography>
                        <Typography>{CompanyData.gstnumber || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Currency Code')}</Typography>
                        <Typography>{CompanyData.currencyCode || t('not_available')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{t('Onboarding Date')}</Typography>
                        <Typography>{new Date(CompanyData.createdAt).toLocaleDateString() || t('not_available')}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Mail Settings Tab */}
            <TabPanel value="2">
  <Box sx={{ flexGrow: 1, overflowX: "auto" }}>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box  
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ padding: 2, borderRadius: 2 }}
        >
          <Typography variant="h4" color="text.primary">
            {t('updateMailSettings')}
          </Typography>
          <hr />
          <Grid container spacing={2} sx={{ alignItems: "center", marginTop: "10px" }}>
            <Grid item xs={4} md={4}>
              <Typography variant="body1" color="text.primary">
                {t('Smtp Code')}
              </Typography>
            </Grid>
            <Grid item xs={8} md={8}>
              <TextField
                id="smtpCode"
                name="smtpCode"
                type="text"
                value={formik.values.smtpCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.smtpCode && Boolean(formik.errors.smtpCode)}
                helperText={formik.touched.smtpCode && formik.errors.smtpCode}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ alignItems: "center", marginTop: "10px" }}>
            <Grid item xs={4} md={4}>
              <Typography variant="body1" color="text.primary">
                {t('Email')}
              </Typography>
            </Grid>
            <Grid item xs={8} md={8}>
              <TextField
                id="smtpMail"
                name="smtpMail"
                type="email"
                value={formik.values.smtpMail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.smtpMail && Boolean(formik.errors.smtpMail)}
                helperText={formik.touched.smtpMail && formik.errors.smtpMail}
                fullWidth
              />
            </Grid>
          </Grid>
          <Box sx={{ marginTop: 3, textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              {t('update')}
            </Button>
          </Box>


          <hr />

          {/* Mail Status Toggle */}
          <Grid container spacing={2} sx={{ alignItems: "center", marginTop: "10px" }}>
            <Grid item xs={4} md={4}>
              <Typography variant="body1" color="text.primary">
                {t('Enable Mail Notifications')}
              </Typography>
            </Grid>
            <Grid item xs={8} md={8}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={CompanyData?.isMailStatus || false}
                      onChange={async (event) => {
                        try {
                          const response = await patchApi(urls.company.changeMailStatus, {
                            id: payload.companyId,
                            isMailStatus: event.target.checked
                          });
                          if (response.success) {
                            toast.success(t('Mail status updated successfully!'));
                            fetchPropertyData(); // Refresh data
                          }
                        } catch (error) {
                          toast.error(t('Failed to update mail status'));
                        }
                      }}
                      name="isMailStatus"
                    />
                  }
                  label={CompanyData?.isMailStatus ? t('Enabled') : t('Disabled')}
                />
              </FormGroup>
            </Grid>
          </Grid>
          
         
        </Box>
      </Grid>
    </Grid>
  </Box>
</TabPanel>
          </TabContext>
        </Card>
      </Container>
    </>
  );
};

export default ProfilePage;