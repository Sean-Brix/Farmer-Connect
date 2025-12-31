import { useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  Chip,
  CircularProgress,
  Alert,
  Typography,
  Card,
  CardContent,
  CardActions,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useVarieties, useUpdateVariety, useDeleteVariety } from '../../hooks/useReferenceData';
import { VarietyModal } from './VarietyModal';
import { ViewReportsModal } from './ViewReportsModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useResponsive } from '../../hooks/useResponsive';

export function VarietiesTab() {
  const { isMobile } = useResponsive();
  const { data: varieties = [], isLoading, isError } = useVarieties();
  const updateVariety = useUpdateVariety();
  const deleteVariety = useDeleteVariety();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVariety, setSelectedVariety] = useState(null);
  const [viewReportsOpen, setViewReportsOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [varietyToDelete, setVarietyToDelete] = useState(null);

  const handleCreate = () => {
    setSelectedVariety(null);
    setModalOpen(true);
  };

  const handleEdit = (variety) => {
    setSelectedVariety(variety);
    setModalOpen(true);
  };

  const handleViewReports = (variety) => {
    setSelectedVariety(variety);
    setViewReportsOpen(true);
  };

  const handleDeleteClick = (variety) => {
    setVarietyToDelete(variety);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (varietyToDelete) {
      try {
        await deleteVariety.mutateAsync(varietyToDelete.id);
        setDeleteConfirmOpen(false);
        setVarietyToDelete(null);
      } catch (error) {
        console.error('Failed to delete variety:', error);
      }
    }
  };

  const handleToggleActive = async (variety) => {
    try {
      await updateVariety.mutateAsync({
        id: variety.id,
        data: { isActive: !variety.isActive },
      });
    } catch (error) {
      console.error('Failed to toggle variety status:', error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        Failed to load varieties. Please try again.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Crop Varieties</Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          size={isMobile ? 'small' : 'medium'}
        >
          Add Variety
        </Button>
      </Box>

      {varieties.length === 0 ? (
        <Alert severity="info">
          No varieties found. Click "Add Variety" to create one.
        </Alert>
      ) : isMobile ? (
        <Stack spacing={2}>
          {varieties.map((variety) => (
            <Card key={variety.id} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {variety.name}
                  </Typography>
                  <Chip
                    label={variety.isActive ? 'Active' : 'Inactive'}
                    color={variety.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {variety.cropType || 'N/A'}
                </Typography>
                {variety.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {variety.description}
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', gap: 1, px: 2, pb: 2 }}>
                <IconButton size="small" onClick={() => handleViewReports(variety)} color="info">
                  <ViewIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleEdit(variety)} color="primary">
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeleteClick(variety)} color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <Switch
                  checked={variety.isActive}
                  onChange={() => handleToggleActive(variety)}
                  size="small"
                />
              </CardActions>
            </Card>
          ))}
        </Stack>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Crop Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Active</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {varieties.map((variety) => (
                <TableRow key={variety.id}>
                  <TableCell>{variety.name}</TableCell>
                  <TableCell>{variety.cropType || 'N/A'}</TableCell>
                  <TableCell>
                    {variety.description ? (
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {variety.description}
                      </Typography>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={variety.isActive ? 'Active' : 'Inactive'}
                      color={variety.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={variety.isActive}
                      onChange={() => handleToggleActive(variety)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <IconButton size="small" onClick={() => handleViewReports(variety)} color="info">
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleEdit(variety)} color="primary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteClick(variety)} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <VarietyModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedVariety(null);
        }}
        variety={selectedVariety}
      />

      <ViewReportsModal
        open={viewReportsOpen}
        onClose={() => {
          setViewReportsOpen(false);
          setSelectedVariety(null);
        }}
        reference={selectedVariety}
        type="variety"
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setVarietyToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Variety"
        message={`Are you sure you want to delete "${varietyToDelete?.name}"? This action cannot be undone.`}
        loading={deleteVariety.isPending}
      />
    </Box>
  );
}
