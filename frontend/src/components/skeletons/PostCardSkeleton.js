import React from 'react';
import { Card, CardContent, Box, Skeleton } from '@mui/material';

const PostCardSkeleton = () => {
  return (
    <Card 
      sx={{ 
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image skeleton */}
      <Skeleton 
        variant="rectangular" 
        height={200} 
        sx={{ borderRadius: '12px 12px 0 0' }}
      />
      
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Category skeleton */}
        <Skeleton variant="text" width="30%" height={24} sx={{ mb: 1 }} />
        
        {/* Content skeleton */}
        <Skeleton variant="text" width="100%" height={28} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="90%" height={28} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="text" width="85%" height={20} />
        
        {/* Author and stats skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
          <Skeleton variant="circular" width={32} height={32} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
          <Skeleton variant="text" width="15%" height={20} />
          <Skeleton variant="text" width="15%" height={20} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostCardSkeleton;
