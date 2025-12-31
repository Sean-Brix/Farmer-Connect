import React, { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

// Freeform farmer selector; uses freeSolo so users can type even without options.
export default function FarmerSelector({ value, onChange, error, helperText, disabled }) {
  const [inputValue, setInputValue] = useState(value || '');

  return (
    <Autocomplete
      freeSolo
      options={[]}
      value={inputValue}
      onInputChange={(event, newValue) => {
        setInputValue(newValue || '');
        onChange?.({ name: newValue || '' });
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Farmer Name *"
          error={!!error}
          helperText={helperText || 'Type farmer name; search data will appear when available'}
          disabled={disabled}
        />
      )}
    />
  );
}
