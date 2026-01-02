import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useReportsByVariety, useReportsBySeason } from '../../hooks/useReferenceData';
import { format } from 'date-fns';

export function ViewReportsModal({ open, onClose, reference, type }) {
  const varietyQuery = useReportsByVariety(
    reference?.id,
    { enabled: type === 'variety' && Boolean(reference?.id) }
  );
  const seasonQuery = useReportsBySeason(
    reference?.id,
    { enabled: type === 'season' && Boolean(reference?.id) }
  );

  const query = type === 'variety' ? varietyQuery : seasonQuery;
  const { data: reports = [], isLoading, isError } = query;

  const getStateColor = (state) => {
    switch (state) {
      case 'Request_Report':
        return 'warning';
      case 'Planted':
        return 'info';
      case 'Completed':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Reports using {type === 'variety' ? 'Variety' : 'Season'}: {reference?.name}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Alert severity="error">
            Failed to load reports. Please try again.
          </Alert>
        )}

        {!isLoading && !isError && reports.length === 0 && (
          <Alert severity="info">
            No planting reports found using this {type}.
          </Alert>
        )}

        {!isLoading && !isError && reports.length > 0 && (
          <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell>Farmer</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Planting Date</TableCell>
                  <TableCell>State</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.farmer?.name || 'N/A'}</TableCell>
                    <TableCell>{report.farmer?.barangay || 'N/A'}</TableCell>
                    <TableCell>{formatDate(report.plantingDate)}</TableCell>
                    <TableCell>
                      <Chip
                        label={report.state?.replace('_', ' ')}
                        color={getStateColor(report.state)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
}
