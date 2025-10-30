import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  Pagination,
  Fade,
  Zoom
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import SmartSearch from '../components/SmartSearch';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';

const SearchResults = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    const sort = params.get('sort') || 'relevance';
    const page = parseInt(params.get('page')) || 1;

    setSearchQuery(query);
    setSortBy(sort);
    setCurrentPage(page);

    if (query) {
      performSearch(query, sort, page);
    }
  }, [location.search]);

  const performSearch = async (query, sort, page) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/posts/search?query=${encodeURIComponent(query)}&sortBy=${sort}&page=${page}&limit=12`
      );
      
      setPosts(data.posts || []);
      setTotalResults(data.totalResults || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (event, newSort) => {
    if (newSort !== null) {
      setSortBy(newSort);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&sort=${newSort}&page=1`);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}&sort=${sortBy}&page=${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
          pt: { xs: 10, md: 12 },
          pb: 8,
        }}
      >
        <Container maxWidth="lg">
          {/* Search Bar */}
          <Fade in timeout={500}>
            <Box sx={{ mb: 4 }}>
              <SmartSearch />
            </Box>
          </Fade>

          {/* Search Info */}
          {searchQuery && (
            <Fade in timeout={700}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <SearchIcon sx={{ color: '#667eea', fontSize: 28 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea', mb: 0.5 }}>
                      Search results for: "{searchQuery}"
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Found {totalResults} matching results
                    </Typography>
                  </Box>
                  
                  {/* Sort Toggle */}
                  <ToggleButtonGroup
                    value={sortBy}
                    exclusive
                    onChange={handleSortChange}
                    size="small"
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      '& .MuiToggleButton-root': {
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 2,
                        py: 1,
                        '&.Mui-selected': {
                          bgcolor: '#667eea',
                          color: 'white',
                          '&:hover': {
                            bgcolor: '#5568d3',
                          }
                        }
                      }
                    }}
                  >
                    <ToggleButton value="relevance">
                      <TrendingUpIcon sx={{ mr: 0.5, fontSize: 18 }} />
                      Relevance
                    </ToggleButton>
                    <ToggleButton value="recent">
                      <AccessTimeIcon sx={{ mr: 0.5, fontSize: 18 }} />
                      Most Recent
                    </ToggleButton>
                    <ToggleButton value="likes">
                      <FavoriteIcon sx={{ mr: 0.5, fontSize: 18 }} />
                      Most Popular
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Paper>
            </Fade>
          )}

          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} sx={{ color: '#667eea' }} />
            </Box>
          )}

          {/* Search Results */}
          {!loading && posts.length > 0 && (
            <>
              <Grid container spacing={3}>
                {posts.map((post, index) => (
                  <Grid item xs={12} key={post._id}>
                    <Zoom in timeout={300 + index * 100}>
                      <Box
                        sx={{
                          position: 'relative',
                          '&::before': post.relevanceScore > 80 ? {
                            content: '"🎯 Best Match"',
                            position: 'absolute',
                            top: -10,
                            right: 20,
                            bgcolor: '#667eea',
                            color: 'white',
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            zIndex: 10,
                            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)',
                          } : {}
                        }}
                      >
                        <PostCard
                          key={post._id}
                          id={post._id}
                          category={post.category}
                          content={post.content}
                          image={post.image?.url}
                          likes={post.likes}
                          comments={post.comments}
                          postedBy={post.postedBy?._id || post.postedBy}
                          postedByName={post.postedBy?.name || 'Anonymous'}
                          postedByAvatar={post.postedBy?.avatar?.url || ''}
                          subheader={`${post.postedBy?.name || 'Anonymous'} • ${moment(post.createdAt).fromNow()}`}
                          createdAt={post.createdAt}
                        />
                        {/* Relevance Score Badge (for debugging/admin) */}
                        {post.relevanceScore && (
                          <Chip
                            label={`Score: ${Math.round(post.relevanceScore)}`}
                            size="small"
                            sx={{
                              position: 'absolute',
                              bottom: 16,
                              right: 16,
                              bgcolor: 'rgba(102, 126, 234, 0.1)',
                              color: '#667eea',
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: 2,
                        fontWeight: 600,
                        '&.Mui-selected': {
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }
                      }
                    }}
                  />
                </Box>
              )}
            </>
          )}

          {/* No Results */}
          {!loading && searchQuery && posts.length === 0 && (
            <Fade in timeout={500}>
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  textAlign: 'center',
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    fontSize: '3rem',
                  }}
                >
                  🔍
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  No Results Found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  No posts match the keyword "{searchQuery}"
                </Typography>
                <Alert severity="info" sx={{ maxWidth: 500, mx: 'auto' }}>
                  <Typography variant="body2">
                    <strong>Suggestions:</strong>
                    <br />• Try different keywords
                    <br />• Check spelling
                    <br />• Use more general terms
                  </Typography>
                </Alert>
              </Paper>
            </Fade>
          )}

          {/* Empty State */}
          {!loading && !searchQuery && (
            <Fade in timeout={500}>
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  textAlign: 'center',
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    fontSize: '3rem',
                  }}
                >
                  🚀
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Start Searching
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Enter keywords in the search box to discover content
                </Typography>
              </Paper>
            </Fade>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default SearchResults;
