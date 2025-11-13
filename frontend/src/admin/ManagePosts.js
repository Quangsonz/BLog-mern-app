import React, { useEffect, useState } from "react";
import { 
  Box, 
  Button, 
  Paper, 
  Typography, 
  Chip,
  Avatar,
  Tooltip,
  TextField,
  InputAdornment,
  IconButton
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import moment from "moment";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";

const ManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const displayPost = async () => {
    try {
      const { data } = await axios.get("/api/posts/show?limit=1000"); // Get all posts
      setPosts(data.posts);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load posts");
    }
  };

  useEffect(() => {
    displayPost();
  }, []);

  const deletePostById = async (e, id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const { data } = await axios.delete(`/api/post/delete/${id}`, {
          withCredentials: true
        });
        if (data.success === true) {
          toast.success(data.message || "Post deleted successfully");
          displayPost();
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.error || "Failed to delete post");
      }
    }
  };

  // Delete multiple posts
  const deleteMultiplePosts = async () => {
    if (selectedRows.length === 0) {
      toast.warning("Please select posts to delete");
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} post(s)?`)) {
      try {
        let successCount = 0;
        let failCount = 0;

        // Delete each post
        for (const postId of selectedRows) {
          try {
            await axios.delete(`/api/post/delete/${postId}`, {
              withCredentials: true
            });
            successCount++;
          } catch (error) {
            console.log(`Failed to delete post ${postId}:`, error);
            failCount++;
          }
        }

        // Show result
        if (successCount > 0) {
          toast.success(`Successfully deleted ${successCount} post(s)`);
        }
        if (failCount > 0) {
          toast.error(`Failed to delete ${failCount} post(s)`);
        }

        // Refresh list and clear selection
        setSelectedRows([]);
        displayPost();
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete posts");
      }
    }
  };

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.postedBy?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Avatar 
            src={params.row?.image?.url} 
            alt={params.row?.title}
            variant="rounded"
            sx={{ width: 60, height: 60, boxShadow: 1 }}
          />
        </Box>
      ),
    },
    {
      field: "content",
      headerName: "Post Title",
      width: 250,
      renderCell: (params) => {
        const content = params.value || 'Untitled';
        // Extract plain text from HTML
        const plainText = content.replace(/<[^>]*>/g, '').substring(0, 60);
        return (
          <Typography 
            variant="body2" 
            sx={{ fontWeight: 500 }}
            title={plainText}
          >
            {plainText.length > 60 ? `${plainText}...` : plainText}
          </Typography>
        );
      },
    },
    {
      field: "category",
      headerName: "Category",
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value || 'Other'} 
          size="small"
          sx={{ 
            bgcolor: 'rgba(102, 126, 234, 0.1)',
            color: '#667eea',
            fontWeight: 600,
            fontSize: '0.75rem'
          }}
        />
      ),
    },
    {
      field: "postedBy",
      headerName: "Author",
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar 
            sx={{ 
              width: 28, 
              height: 28,
              fontSize: '0.75rem',
              bgcolor: '#667eea'
            }}
          >
            {params.row.postedBy?.name?.[0]?.toUpperCase()}
          </Avatar>
          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
            {params.row.postedBy?.name}
          </Typography>
        </Box>
      ),
    },
    {
      field: "likes",
      headerName: "Likes",
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <FavoriteIcon sx={{ fontSize: 16, color: '#f44336' }} />
          <Typography variant="body2">{params.row.likes.length}</Typography>
        </Box>
      ),
    },
    {
      field: "comments",
      headerName: "Comments",
      width: 110,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CommentIcon sx={{ fontSize: 16, color: '#667eea' }} />
          <Typography variant="body2">{params.row.comments.length}</Typography>
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 130,
      renderCell: (params) => (
        <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
          {moment(params.row.createdAt).format("MMM DD, YYYY")}
        </Typography>
      ),
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 120,
      renderCell: (value) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Edit">
            <Link to={`/admin/post/edit/${value.row._id}`}>
              <IconButton 
                size="small"
                sx={{
                  bgcolor: 'rgba(25, 118, 210, 0.1)',
                  '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.2)' }
                }}
              >
                <EditIcon sx={{ color: "#1976d2", fontSize: 18 }} />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={(e) => deletePostById(e, value.row._id)}
              sx={{
                bgcolor: 'rgba(244, 67, 54, 0.1)',
                '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' }
              }}
            >
              <DeleteIcon sx={{ color: "#f44336", fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ 
        mb: 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 3,
        p: 4,
        color: 'white',
      }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          📝 Manage Posts
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          View, edit, and delete all blog posts
        </Typography>
      </Box>

      {/* Posts Table */}
      <Paper sx={{ 
        borderRadius: 3, 
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        <Box sx={{ 
          p: 3, 
          bgcolor: '#fafafa',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                All Posts ({filteredPosts.length})
              </Typography>
              {selectedRows.length > 0 && (
                <Chip 
                  label={`${selectedRows.length} selected`}
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {selectedRows.length > 0 && (
                <Button 
                  variant="contained" 
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={deleteMultiplePosts}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3,
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(244, 67, 54, 0.4)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(244, 67, 54, 0.5)',
                    }
                  }}
                >
                  Delete Selected ({selectedRows.length})
                </Button>
              )}
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                component={Link}
                to="/admin/post/create"
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
                    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
                  }
                }}
              >
                Create New Post
              </Button>
            </Box>
          </Box>

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search by title, category, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'white',
              }
            }}
          />
        </Box>

        <Box sx={{ height: 600, width: "100%", bgcolor: 'white' }}>
          <DataGrid
            getRowId={(row) => row._id}
            rowHeight={80}
            sx={{
              border: 0,
              "& .MuiDataGrid-cell": {
                borderBottom: '1px solid rgba(0,0,0,0.05)',
              },
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: '#f8f9fa',
                color: 'text.secondary',
                fontWeight: 700,
                fontSize: '0.85rem',
                borderBottom: '2px solid rgba(102, 126, 234, 0.2)',
              },
              "& .MuiDataGrid-row": {
                '&:hover': {
                  bgcolor: 'rgba(102, 126, 234, 0.02)',
                }
              },
            }}
            rows={filteredPosts}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            checkboxSelection
            onRowSelectionModelChange={(newSelection) => {
              console.log('Selected rows:', newSelection);
              setSelectedRows(newSelection);
            }}
            rowSelectionModel={selectedRows}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default ManagePosts;
