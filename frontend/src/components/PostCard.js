import { 
  Card, 
  CardHeader, 
  CardMedia, 
  CardContent, 
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useState } from "react";

const PostCard = ({
  id,
  title,
  category,
  subheader,
  image,
  content,
  comments,
  likes,
  showPosts,
  likesId,
  postedBy,
  postedByName,
  postedByAvatar,
}) => {
  const { userInfo } = useSelector((state) => state.signIn);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const openMenu = Boolean(anchorEl);

  // Handle likesId: if not provided, extract from likes array
  const actualLikesId = likesId || (Array.isArray(likes) ? likes.map(like => 
    typeof like === 'string' ? like : like._id || like.id
  ) : []);

  // Convert likes and comments to numbers if they are arrays
  const likesCount = Array.isArray(likes) ? likes.length : (likes || 0);
  const commentsCount = Array.isArray(comments) ? comments.length : (comments || 0);

  const handleMenuClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    // Admins go to admin edit, owners go to user edit page
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
        // Only call showPosts if it exists (for SearchResults compatibility)
        if (showPosts && typeof showPosts === 'function') {
          showPosts();
        } else {
          // Refresh the page or navigate away
          window.location.reload();
        }
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
  const isOwner = userInfo && postedBy && (
    userInfo.id === postedBy || 
    userInfo.id === postedBy?._id ||
    userInfo.id === postedBy?.id
  );

  //add like
  const addLike = async () => {
    try {
      // eslint-disable-next-line
      const { data } = await axios.put(`/api/addlike/post/${id}`);
      // console.log("likes", data.post);
      // if (data.success == true) {
      //     showPosts();
      // }
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  };

  //remove like
  const removeLike = async () => {
    try {
      // eslint-disable-next-line
      const { data } = await axios.put(`/api/removelike/post/${id}`);
      // console.log("remove likes", data.post);
      // if (data.success == true) {
      //     showPosts();
      // }
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  };

  // remove html tags
  const regex = /(<([^>]+)>)/gi;

  return (
    <Card sx={{ 
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 2,
      bgcolor: 'white',
      boxShadow: 'none',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
      overflow: 'hidden',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }
    }}>
      {/* Header - Avatar, Username, Time, Menu */}
      <CardHeader
        avatar={
          <Avatar 
            src={postedByAvatar}
            sx={{ 
              width: 40,
              height: 40,
              background: postedByAvatar ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontSize: '1rem',
              fontWeight: 700,
              border: '2px solid white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            }} 
            aria-label="author"
          >
            {!postedByAvatar && (postedByName?.[0]?.toUpperCase() || 'U')}
          </Avatar>
        }
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 700,
                fontSize: '0.95rem',
                color: 'text.primary',
              }}
            >
              {postedByName || 'Anonymous'}
            </Typography>
            {category && (
              <Chip 
                label={category}
                size="small"
                sx={{ 
                  fontSize: '0.7rem',
                  height: 22,
                  fontWeight: 600,
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                }}
              />
            )}
          </Box>
        }
        subheader={
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.75rem',
            }}
          >
            {subheader}
          </Typography>
        }
        action={
          isOwner && (
            <>
              <IconButton
                aria-label="settings"
                onClick={handleMenuClick}
                size="small"
                sx={{
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                <MoreVertIcon fontSize="small" />
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
                    mt: 0.5,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    minWidth: 150,
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
                <MenuItem onClick={handleEdit} sx={{ py: 1, fontSize: '0.9rem' }}>
                  <ListItemIcon>
                    <EditIcon fontSize="small" sx={{ color: '#667eea' }} />
                  </ListItemIcon>
                  <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDeleteClick} sx={{ py: 1, fontSize: '0.9rem' }}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" sx={{ color: '#f44336' }} />
                  </ListItemIcon>
                  <ListItemText sx={{ color: '#f44336' }}>Delete</ListItemText>
                </MenuItem>
              </Menu>
            </>
          )
        }
        sx={{ px: 2, py: 1.5 }}
      />

      {/* Caption/Content - BEFORE Image */}
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Typography
          variant="body2"
          component="div"
          sx={{
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'text.primary',
            fontWeight: 400,
            '& p': { margin: 0, marginBottom: 1 },
            '& br': { display: 'block', content: '""', marginTop: '0.5em' },
            '& ul, & ol': { paddingLeft: 3, marginBottom: 1 },
            '& li': { marginBottom: 0.5 },
          }}
          dangerouslySetInnerHTML={{
            __html: isExpanded 
              ? content 
              : (content?.length > 150 ? content.substring(0, 150) + '...' : content)
          }}
        />
        {content?.length > 150 && (
          <Box 
            component="span"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            sx={{ 
              color: '#667eea',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-block',
              mt: 0.5,
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </Box>
        )}
      </Box>

      {/* Image - Maintain original aspect ratio */}
      {image && (
        <Link 
          to={`/post/${id}`}
          style={{ 
            textDecoration: 'none',
            display: 'block',
          }}
        >
          <Box sx={{ 
            px: 2,
            pb: 1.5,
          }}>
            <CardMedia
              component="img"
              image={image}
              alt={category || 'Post image'}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: 500,
                objectFit: 'contain',
                borderRadius: 2,
                bgcolor: '#f5f5f5',
              }}
            />
          </Box>
        </Link>
      )}

      {/* Actions - Like, Comment */}
      <CardActions sx={{ 
        px: 2,
        py: 1.5,
        display: 'flex',
        gap: 1,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Like Button - Instagram style */}
          {actualLikesId.includes(userInfo && userInfo.id) ? (
            <IconButton 
              onClick={removeLike} 
              aria-label="unlike post"
              size="medium"
              sx={{
                p: 0,
                color: '#ed4956',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
                '&:active': {
                  transform: 'scale(0.9)',
                }
              }}
            >
              <FavoriteIcon sx={{ fontSize: 28 }} />
            </IconButton>
          ) : (
            <IconButton 
              onClick={addLike} 
              aria-label="like post"
              size="medium"
              sx={{
                p: 0,
                color: 'text.primary',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'text.secondary',
                  transform: 'scale(1.1)',
                },
                '&:active': {
                  transform: 'scale(0.9)',
                }
              }}
            >
              <FavoriteBorderIcon sx={{ fontSize: 28 }} />
            </IconButton>
          )}

          {/* Comment Button */}
          <IconButton 
            component={Link}
            to={`/post/${id}`}
            aria-label="view comments"
            size="medium"
            sx={{
              p: 0,
              color: 'text.primary',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: 'text.secondary',
                transform: 'scale(1.1)',
              },
              '&:active': {
                transform: 'scale(0.9)',
              }
            }}
          >
            <CommentIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Box>
      </CardActions>

      {/* Likes Count - AFTER Actions */}
      <Box sx={{ px: 2, pb: 0.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
          {likesCount} {likesCount === 1 ? 'like' : 'likes'}
        </Typography>
      </Box>

      {/* View Comments - AFTER Likes */}
      {commentsCount > 0 && (
        <Box sx={{ px: 2, pb: 1.5 }}>
          <Typography 
            component={Link}
            to={`/post/${id}`}
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.95rem',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            View all {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
          </Typography>
        </Box>
      )}

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
            Are you sure you want to delete "<strong>{title}</strong>"? This action cannot be undone.
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
    </Card>
  );
};

export default PostCard;
