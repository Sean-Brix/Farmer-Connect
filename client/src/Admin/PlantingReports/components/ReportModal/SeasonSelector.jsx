import React from 'react';
import { TextField, MenuItem, CircularProgress } from '@mui/material';
import { useActiveSeasons } from '../../hooks/useReferenceData';

export default function SeasonSelector({ value, onChange, error, helperText, readOnly }) {
  const { data, isLoading } = useActiveSeasons();
  
  // Ensure seasons is always an array
  const seasons = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
  const selectedSeason = Array.isArray(seasons) ? seasons.find((s) => s.id === value) : null;

  if (readOnly) {
    return (
      <TextField
        fullWidth
        label="Cropping Season"
        value={selectedSeason?.name || selectedSeason?.seasonName || 'N/A'}
        InputProps={{ readOnly: true }}
      />
    );
  }

  return (
    <TextField
      select
      fullWidth
      required
      label="Cropping Season"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={helperText || 'Select the cropping season'}
      disabled={isLoading}
      InputProps={{
        endAdornment: isLoading ? <CircularProgress size={20} /> : null
      }}
    >
      {seasons.map((season) => (
        <MenuItem key={season.id} value={String(season.id)}>
          {season.name || season.seasonName || 'Season'}
        </MenuItem>
      ))}
      {!isLoading && seasons.length === 0 && <MenuItem disabled>No seasons available</MenuItem>}
    </TextField>
  );
}
