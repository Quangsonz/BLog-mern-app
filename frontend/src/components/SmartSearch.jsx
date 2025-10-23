import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  CircularProgress,
  ClickAwayListener,
  Divider,
  Button,
  Menu,
  MenuItem,
  ListItemIcon
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HistoryIcon from '@mui/icons-material/History';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SmartSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const debounceTimer = useRef(null);

  // Load search history from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history.slice(0, 5));
  }, []);

  // Fetch suggestions when user types
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(`/api/posts/suggestions?query=${searchQuery}`);
          setSuggestions(data.suggestions || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        } finally {
          setLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  const handleSearch = (query = searchQuery) => {
    if (query.trim()) {
      // Save to search history
      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      const newHistory = [query, ...history.filter(h => h !== query)].slice(0, 10);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      setSearchHistory(newHistory.slice(0, 5));

      // Navigate to search results page
      navigate(`/search?q=${encodeURIComponent(query)}&sort=${sortBy}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleClearHistory = () => {
    localStorage.removeItem('searchHistory');
    setSearchHistory([]);
  };

  const handleSortMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    handleSortMenuClose();
  };

  return (
    <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
      <Box sx={{ position: 'relative', width: '100%', maxWidth: 600 }}>
        {/* Search Input */}
        <TextField
          fullWidth
          placeholder="Tìm kiếm bài viết thông minh..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          onFocus={() => (searchQuery.length >= 2 || searchHistory.length > 0) && setShowSuggestions(true)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
              bgcolor: 'background.paper',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
              },
              '&.Mui-focused': {
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#667eea' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {loading && <CircularProgress size={20} sx={{ mr: 1 }} />}
                {searchQuery && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchQuery('');
                      setSuggestions([]);
                    }}
                    sx={{ mr: 0.5 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
                <IconButton
                  size="small"
                  onClick={handleSortMenuOpen}
                  sx={{
                    bgcolor: sortBy !== 'relevance' ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                  }}
                >
                  <SortIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Sort Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleSortMenuClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              mt: 1,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }
          }}
        >
          {[
            { value: 'relevance', label: 'Độ liên quan', icon: '🎯' },
            { value: 'recent', label: 'Mới nhất', icon: '🕐' },
            { value: 'likes', label: 'Phổ biến nhất', icon: '❤️' },
          ].map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              selected={sortBy === option.value}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon sx={{ fontSize: '1.2rem' }}>{option.icon}</ListItemIcon>
              <ListItemText>{option.label}</ListItemText>
            </MenuItem>
          ))}
        </Menu>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 1,
              maxHeight: 400,
              overflowY: 'auto',
              borderRadius: 3,
              zIndex: 1000,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }}
          >
            <List sx={{ py: 1 }}>
              {/* Search History */}
              {searchHistory.length > 0 && searchQuery.length < 2 && (
                <>
                  <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HistoryIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Tìm kiếm gần đây
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      onClick={handleClearHistory}
                      sx={{
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        color: 'text.secondary',
                      }}
                    >
                      Xóa
                    </Button>
                  </Box>
                  {searchHistory.map((query, index) => (
                    <ListItem
                      key={index}
                      button
                      onClick={() => handleSuggestionClick(query)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        '&:hover': {
                          bgcolor: 'rgba(102, 126, 234, 0.05)',
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <HistoryIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={query}
                        primaryTypographyProps={{
                          fontSize: '0.9rem',
                        }}
                      />
                    </ListItem>
                  ))}
                  <Divider sx={{ my: 1 }} />
                </>
              )}

              {/* AI Suggestions */}
              {suggestions.length > 0 && (
                <>
                  <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon sx={{ fontSize: 18, color: '#667eea' }} />
                    <Typography variant="caption" sx={{ color: '#667eea', fontWeight: 600 }}>
                      Gợi ý tìm kiếm thông minh
                    </Typography>
                  </Box>
                  {suggestions.map((suggestion, index) => (
                    <ListItem
                      key={index}
                      button
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        '&:hover': {
                          bgcolor: 'rgba(102, 126, 234, 0.08)',
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <SearchIcon fontSize="small" sx={{ color: '#667eea' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={suggestion}
                        primaryTypographyProps={{
                          fontSize: '0.9rem',
                          fontWeight: 500,
                        }}
                      />
                    </ListItem>
                  ))}
                </>
              )}

              {/* No Results */}
              {searchQuery.length >= 2 && suggestions.length === 0 && !loading && (
                <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Không tìm thấy gợi ý phù hợp
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleSearch()}
                    sx={{
                      mt: 2,
                      textTransform: 'none',
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    Tìm kiếm "{searchQuery}"
                  </Button>
                </Box>
              )}
            </List>
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default SmartSearch;
