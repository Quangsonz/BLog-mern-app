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
  Tooltip
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const PostCard = ({
  id,
  title,
  subheader,
  image,
  content,
  comments,
  likes,
  showPosts,
  likesId,
}) => {
  const { userInfo } = useSelector((state) => state.signIn);

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
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 3,
      background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        transform: 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform 0.4s ease',
      },
      '&:hover': {
        transform: 'translateY(-12px)',
        boxShadow: '0 12px 40px rgba(102, 126, 234, 0.25)',
        '&::before': {
          transform: 'scaleX(1)',
        }
      }
    }}>
      <CardHeader
        avatar={
          <Avatar 
            sx={{ 
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              fontSize: '1.2rem',
              fontWeight: 700,
            }} 
            aria-label="author"
          >
            {title[0]?.toUpperCase() || 'B'}
          </Avatar>
        }
        title={
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>
        }
        subheader={
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mt: 0.5,
            }}
          >
            {subheader}
          </Typography>
        }
        sx={{ pb: 1 }}
      />
      <Link 
        to={`/post/${id}`}
        style={{ 
          textDecoration: 'none',
          display: 'block',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Box sx={{ 
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover::after': {
            opacity: 1,
          }
        }}>
          <CardMedia
            component="img"
            height="220"
            image={image}
            alt={title}
            sx={{
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'scale(1.08)',
              }
            }}
          />
          <Tooltip title="Click to read more" arrow>
            <Box sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                bgcolor: 'white',
              }
            }}>
              <VisibilityIcon sx={{ color: '#667eea', fontSize: 20 }} />
            </Box>
          </Tooltip>
        </Box>
      </Link>
      <CardContent sx={{ flexGrow: 1, py: 2 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            lineHeight: 1.8,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            fontWeight: 400,
            letterSpacing: '0.02em',
            mb: 2,
          }}
        >
          {content?.replace(regex, "")?.substring(0, 150) + "..."}
        </Typography>
      </CardContent>
      
      <CardActions sx={{ 
        px: 2, 
        pb: 2, 
        pt: 0,
        mt: 'auto',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
        bgcolor: 'rgba(102, 126, 234, 0.02)',
      }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* Like Button */}
          <Tooltip title={likesId.includes(userInfo && userInfo.id) ? "Unlike" : "Like"} arrow>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {likesId.includes(userInfo && userInfo.id) ? (
                <IconButton 
                  onClick={removeLike} 
                  aria-label="unlike post"
                  size="small"
                  sx={{
                    color: '#ff1744',
                    bgcolor: 'rgba(255, 23, 68, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255, 23, 68, 0.15)',
                      transform: 'scale(1.15)',
                    },
                    '&:active': {
                      transform: 'scale(0.95)',
                    }
                  }}
                >
                  <FavoriteIcon sx={{ 
                    fontSize: 20,
                    filter: 'drop-shadow(0 2px 4px rgba(255,23,68,0.3))',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.1)' },
                    }
                  }} />
                </IconButton>
              ) : (
                <IconButton 
                  onClick={addLike} 
                  aria-label="like post"
                  size="small"
                  sx={{
                    color: '#757575',
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255, 23, 68, 0.1)',
                      color: '#ff1744',
                      transform: 'scale(1.15)',
                    },
                    '&:active': {
                      transform: 'scale(0.95)',
                    }
                  }}
                >
                  <FavoriteBorderIcon sx={{ fontSize: 20 }} />
                </IconButton>
              )}
              <Chip 
                label={likes}
                size="small"
                sx={{ 
                  ml: 1,
                  height: 24,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  bgcolor: likesId.includes(userInfo && userInfo.id) 
                    ? 'rgba(255, 23, 68, 0.1)' 
                    : 'rgba(0, 0, 0, 0.06)',
                  color: likesId.includes(userInfo && userInfo.id) 
                    ? '#ff1744' 
                    : 'text.secondary',
                  border: 'none',
                  transition: 'all 0.3s ease',
                }}
              />
            </Box>
          </Tooltip>

          {/* Divider */}
          <Box sx={{ 
            width: 1, 
            height: 24, 
            bgcolor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: 1,
          }} />

          {/* Comment Button */}
          <Tooltip title="View comments" arrow>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                component={Link}
                to={`/post/${id}`}
                aria-label="view comments"
                size="small"
                sx={{
                  color: '#667eea',
                  bgcolor: 'rgba(102, 126, 234, 0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(102, 126, 234, 0.15)',
                    transform: 'scale(1.15)',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  }
                }}
              >
                <CommentIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <Chip 
                label={comments}
                size="small"
                sx={{ 
                  ml: 1,
                  height: 24,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  border: 'none',
                }}
              />
            </Box>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
};

export default PostCard;
