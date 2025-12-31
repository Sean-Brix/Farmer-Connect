import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/InfoOutlined';

export default function FieldTooltip({ title }) {
  if (!title) return null;

  return (
    <Tooltip title={title} placement="top" arrow>
      <IconButton size="small" sx={{ ml: 0.5, p: 0 }}>
        <InfoIcon fontSize="small" color="action" />
      </IconButton>
    </Tooltip>
  );
}
