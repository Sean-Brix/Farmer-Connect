import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Farmer selector with user account search
export default function FarmerSelector({ value, onChange, error, helperText, disabled }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const debounceTimer = useRef(null);
  const listboxRef = useRef(null);

  // Search users with debounce
  const searchUsers = useCallback(async (searchTerm, pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const url = '/account/all';
      console.log('🔍 Searching for:', searchTerm || '(all)', 'Page:', pageNum);
      
      const response = await api.get(url, {
        params: {
          ...(searchTerm && { search: searchTerm }),
          limit: 20,
          page: pageNum
        }
      });

      console.log('📦 API Response:', response.data);

      if (response.data?.list) {
        const users = response.data.list.map(user => ({
          label: `${user.firstName} ${user.surname}`.trim(),
          name: `${user.firstName} ${user.surname}`.trim(),
          rsbsaNumber: user.rsbsaNumber || null,
          id: user.id
        }));
        console.log('👥 Mapped users:', users);
        
        if (append) {
          setOptions(prev => [...prev, ...users]);
        } else {
          setOptions(users);
        }
        
        // Check if there are more pages
        const pagination = response.data.pagination;
        setHasMore(pagination.page < pagination.totalPages);
      } else {
        console.log('⚠️ Unexpected response structure');
        if (!append) setOptions([]);
      }
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      if (!append) setOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Reset to page 1 when search term changes
    setPage(1);

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      searchUsers(inputValue, 1, false);
    }, inputValue.length >= 2 ? 300 : 0); // Immediate if less than 2 chars (shows all)

    // Cleanup
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [inputValue, searchUsers]);

  // Handle scroll for pagination
  const handleScroll = useCallback((event) => {
    const listboxNode = event.currentTarget;
    const position = listboxNode.scrollTop + listboxNode.clientHeight;
    const height = listboxNode.scrollHeight;

    // Load more when scrolled to bottom
    if (position >= height - 10 && !loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      searchUsers(inputValue, nextPage, true); // Append to existing
    }
  }, [loading, hasMore, page, inputValue, searchUsers]);

  return (
    <Autocomplete
      freeSolo
      options={options}
      filterOptions={(x) => x} // Don't filter - we're doing server-side filtering
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        return option.label || option.name || '';
      }}
      inputValue={inputValue}
      onOpen={() => {
        // Load initial data when opened if no search term
        if (!inputValue && options.length === 0) {
          searchUsers('', 1, false);
        }
      }}
      onInputChange={(event, newValue, reason) => {
        console.log('📝 Input changed:', { newValue, reason });
        setInputValue(newValue);
      }}
      onChange={(event, newValue, reason) => {
        console.log('✅ Selection changed:', { newValue, reason });
        if (newValue) {
          // If user selected from dropdown
          if (typeof newValue === 'object') {
            onChange?.(newValue);
          } else {
            // If user typed freeform
            onChange?.({ name: newValue });
          }
        }
      }}
      loading={loading}
      ListboxProps={{
        onScroll: handleScroll,
        ref: listboxRef
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Farmer Name *"
          error={!!error}
          helperText={helperText || 'Type to search user accounts or enter new name'}
          disabled={disabled}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option.id || option.name}>
          <div>
            <div>{option.label || option.name}</div>
            {option.rsbsaNumber && (
              <div style={{ fontSize: '0.85em', color: '#666' }}>
                RSBSA: {option.rsbsaNumber}
              </div>
            )}
          </div>
        </li>
      )}
    />
  );
}
