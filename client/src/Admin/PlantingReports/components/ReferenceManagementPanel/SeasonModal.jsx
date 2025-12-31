import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Box,
  Alert,
} from '@mui/material';
import { useCreateSeason, useUpdateSeason } from '../../hooks/useReferenceData';

export function SeasonModal({ open, onClose, season = null }) {
  const isEdit = Boolean(season);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    isActive: true,
  });
  const [errors, setErrors] = useState({});

  const createSeason = useCreateSeason();
  const updateSeason = useUpdateSeason();

  useEffect(() => {
    if (season) {
      setFormData({
        name: season.name || '',
        startDate: season.startDate ? new Date(season.startDate).toISOString().split('T')[0] : '',
        endDate: season.endDate ? new Date(season.endDate).toISOString().split('T')[0] : '',
        description: season.description || '',
        isActive: season.isActive ?? true,
      });
    } else {
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        description: '',
        isActive: true,
      });
    }
    setErrors({});
  }, [season, open]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Season name is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (event) => {
    const value = field === 'isActive' ? event.target.checked : event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (isEdit) {
        await updateSeason.mutateAsync({
          id: season.id,
          data: formData,
        });
      } else {
        await createSeason.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save season:', error);
    }
  };

  const isLoading = createSeason.isPending || updateSeason.isPending;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Season' : 'Create New Season'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {(createSeason.isError || updateSeason.isError) && (
            <Alert severity="error">
              Failed to {isEdit ? 'update' : 'create'} season. Please try again.
            </Alert>
          )}
          
          <TextField
            label="Season Name"
            value={formData.name}
            onChange={handleChange('name')}
            error={Boolean(errors.name)}
            helperText={errors.name}
            fullWidth
            required
            disabled={isLoading}
          />

          <TextField
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={handleChange('startDate')}
            error={Boolean(errors.startDate)}
            helperText={errors.startDate}
            fullWidth
            required
            disabled={isLoading}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={handleChange('endDate')}
            error={Boolean(errors.endDate)}
            helperText={errors.endDate}
            fullWidth
            required
            disabled={isLoading}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Description"
            value={formData.description}
            onChange={handleChange('description')}
            multiline
            rows={3}
            fullWidth
            disabled={isLoading}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleChange('isActive')}
                disabled={isLoading}
              />
            }
            label="Active"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="success"
          disabled={isLoading}
        >
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
