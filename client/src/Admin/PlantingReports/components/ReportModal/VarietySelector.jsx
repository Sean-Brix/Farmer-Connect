import React from 'react';
import { TextField, MenuItem, CircularProgress } from '@mui/material';
import { useActiveVarieties } from '../../hooks/useReferenceData';

export default function VarietySelector({ cropType, value, onChange, error, helperText, readOnly }) {
  const { data, isLoading } = useActiveVarieties();
  const varieties = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

  // Filter varieties by cropType - ensure exact match
  const filtered = cropType
    ? varieties.filter((variety) => variety.cropType === cropType)
    : varieties;

  const selectedVariety = varieties.find((v) => v.id === value);

  if (readOnly) {
    return (
      <TextField
        fullWidth
        label="Variety"
        value={selectedVariety?.name || 'N/A'}
        InputProps={{ readOnly: true }}
      />
    );
  }

  return (
    <TextField
      select
      fullWidth
      required
      label="Variety"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={helperText || (cropType ? `${filtered.length} varieties available` : 'Select crop type first')}
      disabled={isLoading || !cropType || !filtered.length}
      InputProps={{
        endAdornment: isLoading ? <CircularProgress size={20} /> : null
      }}
    >
      {filtered.map((variety) => (
        <MenuItem key={variety.id} value={String(variety.id)}>
          {variety.name}
        </MenuItem>
      ))}
      {!isLoading && cropType && filtered.length === 0 && <MenuItem disabled>No varieties available for {cropType}</MenuItem>}
      {!isLoading && !cropType && <MenuItem disabled>Select crop type first</MenuItem>}
    </TextField>
  );
}
