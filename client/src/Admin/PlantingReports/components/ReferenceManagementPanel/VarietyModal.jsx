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
  MenuItem,
} from '@mui/material';
import { CROP_TYPES } from '../../constants/plantingReportConstants';
import { useCreateVariety, useUpdateVariety } from '../../hooks/useReferenceData';

export function VarietyModal({ open, onClose, variety = null }) {
  const isEdit = Boolean(variety);
  const [formData, setFormData] = useState({
    name: '',
    cropType: '',
    directSeededDAS: 90,
    transplantedDAS: 100,
    description: '',
    isActive: true,
  });
  const [errors, setErrors] = useState({});

  const createVariety = useCreateVariety();
  const updateVariety = useUpdateVariety();

  useEffect(() => {
    if (variety) {
      setFormData({
        name: variety.name || '',
        cropType: variety.cropType || '',
        directSeededDAS: variety.directSeededDAS || 90,
        transplantedDAS: variety.transplantedDAS || 100,
        description: variety.description || '',
        isActive: variety.isActive ?? true,
      });
    } else {
      setFormData({
        name: '',
        cropType: '',
        directSeededDAS: 90,
        transplantedDAS: 100,
        description: '',
        isActive: true,
      });
    }
    setErrors({});
  }, [variety, open]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Variety name is required';
    }
    if (!formData.cropType) {
      newErrors.cropType = 'Crop type is required';
    }
    if (!formData.directSeededDAS || formData.directSeededDAS < 1) {
      newErrors.directSeededDAS = 'Direct seeded DAS must be at least 1';
    }
    if (!formData.transplantedDAS || formData.transplantedDAS < 1) {
      newErrors.transplantedDAS = 'Transplanted DAS must be at least 1';
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
        await updateVariety.mutateAsync({
          id: variety.id,
          data: formData,
        });
      } else {
        await createVariety.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save variety:', error);
    }
  };

  const isLoading = createVariety.isPending || updateVariety.isPending;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Variety' : 'Create New Variety'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {(createVariety.isError || updateVariety.isError) && (
            <Alert severity="error">
              Failed to {isEdit ? 'update' : 'create'} variety. Please try again.
            </Alert>
          )}
          
          <TextField
            label="Variety Name"
            value={formData.name}
            onChange={handleChange('name')}
            error={Boolean(errors.name)}
            helperText={errors.name}
            fullWidth
            required
            disabled={isLoading}
          />

          <TextField
            select
            label="Crop Type"
            value={formData.cropType || ''}
            onChange={handleChange('cropType')}
            error={Boolean(errors.cropType)}
            helperText={errors.cropType}
            fullWidth
            required
            disabled={isLoading}
          >
            {CROP_TYPES.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Direct Seeded DAS (Days After Sowing)"
            type="number"
            value={formData.directSeededDAS}
            onChange={handleChange('directSeededDAS')}
            error={Boolean(errors.directSeededDAS)}
            helperText={errors.directSeededDAS}
            fullWidth
            required
            disabled={isLoading}
            inputProps={{ min: 1 }}
          />

          <TextField
            label="Transplanted DAS (Days After Sowing)"
            type="number"
            value={formData.transplantedDAS}
            onChange={handleChange('transplantedDAS')}
            error={Boolean(errors.transplantedDAS)}
            helperText={errors.transplantedDAS}
            fullWidth
            required
            disabled={isLoading}
            inputProps={{ min: 1 }}
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
