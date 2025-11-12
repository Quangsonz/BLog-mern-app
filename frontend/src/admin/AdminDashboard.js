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
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, usersRes, contactsRes] = await Promise.all([
          axios.get("/api/posts/show"),
          axios.get("/api/users", { withCredentials: true }),
          axios.get("/api/contacts", { withCredentials: true })
        ]);
        setPosts(postsRes.data.posts || []);
        setUsers(usersRes.data.users || []);
        setContacts(contactsRes.data.contacts || []);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate statistics
  const totalPosts = posts.length;
  const totalUsers = users.length;
  const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);
  const totalContacts = contacts.length;
  const pendingContacts = contacts.filter(c => c.status === 'pending').length;
  const avgEngagement = totalPosts ? ((totalLikes + totalComments) / totalPosts).toFixed(1) : 0;

  // Posts in last 30 days
  const postsLast30Days = posts.filter(post => 
    moment().diff(moment(post.createdAt), 'days') <= 30
  ).length;
  const postsGrowth = totalPosts > 0 ? ((postsLast30Days / totalPosts) * 100).toFixed(1) : 0;

  // New users in last 30 days
  const usersLast30Days = users.filter(user => 
    moment().diff(moment(user.createdAt), 'days') <= 30
  ).length;
  const usersGrowth = totalUsers > 0 ? ((usersLast30Days / totalUsers) * 100).toFixed(1) : 0;

  // Category statistics
  const categoryStats = posts.reduce((acc, post) => {
    const cat = post.category || 'Other';
    if (!acc[cat]) {
      acc[cat] = { count: 0, likes: 0, comments: 0 };
    }
    acc[cat].count++;
    acc[cat].likes += post.likes.length;
    acc[cat].comments += post.comments.length;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryStats)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  // Top performing posts
  const topPosts = [...posts]
    .sort((a, b) => (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length))
    .slice(0, 5);

  // Most active users
  const userPostCounts = posts.reduce((acc, post) => {
    const userId = post.postedBy?._id;
    const userName = post.postedBy?.name;
    if (userId) {
      if (!acc[userId]) {
        acc[userId] = { name: userName, count: 0, likes: 0, comments: 0 };
      }
      acc[userId].count++;
      acc[userId].likes += post.likes.length;
      acc[userId].comments += post.comments.length;
    }
    return acc;
  }, {});

  const topUsers = Object.entries(userPostCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2, textAlign: 'center' }}>Loading statistics...</Typography>
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
                    {totalPosts}
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
                {postsGrowth > 0 ? <TrendingUpIcon sx={{ fontSize: 16, color: '#4caf50' }} /> : <TrendingDownIcon sx={{ fontSize: 16, color: '#f44336' }} />}
                <Typography variant="caption" sx={{ color: postsGrowth > 0 ? '#4caf50' : '#f44336', fontWeight: 600 }}>
                  {postsGrowth}% this month
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
                    {totalUsers}
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
                {usersGrowth > 0 ? <TrendingUpIcon sx={{ fontSize: 16, color: '#4caf50' }} /> : <TrendingDownIcon sx={{ fontSize: 16, color: '#f44336' }} />}
                <Typography variant="caption" sx={{ color: usersGrowth > 0 ? '#4caf50' : '#f44336', fontWeight: 600 }}>
                  {usersGrowth}% this month
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
                    {totalContacts}
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
                {pendingContacts} pending replies
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
                    {totalLikes}
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
                Avg {(totalLikes / totalPosts || 0).toFixed(1)} per post
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
                    {totalComments}
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
                Avg {(totalComments / totalPosts || 0).toFixed(1)} per post
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
            {topCategories.map(([category, stats], index) => (
              <Box key={category} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {index + 1}. {category}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {stats.count} posts
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.count / totalPosts) * 100}
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
                    ❤️ {stats.likes} likes
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    💬 {stats.comments} comments
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
            {topPosts.map((post, index) => (
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
                  {index + 1}. {post.title || 'Untitled'}
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
            ))}
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
          {topUsers.map(([userId, stats], index) => (
            <Grid item xs={12} sm={6} md={2.4} key={userId}>
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
                    {stats.name}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
                    {stats.count}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                    posts
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      ❤️ {stats.likes}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      💬 {stats.comments}
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
