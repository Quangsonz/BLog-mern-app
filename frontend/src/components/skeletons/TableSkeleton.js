import React from 'react';
import { Box, Skeleton } from '@mui/material';

const TableSkeleton = ({ rows = 5, columns = 5 }) => {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        p: 2, 
        bgcolor: '#f5f5f5', 
        borderRadius: '8px 8px 0 0',
        borderBottom: '2px solid #e0e0e0'
      }}>
        {Array(columns).fill(0).map((_, index) => (
          <Skeleton 
            key={index} 
            variant="text" 
            width={`${100 / columns}%`} 
            height={24} 
          />
        ))}
      </Box>
      
      {/* Rows */}
      {Array(rows).fill(0).map((_, rowIndex) => (
        <Box 
          key={rowIndex} 
          sx={{ 
            display: 'flex', 
            gap: 2, 
            p: 2, 
            borderBottom: '1px solid #f0f0f0',
            '&:hover': { bgcolor: '#fafafa' }
          }}
        >
          {Array(columns).fill(0).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              variant="text" 
              width={`${100 / columns}%`} 
              height={20} 
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default TableSkeleton;
