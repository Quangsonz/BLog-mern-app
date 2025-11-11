import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Avatar,
  IconButton,
  Typography,
  Box,
  Button,
  Divider,
  Container,
  Paper,
  Chip,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CommentIcon from "@mui/icons-material/Comment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import moment from "moment";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CommentList from "../components/CommentList";
import { io } from "socket.io-client";

const socket = io("/", {
  reconnection: true,
});

const SinglePost = () => {
  const { userInfo } = useSelector((state) => state.signIn);
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [postedBy, setPostedBy] = useState(null);
  const [postedByName, setPostedByName] = useState("");
  const [postedByAvatar, setPostedByAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentsRealTime, setCommentsRealTime] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { id } = useParams();
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    if (userInfo && userInfo.role === 'admin') {
      navigate(`/admin/post/edit/${id}`);
    } else if (isOwner) {
      navigate(`/post/edit/${id}`);
    } else {
      toast.error('You are not authorized to edit this post');
    }
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const { data } = await axios.delete(`/api/post/delete/${id}`, {
        withCredentials: true
      });
      if (data.success) {
        toast.success('Post deleted successfully!');
        setDeleteDialogOpen(false);
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.error || 'Failed to delete post');
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  // Check if current user is the post owner
  const isOwner = userInfo && postedBy && userInfo.id === postedBy;
  //fetch single post
  const displaySinglePost = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/post/${id}`);
      // console.log(data)
      setCategory(data.post.category || "");
      setContent(data.post.content);
      setImage(data.post.image?.url || "");
      setCreatedAt(data.post.createdAt);
      setPostedBy(data.post.postedBy?._id || data.post.postedBy);
      setPostedByName(data.post.postedBy?.name || "Anonymous");
      setPostedByAvatar(data.post.postedBy?.avatar?.url || "");
      setLoading(false);
        // show newest comments first
        setComments((data.post.comments || []).slice().reverse());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    displaySinglePost();
  }, [id]);

  useEffect(() => {
    // console.log('SOCKET IO', socket);
    socket.on("new-comment", (newComment) => {
      setCommentsRealTime(newComment);
    });
  }, []);

  // add comment
  const addComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    // optimistic update
    const tempComment = {
      _id: `temp-${Date.now()}`,
      text: comment,
      postedBy: { name: userInfo?.name || 'You' },
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [tempComment, ...prev]);
    setComment("");

    try {
      const { data } = await axios.put(`/api/comment/post/${id}`, { comment }, { withCredentials: true });
      if (data.success === true) {
        toast.success("Comment added");
        // replace optimistic list with server list
        setComments(data.post.comments.reverse());
        socket.emit("comment", data.post.comments);
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.error || 'Could not add comment');
      // rollback optimistic update
      setComments((prev) => prev.filter(c => !String(c._id).startsWith('temp-')));
    } finally {
      setSubmitting(false);
    }
  };

  let uiCommentUpdate =
    commentsRealTime.length > 0 ? commentsRealTime : comments;

  return (
    <>
      <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh" }}>
        <Navbar />
        
        <Container maxWidth="lg" sx={{ py: 6 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <Loader />
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              gap: 4,
              flexDirection: { xs: 'column', md: 'row' }
            }}>
              {/* Main Content */}
              <Box sx={{ flex: 1 }}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  {/* Header */}
                  <Box sx={{ 
                    p: 3, 
                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                    background: 'white'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar
                        src={postedByAvatar}
                        sx={{
                          width: 56,
                          height: 56,
                          background: postedByAvatar ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          fontSize: '1.5rem',
                          fontWeight: 700,
                        }}
                      >
                        {!postedByAvatar && (postedByName?.[0]?.toUpperCase() || 'U')}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          Posted by {postedByName || 'Anonymous'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {moment(createdAt).format("MMMM DD, YYYY")}
                          </Typography>
                        </Box>
                      </Box>
                      {isOwner && (
                        <>
                          <IconButton
                            aria-label="settings"
                            onClick={handleMenuClick}
                            sx={{
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                bgcolor: 'rgba(102, 126, 234, 0.1)',
                                transform: 'rotate(90deg)',
                              }
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={openMenu}
                            onClose={handleMenuClose}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            PaperProps={{
                              sx: {
                                borderRadius: 2,
                                mt: 1,
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                minWidth: 160,
                                maxHeight: 300, // Fix: Thêm max-height
                              }
                            }}
                            slotProps={{
                              paper: {
                                style: {
                                  maxHeight: 300,
                                }
                              }
                            }}
                          >
                            <MenuItem onClick={handleEdit} sx={{ py: 1.5 }}>
                              <ListItemIcon>
                                <EditIcon fontSize="small" sx={{ color: '#667eea' }} />
                              </ListItemIcon>
                              <ListItemText>Edit</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleDeleteClick} sx={{ py: 1.5 }}>
                              <ListItemIcon>
                                <DeleteIcon fontSize="small" sx={{ color: '#f44336' }} />
                              </ListItemIcon>
                              <ListItemText sx={{ color: '#f44336' }}>Delete</ListItemText>
                            </MenuItem>
                          </Menu>
                        </>
                      )}
                    </Box>
                    
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        mb: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        lineHeight: 1.2,
                      }}
                    >
                      {category && (
                        <Chip 
                          label={category}
                          sx={{ 
                            fontSize: '1rem',
                            height: 40,
                            px: 2,
                            fontWeight: 700,
                            bgcolor: 'rgba(102, 126, 234, 0.15)',
                            color: '#667eea',
                            border: '2px solid rgba(102, 126, 234, 0.4)',
                            mb: 2,
                          }}
                        />
                      )}
                    </Typography>
                  </Box>

                  {/* Featured Image */}
                  {image && (
                    <Box sx={{ position: 'relative', mb: 3 }}>
                      <CardMedia
                        component="img"
                        image={image}
                        alt={category || 'Post image'}
                        sx={{
                          width: '100%',
                          height: 'auto',
                          maxHeight: 600,
                          objectFit: 'contain',
                          bgcolor: '#f5f5f5',
                          borderRadius: 2,
                        }}
                      />
                    </Box>
                  )}

                  {/* Content */}
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      component="div"
                      sx={{
                        fontSize: '1.125rem',
                        lineHeight: 1.8,
                        color: 'text.primary',
                        '& p': { mb: 2 },
                        '& h1, & h2, & h3': {
                          mt: 3,
                          mb: 2,
                          fontWeight: 700,
                          color: '#1a237e',
                        },
                        '& img': {
                          maxWidth: '100%',
                          borderRadius: 2,
                          my: 2,
                        },
                        '& p': {
                          margin: 0,
                          marginBottom: 2,
                          lineHeight: 1.8,
                        },
                        '& br': {
                          display: 'block',
                          content: '""',
                          marginTop: '0.5em',
                        },
                        '& ul, & ol': {
                          paddingLeft: 3,
                          marginBottom: 2,
                        },
                        '& li': {
                          marginBottom: 1,
                        }
                      }}
                    >
                      <Box dangerouslySetInnerHTML={{ __html: content }} />
                    </Typography>
                  </CardContent>

                  {/* Comments Section */}
                  <Box sx={{ 
                    p: 4, 
                    pt: 0,
                    borderTop: '2px solid rgba(102, 126, 234, 0.1)',
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      mb: 3,
                      mt: 2
                    }}>
                      <CommentIcon sx={{ color: '#667eea' }} />
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Comments ({uiCommentUpdate.length})
                      </Typography>
                    </Box>

                    {/* Add Comment Form */}
                    {userInfo ? (
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          mb: 3,
                          borderRadius: 3,
                          bgcolor: 'rgba(102, 126, 234, 0.04)',
                          border: '2px solid rgba(102, 126, 234, 0.1)',
                        }}
                      >
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          💬 Add your comment here!
                        </Typography>
                        <form onSubmit={addComment}>
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            variant="outlined"
                            sx={{
                              mb: 2,
                              bgcolor: 'white',
                              borderRadius: 2,
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover': {
                                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                                },
                                '&.Mui-focused': {
                                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                                }
                              }
                            }}
                          />
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={!comment.trim()}
                            sx={{
                              px: 4,
                              py: 1.5,
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
                                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                                transform: 'translateY(-2px)',
                              },
                              transition: 'all 0.3s ease',
                            }}
                          >
                            💬 Post Comment
                          </Button>
                        </form>
                      </Paper>
                    ) : (
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          mb: 3,
                          borderRadius: 3,
                          bgcolor: 'rgba(255, 152, 0, 0.08)',
                          border: '2px solid rgba(255, 152, 0, 0.2)',
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          🔐 Please log in to leave a comment
                        </Typography>
                        <Button
                          component={Link}
                          to="/login"
                          variant="contained"
                          sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            bgcolor: '#ff9800',
                            '&:hover': {
                              bgcolor: '#f57c00',
                            }
                          }}
                        >
                          Log In
                        </Button>
                      </Paper>
                    )}

                    {/* Comments List */}
                    {uiCommentUpdate.length > 0 && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {uiCommentUpdate.map((comment) => (
                          <CommentList
                            key={comment._id}
                            name={(comment.postedBy && comment.postedBy.name) || comment.postedBy || 'User'}
                            text={comment.text}
                            createdAt={comment.createdAt}
                            avatar={(comment.postedBy && comment.postedBy.avatar && comment.postedBy.avatar.url) || ''}
                          />
                        ))}
                      </Box>
                    )}

                    {uiCommentUpdate.length === 0 && (
                      <Box sx={{ 
                        textAlign: 'center', 
                        py: 6,
                        color: 'text.secondary'
                      }}>
                        <CommentIcon sx={{ fontSize: 48, opacity: 0.3, mb: 2 }} />
                        <Typography variant="body1">
                          No comments yet. Be the first to share your thoughts!
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Box>

              {/* Sidebar - Optional */}
              <Box sx={{ 
                width: { xs: '100%', md: 300 },
                display: { xs: 'none', md: 'block' }
              }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'white',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    position: 'sticky',
                    top: 100,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                    📊 Post Stats
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Chip
                      icon={<CommentIcon />}
                      label={`${uiCommentUpdate.length} Comments`}
                      sx={{ 
                        justifyContent: 'flex-start',
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                        color: '#667eea',
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      icon={<AccessTimeIcon />}
                      label={moment(createdAt).fromNow()}
                      sx={{ 
                        justifyContent: 'flex-start',
                        bgcolor: 'rgba(0, 0, 0, 0.05)',
                      }}
                    />
                  </Box>
                </Paper>
              </Box>
            </Box>
          )}
        </Container>
        
        <Footer />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700,
          fontSize: '1.5rem',
          pb: 1,
        }}>
          🗑️ Delete Post?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '1rem', color: 'text.primary' }}>
            Are you sure you want to delete this post in "<strong>{category}</strong>" category? This action cannot be undone and you'll be redirected to the home page.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button 
            onClick={handleDeleteCancel}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(244, 67, 54, 0.4)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(244, 67, 54, 0.5)',
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SinglePost;
