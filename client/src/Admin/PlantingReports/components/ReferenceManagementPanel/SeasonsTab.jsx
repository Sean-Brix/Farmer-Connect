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
import { useSeasons, useUpdateSeason, useDeleteSeason } from '../../hooks/useReferenceData';
import { SeasonModal } from './SeasonModal';
import { ViewReportsModal } from './ViewReportsModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useResponsive } from '../../hooks/useResponsive';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function SeasonsTab() {
  const { isMobile } = useResponsive();
  const { data: seasons = [], isLoading, isError } = useSeasons();
  const updateSeason = useUpdateSeason();
  const deleteSeason = useDeleteSeason();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [viewReportsOpen, setViewReportsOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [seasonToDelete, setSeasonToDelete] = useState(null);

  const handleCreate = () => {
    setSelectedSeason(null);
    setModalOpen(true);
  };

  const handleEdit = (season) => {
    setSelectedSeason(season);
    setModalOpen(true);
  };

  const handleViewReports = (season) => {
    setSelectedSeason(season);
    setViewReportsOpen(true);
  };

  const handleDeleteClick = (season) => {
    setSeasonToDelete(season);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (seasonToDelete) {
      try {
        await deleteSeason.mutateAsync(seasonToDelete.id);
        setDeleteConfirmOpen(false);
        setSeasonToDelete(null);
      } catch (error) {
        console.error('Failed to delete season:', error);
      }
    }
  };

  const handleToggleActive = async (season) => {
    try {
      await updateSeason.mutateAsync({
        id: season.id,
        data: { isActive: !season.isActive },
      });
    } catch (error) {
      console.error('Failed to toggle season status:', error);
    }
  };

  const formatMonthRange = (startMonth, endMonth) => {
    if (!startMonth && !endMonth) return 'N/A';
    if (!startMonth) return MONTH_NAMES[endMonth - 1] || 'N/A';
    if (!endMonth) return MONTH_NAMES[startMonth - 1] || 'N/A';
    return `${MONTH_NAMES[startMonth - 1]} - ${MONTH_NAMES[endMonth - 1]}`;
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
        Failed to load seasons. Please try again.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Planting Seasons</Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          size={isMobile ? 'small' : 'medium'}
        >
          Add Season
        </Button>
      </Box>

      {seasons.length === 0 ? (
        <Alert severity="info">
          No seasons found. Click "Add Season" to create one.
        </Alert>
      ) : isMobile ? (
        <Stack spacing={2}>
          {seasons.map((season) => (
            <Card key={season.id} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {season.name}
                  </Typography>
                  <Chip
                    label={season.isActive ? 'Active' : 'Inactive'}
                    color={season.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {formatMonthRange(season.startMonth, season.endMonth)}
                </Typography>
                {season.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {season.description}
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', gap: 1, px: 2, pb: 2 }}>
                <IconButton size="small" onClick={() => handleViewReports(season)} color="info">
                  <ViewIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleEdit(season)} color="primary">
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeleteClick(season)} color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <Switch
                  checked={season.isActive}
                  onChange={() => handleToggleActive(season)}
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
                <TableCell>Description</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Active</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {seasons.map((season) => (
                <TableRow key={season.id}>
                  <TableCell>{season.name}</TableCell>
                  <TableCell>
                    {season.description ? (
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {season.description}
                      </Typography>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={season.isActive ? 'Active' : 'Inactive'}
                      color={season.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={season.isActive}
                      onChange={() => handleToggleActive(season)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <IconButton size="small" onClick={() => handleViewReports(season)} color="info">
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleEdit(season)} color="primary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteClick(season)} color="error">
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

      <SeasonModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedSeason(null);
        }}
        season={selectedSeason}
      />

      <ViewReportsModal
        open={viewReportsOpen}
        onClose={() => {
          setViewReportsOpen(false);
          setSelectedSeason(null);
        }}
        reference={selectedSeason}
        type="season"
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setSeasonToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Season"
        message={`Are you sure you want to delete "${seasonToDelete?.name}"? This action cannot be undone.`}
        loading={deleteSeason.isPending}
      />
    </Box>
  );
}
