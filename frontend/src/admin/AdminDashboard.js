import React, { useEffect, useState } from "react";
import { 
  Box, 
  Paper, 
  Typography, 
  Grid,
  Card,
  CardContent,
  LinearProgress
} from "@mui/material";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ArticleIcon from "@mui/icons-material/Article";
import PeopleIcon from "@mui/icons-material/People";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import MailIcon from "@mui/icons-material/Mail";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CategoryIcon from "@mui/icons-material/Category";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/posts/admin/dashboard-stats", {
          withCredentials: true
        });
        setStats(data.data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !stats) {
    return (
      <Box sx={{ p: 4 }}>
        <DashboardSkeleton />
      </Box>
    );
  }

  const { overview, categoryStats, topPosts, topUsers } = stats;
  const totalPosts = overview.totalPosts;
  const topCategories = categoryStats;

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <DashboardSkeleton />
      </Box>
    );
  }

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
          📊 Dashboard
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Comprehensive insights into your blog performance
        </Typography>
      </Box>

      {/* Main Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              transform: 'translateY(-4px)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Total Posts
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#667eea', mt: 1 }}>
                    {overview.totalPosts}
                  </Typography>
                </Box>
                <Box sx={{ 
                  bgcolor: 'rgba(102, 126, 234, 0.1)', 
                  borderRadius: 2, 
                  p: 1.5,
                  display: 'flex'
                }}>
                  <ArticleIcon sx={{ fontSize: 32, color: '#667eea' }} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {overview.postsGrowth > 0 ? <TrendingUpIcon sx={{ fontSize: 16, color: '#4caf50' }} /> : <TrendingDownIcon sx={{ fontSize: 16, color: '#f44336' }} />}
                <Typography variant="caption" sx={{ color: overview.postsGrowth > 0 ? '#4caf50' : '#f44336', fontWeight: 600 }}>
                  {overview.postsGrowth}% this month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid rgba(33, 150, 243, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              transform: 'translateY(-4px)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Total Users
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#2196f3', mt: 1 }}>
                    {overview.totalUsers}
                  </Typography>
                </Box>
                <Box sx={{ 
                  bgcolor: 'rgba(33, 150, 243, 0.1)', 
                  borderRadius: 2, 
                  p: 1.5,
                  display: 'flex'
                }}>
                  <PeopleIcon sx={{ fontSize: 32, color: '#2196f3' }} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {overview.usersGrowth > 0 ? <TrendingUpIcon sx={{ fontSize: 16, color: '#4caf50' }} /> : <TrendingDownIcon sx={{ fontSize: 16, color: '#f44336' }} />}
                <Typography variant="caption" sx={{ color: overview.usersGrowth > 0 ? '#4caf50' : '#f44336', fontWeight: 600 }}>
                  {overview.usersGrowth}% this month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255, 152, 0, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              transform: 'translateY(-4px)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Contact Messages
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#ff9800', mt: 1 }}>
                    {overview.totalContacts}
                  </Typography>
                </Box>
                <Box sx={{ 
                  bgcolor: 'rgba(255, 152, 0, 0.1)', 
                  borderRadius: 2, 
                  p: 1.5,
                  display: 'flex'
                }}>
                  <MailIcon sx={{ fontSize: 32, color: '#ff9800' }} />
                </Box>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {overview.pendingContacts} pending replies
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid rgba(244, 67, 54, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              transform: 'translateY(-4px)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Total Likes
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#f44336', mt: 1 }}>
                    {overview.totalLikes}
                  </Typography>
                </Box>
                <Box sx={{ 
                  bgcolor: 'rgba(244, 67, 54, 0.1)', 
                  borderRadius: 2, 
                  p: 1.5,
                  display: 'flex'
                }}>
                  <FavoriteIcon sx={{ fontSize: 32, color: '#f44336' }} />
                </Box>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Avg {(overview.totalLikes / overview.totalPosts || 0).toFixed(1)} per post
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid rgba(76, 175, 80, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              transform: 'translateY(-4px)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Total Comments
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#4caf50', mt: 1 }}>
                    {overview.totalComments}
                  </Typography>
                </Box>
                <Box sx={{ 
                  bgcolor: 'rgba(76, 175, 80, 0.1)', 
                  borderRadius: 2, 
                  p: 1.5,
                  display: 'flex'
                }}>
                  <CommentIcon sx={{ fontSize: 32, color: '#4caf50' }} />
                </Box>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Avg {(overview.totalComments / overview.totalPosts || 0).toFixed(1)} per post
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Secondary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ borderRadius: 3, p: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <CategoryIcon sx={{ color: '#667eea' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Top Categories
              </Typography>
            </Box>
            {topCategories.map((cat, index) => (
              <Box key={cat.category} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {index + 1}. {cat.category}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {cat.count} posts
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(cat.count / overview.totalPosts) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 3,
                    }
                  }}
                />
                <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    ❤️ {cat.likes} likes
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    💬 {cat.comments} comments
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ borderRadius: 3, p: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <VisibilityIcon sx={{ color: '#667eea' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Top Performing Posts
              </Typography>
            </Box>
            {topPosts.map((post, index) => {
              // Extract plain text from HTML content and limit to 60 characters
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = post.content || '';
              const plainText = tempDiv.textContent || tempDiv.innerText || 'No content';
              const displayTitle = plainText.length > 60 
                ? plainText.substring(0, 60) + '...' 
                : plainText;
              
              return (
                <Box 
                  key={post._id} 
                  sx={{ 
                    mb: 2, 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: '#fafafa',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    {index + 1}. {displayTitle}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      ❤️ {post.likes.length}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      💬 {post.comments.length}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      👤 {post.postedBy?.name}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Paper>
        </Grid>
      </Grid>

      {/* Most Active Users */}
      <Paper sx={{ borderRadius: 3, p: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <PeopleIcon sx={{ color: '#667eea' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Most Active Contributors
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {topUsers.map((user, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={user._id}>
              <Card sx={{ 
                borderRadius: 2, 
                textAlign: 'center',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                  transform: 'translateY(-4px)'
                }
              }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#667eea', mb: 0.5 }}>
                    #{index + 1}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    {user.name}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
                    {user.count}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                    posts
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      ❤️ {user.likes}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      💬 {user.comments}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
