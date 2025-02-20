import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, Container, Card, Stack, Breadcrumbs } from '@mui/material';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IconHome } from '@tabler/icons';
import { urls } from 'core/Constant/urls';
import { getApi } from 'core/apis/api';
import { padding } from '@mui/system';

const AnnouncementViewPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const announcementId = queryParams.get('id');

  const [announcement, setAnnouncement] = useState([]);
  const fetchAnnouncement = async () => {
    try {
      const response = await getApi(urls.Announcement.getAnnouncementById, { id: announcementId });
      console.log(response)
      setAnnouncement(response?.data[0] || {});
    } catch (error) {
      console.error('Error fetching announcement data:', error);
    }
  };
  useEffect(() => {
    fetchAnnouncement();
  }, [announcementId]);

  return (
    <Container>
   <Card sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h4">{t('announcement_details')}</Typography>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link to="/dashboard/default" style={{ color: 'inherit' }}>
              <IconHome />
            </Link>
            <Link to="/dashboard/announcements" style={{ color: 'inherit' }}>
              {t('Announcements')}
            </Link>
            <Typography color="text.primary">{t('View')}</Typography>
          </Breadcrumbs>
        </Stack>
      </Card>

      <Box sx={{ width: '100%'}}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
          <Paper
  sx={{
    padding: 3,
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center', // Center align content
  }}
>
  <Typography variant="h4" gutterBottom sx={{ pb: 2 }}>
    {announcement?.topic || t('not_available')}
  </Typography>
  <Typography variant="body1">
    {announcement?.details || t('not_available')}
  </Typography>
</Paper>

          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AnnouncementViewPage;