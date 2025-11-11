import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { 
  Box, 
  Button,
  Container, 
  Grid, 
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Fade,
  Alert,
  Snackbar
} from "@mui/material";
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import moment from "moment";
import Loader from "../components/Loader";
import { io } from "socket.io-client";

const socket = io("/", {
  reconnection: true,
});

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postAddLike, setPostAddLike] = useState([]);
  const [postRemoveLike, setPostRemoveLike] = useState([]);
  
  // Filter and Sort States
  const [selectedCategory, setSelectedCategory] = useState('All Posts');
  const [selectedSort, setSelectedSort] = useState('Latest');
  
  // Error handling
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  
  // Cache to prevent duplicate API calls
  const lastFetchTime = React.useRef(0);
  const FETCH_COOLDOWN = 2000; // 2 seconds cooldown between fetches

  //display posts

  const showPosts = async () => {
    // Prevent too frequent API calls
    const now = Date.now();
    if (now - lastFetchTime.current < FETCH_COOLDOWN) {
      console.log('⚠️ Skipping API call - cooldown active');
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await axios.get("/api/posts/show");
      setPosts(data.posts);
      lastFetchTime.current = Date.now();
      setError(null);
      setLoading(false);
    } catch (error) {
      console.log(error.response?.data?.error || error.message);
      
      // Handle 429 Too Many Requests
      if (error.response?.status === 429) {
        setError('⏱️ Too many requests. Please wait a moment before refreshing.');
        setShowError(true);
      } else {
        setError(error.response?.data?.error || 'Failed to load posts');
        setShowError(true);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    showPosts();
  }, []);

  useEffect(() => {
    socket.on("add-like", (newPosts) => {
      setPostAddLike(newPosts);
      setPostRemoveLike([]);
    });
    socket.on("remove-like", (newPosts) => {
      setPostRemoveLike(newPosts);
      setPostAddLike([]);
    });

    // Cleanup socket listeners on unmount
    return () => {
      socket.off("add-like");
      socket.off("remove-like");
    };
  }, []);

  // Get base posts (from socket or state)
  let basePosts =
    postAddLike.length > 0
      ? postAddLike
      : postRemoveLike.length > 0
      ? postRemoveLike
      : posts;

  // Apply Category Filter
  const filterByCategory = (posts) => {
    if (selectedCategory === 'All Posts') {
      return posts;
    }
    return posts.filter(post => post.category === selectedCategory);
  };

  // Apply Sorting
  const sortPosts = (posts) => {
    const sortedPosts = [...posts];
    
    switch (selectedSort) {
      case 'Latest':
        return sortedPosts.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
      
      case 'Most Popular':
        return sortedPosts.sort((a, b) => 
          (b.likes?.length || 0) - (a.likes?.length || 0)
        );
      
      case 'Most Commented':
        return sortedPosts.sort((a, b) => 
          (b.comments?.length || 0) - (a.comments?.length || 0)
        );
      
      default:
        return sortedPosts;
    }
  };

  // Final filtered and sorted posts
  let uiPosts = sortPosts(filterByCategory(basePosts));

  // Handle Category Change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Handle Sort Change
  const handleSortChange = (sort) => {
    setSelectedSort(sort);
  };

  // Get post count by category
  const getCategoryCount = (category) => {
    if (category === 'All Posts') return basePosts.length;
    return basePosts.filter(post => post.category === category).length;
  };

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    content: "",
    image: ""
  });

  const categories = ['Technology', 'Design', 'Business', 'Lifestyle', 'Other'];

  const handleCreatePost = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/post/create", formData);
      if (data.success) {
        setOpen(false);
        setFormData({ category: "", content: "", image: "" });
        showPosts();
      }
      setLoading(false);
    } catch (error) {
      console.log(error.response.data.error);
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
  };

  return (
    <>
      <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh" }}>
        <Navbar />
        
        {/* Error Snackbar */}
        <Snackbar
          open={showError}
          autoHideDuration={6000}
          onClose={() => setShowError(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setShowError(false)} 
            severity="warning" 
            sx={{ width: '100%', boxShadow: 3 }}
          >
            {error}
          </Alert>
        </Snackbar>
        
        {/* Hero Section */}
        <Box sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: "white",
          py: { xs: 10, md: 14 },
          mb: 6,
          position: "relative",
          overflow: "hidden",
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)`,
            animation: 'float 15s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0) scale(1)' },
              '50%': { transform: 'translateY(-20px) scale(1.05)' },
            }
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -2,
            left: 0,
            right: 0,
            height: 100,
            background: 'linear-gradient(to bottom, transparent, #f5f7fa)',
          }
        }}>
          <Container sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h1" 
              component="h1" 
              align="center"
              sx={{ 
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                letterSpacing: '-0.02em',
                animation: 'fadeInDown 0.8s ease-out',
                '@keyframes fadeInDown': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(-30px)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  }
                }
              }}
            >
              Welcome to Our Blog
            </Typography>
            <Typography 
              variant="h5" 
              align="center"
              sx={{ 
                maxWidth: 700,
                mx: "auto",
                opacity: 0.95,
                mb: 5,
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                lineHeight: 1.6,
                fontWeight: 400,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                animation: 'fadeInUp 0.8s ease-out 0.2s both',
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(30px)',
                  },
                  '100%': {
                    opacity: 0.95,
                    transform: 'translateY(0)',
                  }
                }
              }}
            >
              Discover amazing stories and share your thoughts with our community
            </Typography>
            <Box sx={{ 
              display: "flex", 
              justifyContent: "center",
              animation: 'fadeIn 0.8s ease-out 0.4s both',
              '@keyframes fadeIn': {
                '0%': { opacity: 0 },
                '100%': { opacity: 1 },
              }
            }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => setOpen(true)}
                sx={{
                  px: 5,
                  py: 2,
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  textTransform: "none",
                  bgcolor: 'white',
                  color: '#667eea',
                  borderRadius: 3,
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    transition: 'left 0.5s ease',
                  },
                  "&:hover": {
                    transform: "translateY(-4px) scale(1.05)",
                    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
                    bgcolor: 'white',
                    '&::before': {
                      left: '100%',
                    }
                  },
                  '&:active': {
                    transform: 'translateY(-2px) scale(1.02)',
                  }
                }}
              >
                ✨ Create Post
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Three Column Layout */}
        <Container maxWidth="xl" sx={{ pb: 6 }}>
          <Grid container spacing={3}>
            {/* Left Sidebar - Filters */}
            <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ 
                position: 'sticky', 
                top: 100,
                bgcolor: 'white',
                borderRadius: 3,
                p: 3,
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#667eea' }}>
                  🔍 Filters
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: 'text.secondary' }}>
                    Categories
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {['All Posts', 'Technology', 'Design', 'Business', 'Lifestyle'].map((category) => (
                      <Button
                        key={category}
                        variant={category === selectedCategory ? 'contained' : 'text'}
                        size="small"
                        onClick={() => handleCategoryChange(category)}
                        sx={{
                          justifyContent: 'space-between',
                          textTransform: 'none',
                          fontWeight: category === selectedCategory ? 600 : 500,
                          bgcolor: category === selectedCategory ? '#667eea' : 'transparent',
                          color: category === selectedCategory ? 'white' : 'text.secondary',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: category === selectedCategory ? '#5568d3' : 'rgba(102, 126, 234, 0.08)',
                            transform: 'translateX(4px)',
                          }
                        }}
                      >
                        <span>{category}</span>
                        <Box
                          component="span"
                          sx={{
                            ml: 1,
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            bgcolor: category === selectedCategory 
                              ? 'rgba(255, 255, 255, 0.2)' 
                              : 'rgba(102, 126, 234, 0.1)',
                            color: category === selectedCategory ? 'white' : '#667eea',
                          }}
                        >
                          {getCategoryCount(category)}
                        </Box>
                      </Button>
                    ))}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: 'text.secondary' }}>
                    Sort By
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {[
                      { label: 'Latest', icon: '🕐' },
                      { label: 'Most Popular', icon: '❤️' },
                      { label: 'Most Commented', icon: '💬' }
                    ].map(({ label, icon }) => (
                      <Button
                        key={label}
                        variant={label === selectedSort ? 'contained' : 'text'}
                        size="small"
                        onClick={() => handleSortChange(label)}
                        sx={{
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          fontWeight: label === selectedSort ? 600 : 500,
                          bgcolor: label === selectedSort ? '#667eea' : 'transparent',
                          color: label === selectedSort ? 'white' : 'text.secondary',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: label === selectedSort ? '#5568d3' : 'rgba(102, 126, 234, 0.08)',
                            transform: 'translateX(4px)',
                          }
                        }}
                      >
                        <span style={{ marginRight: '8px' }}>{icon}</span>
                        {label}
                      </Button>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Center Column - Posts Feed (1 post per row) */}
            <Grid item xs={12} md={6}>
              {/* Active Filters Display */}
              <Fade in={selectedCategory !== 'All Posts' || selectedSort !== 'Latest'}>
                <Box sx={{ 
                  mb: 3, 
                  p: 2, 
                  bgcolor: 'white', 
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  flexWrap: 'wrap'
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    Active Filters:
                  </Typography>
                  
                  {selectedCategory !== 'All Posts' && (
                    <Chip
                      label={`Category: ${selectedCategory}`}
                      onDelete={() => handleCategoryChange('All Posts')}
                      sx={{
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                        color: '#667eea',
                        fontWeight: 600,
                        '& .MuiChip-deleteIcon': {
                          color: '#667eea',
                          '&:hover': {
                            color: '#5568d3',
                          }
                        }
                      }}
                    />
                  )}
                  
                  {selectedSort !== 'Latest' && (
                    <Chip
                      label={`Sort: ${selectedSort}`}
                      onDelete={() => handleSortChange('Latest')}
                      sx={{
                        bgcolor: 'rgba(118, 75, 162, 0.1)',
                        color: '#764ba2',
                        fontWeight: 600,
                        '& .MuiChip-deleteIcon': {
                          color: '#764ba2',
                          '&:hover': {
                            color: '#6a3f91',
                          }
                        }
                      }}
                    />
                  )}
                  
                  <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary', fontWeight: 500 }}>
                    {uiPosts.length} {uiPosts.length === 1 ? 'post' : 'posts'} found
                  </Typography>
                </Box>
              </Fade>

              {loading ? (
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  py: 8 
                }}>
                  <Loader />
                </Box>
              ) : uiPosts.length === 0 ? (
                <Box sx={{
                  p: 6,
                  textAlign: 'center',
                  bgcolor: 'white',
                  borderRadius: 3,
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                }}>
                  <Typography variant="h4" sx={{ mb: 2, fontSize: '3rem' }}>
                    😕
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                    No posts found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    No posts match your current filters.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handleCategoryChange('All Posts');
                      handleSortChange('Latest');
                    }}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: '#667eea',
                      color: '#667eea',
                      '&:hover': {
                        borderColor: '#5568d3',
                        bgcolor: 'rgba(102, 126, 234, 0.08)',
                      }
                    }}
                  >
                    Clear All Filters
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {uiPosts.map((post, index) => (
                    <Box key={post._id} sx={{
                      animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                      '@keyframes fadeInUp': {
                        '0%': {
                          opacity: 0,
                          transform: 'translateY(20px)',
                        },
                        '100%': {
                          opacity: 1,
                          transform: 'translateY(0)',
                        }
                      }
                    }}>
                      <PostCard
                        id={post._id}
                        category={post.category}
                        content={post.content}
                        image={post.image ? post.image.url : ""}
                        subheader={moment(post.createdAt).format("MMMM DD, YYYY")}
                        comments={post.comments.length}
                        likes={post.likes.length}
                        likesId={post.likes}
                        postedBy={post.postedBy?._id || post.postedBy}
                        postedByName={post.postedBy?.name || 'Anonymous'}
                        postedByAvatar={post.postedBy?.avatar?.url || ''}
                        showPosts={showPosts}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>

            {/* Right Sidebar - Suggestions */}
            <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ 
                position: 'sticky', 
                top: 100,
              }}>
                {/* Trending Topics */}
                <Box sx={{
                  bgcolor: 'white',
                  borderRadius: 3,
                  p: 3,
                  mb: 3,
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#667eea' }}>
                    🔥 Trending Topics
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {['#ReactJS', '#NodeJS', '#WebDev', '#JavaScript', '#Design'].map((tag, idx) => (
                      <Box key={idx} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateX(4px)',
                        }
                      }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
                          {tag}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {Math.floor(Math.random() * 100 + 20)} posts
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Suggested Users */}
                <Box sx={{
                  bgcolor: 'white',
                  borderRadius: 3,
                  p: 3,
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#667eea' }}>
                    👥 Suggested for you
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {['John Doe', 'Jane Smith', 'Alex Johnson'].map((name, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                        }}>
                          {name[0]}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {Math.floor(Math.random() * 50 + 10)} followers
                          </Typography>
                        </Box>
                        <Button 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            textTransform: 'none',
                            borderRadius: 2,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          Follow
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Create Post Dialog */}
        <Dialog 
          open={open} 
          onClose={() => setOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            }
          }}
        >
          <Box sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 3,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
            }
          }}>
            <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  ✨ Create New Post
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Share your amazing story with the community
                </Typography>
              </Box>
              <IconButton 
                onClick={() => setOpen(false)}
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { 
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'rotate(90deg)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          
          <DialogContent sx={{ p: 4, pt: 3 }}>
            <FormControl 
              fullWidth 
              margin="dense"
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                  }
                }
              }}
            >
              <InputLabel id="category-label">🏷️ Category</InputLabel>
              <Select
                labelId="category-label"
                value={formData.category}
                label="🏷️ Category"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                autoFocus
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300, // Fix: Giới hạn chiều cao menu
                    }
                  }
                }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              margin="dense"
              label="✍️ Post Content"
              placeholder="Write your story here..."
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                  }
                }
              }}
            />

            <Box sx={{ mb: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="raised-button-file">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<ImageIcon />}
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    borderWidth: 2,
                    borderColor: '#667eea',
                    color: '#667eea',
                    fontWeight: 600,
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: '#667eea',
                      bgcolor: 'rgba(102, 126, 234, 0.08)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                    }
                  }}
                >
                  📸 Upload Image
                </Button>
              </label>
            </Box>

            {formData.image && (
              <Box sx={{ 
                mt: 2, 
                position: 'relative',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                animation: 'fadeIn 0.5s ease-out',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0, transform: 'scale(0.95)' },
                  '100%': { opacity: 1, transform: 'scale(1)' },
                }
              }}>
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  style={{ 
                    width: '100%',
                    height: 250,
                    objectFit: 'cover',
                  }} 
                />
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.1) 100%)',
                }} />
                <IconButton
                  sx={{ 
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      bgcolor: 'rgba(255, 23, 68, 0.9)',
                      transform: 'rotate(90deg) scale(1.1)',
                    }
                  }}
                  onClick={() => setFormData({ ...formData, image: "" })}
                >
                  <CloseIcon sx={{ color: 'white' }} />
                </IconButton>
                <Box sx={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#667eea' }}>
                    ✓ Image uploaded
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          
          <DialogActions sx={{ 
            px: 4, 
            pb: 4, 
            pt: 2,
            gap: 2,
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          }}>
            <Button 
              onClick={() => setOpen(false)}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                color: 'text.secondary',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePost}
              variant="contained"
              disabled={!formData.category || !formData.content || loading}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  background: 'rgba(0, 0, 0, 0.12)',
                  color: 'rgba(0, 0, 0, 0.26)',
                }
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                  <span>Creating...</span>
                </Box>
              ) : (
                "🚀 Create Post"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        <Footer />
      </Box>
    </>
  );
};

export default Home;
