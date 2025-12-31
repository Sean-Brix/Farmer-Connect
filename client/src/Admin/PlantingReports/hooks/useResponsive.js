/**
 * useResponsive Hook
 * Helper hook for responsive design
 */

import { useMediaQuery, useTheme } from '@mui/material';

export function useResponsive() {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // 0-767px
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg')); // 768-1023px
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg')); // 1024px+

  const isSmallScreen = useMediaQuery('(max-width:600px)'); // Extra small
  const isMediumScreen = useMediaQuery('(min-width:600px) and (max-width:1023px)');
  const isLargeScreen = useMediaQuery('(min-width:1024px)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  };
}

export default useResponsive;
