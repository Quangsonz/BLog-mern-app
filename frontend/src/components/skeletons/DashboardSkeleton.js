import React from 'react';
import { Box, Paper, Skeleton, Grid } from '@mui/material';

const DashboardSkeleton = () => {
  return (
    <Box>
      {/* Header Skeleton */}
      <Box sx={{ 
        mb: 4,
        borderRadius: 3,
        p: 4,
        bgcolor: '#f5f5f5',
      }}>
        <Skeleton variant="text" width="30%" height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="50%" height={24} />
      </Box>

      {/* Statistics Cards Skeleton */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4, 5].map((item) => (
          <Grid item xs={12} sm={6} md={2.4} key={item}>
            <Paper sx={{ borderRadius: 3, p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="40%" height={40} sx={{ mt: 1 }} />
                </Box>
                <Skeleton variant="circular" width={50} height={50} />
              </Box>
              <Skeleton variant="text" width="50%" height={20} />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts Skeleton */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: 3, p: 3 }}>
            <Skeleton variant="text" width="30%" height={32} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ borderRadius: 3, p: 3 }}>
            <Skeleton variant="text" width="40%" height={32} sx={{ mb: 3 }} />
            {[1, 2, 3, 4, 5].map((item) => (
              <Box key={item} sx={{ mb: 2 }}>
                <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={20} />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Top Posts Skeleton */}
      <Paper sx={{ borderRadius: 3, p: 3 }}>
        <Skeleton variant="text" width="25%" height={32} sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5].map((item) => (
            <Grid item xs={12} sm={6} md={2.4} key={item}>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#fafafa' }}>
                <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={20} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default DashboardSkeleton;
