import React from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper
} from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InfoIcon from "@mui/icons-material/Info";
import GroupIcon from "@mui/icons-material/Group";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import FavoriteIcon from "@mui/icons-material/Favorite";

const About = () => {
  const features = [
    {
      icon: <EmojiObjectsIcon sx={{ fontSize: 40 }} />,
      title: "Advanced Search",
      description: "Smart search with fuzzy matching, relevance scoring, and multiple sorting options. Uses MongoDB Aggregation Pipeline for processing and speed optimization.",
      color: "#667eea"
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      title: "Real-time Notifications",
      description: "Receive instant notifications when someone likes or comments on your posts. Uses Socket.io for immediate updates without page reload.",
      color: "#764ba2"
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 40 }} />,
      title: "Admin Dashboard",
      description: "Manage posts, users, and comprehensive statistics with modern Material-UI interface. Pagination and optimized data display for fast performance.",
      color: "#f44336"
    }
  ];

  const stats = [
    { label: "Backend Technology", value: "MERN Stack", color: "#667eea" },
    { label: "Database", value: "MongoDB", color: "#764ba2" },
    { label: "Real-time", value: "Socket.io", color: "#4caf50" },
    { label: "UI Framework", value: "Material-UI", color: "#ff9800" }
  ];

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 8 }}>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box sx={{ 
            mb: 8,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 4,
            p: 6,
            color: 'white',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
          }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              mx: 'auto', 
              mb: 3,
              bgcolor: 'white',
              color: '#667eea'
            }}>
              <InfoIcon sx={{ fontSize: 50 }} />
            </Avatar>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              About MERN Stack Blog Project
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
              A comprehensive full-stack blog application built with React, Material-UI, Node.js, Express, and MongoDB. Features real-time notifications, advanced search, and modern admin dashboard.
            </Typography>
          </Box>

          {/* Mission Section */}
          <Paper elevation={0} sx={{ p: 5, mb: 6, borderRadius: 3, bgcolor: 'white' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
              About The Project
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary', textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
              This is a full-stack blog application built with the MERN Stack (MongoDB, Express, React, Node.js). 
              The project integrates modern features such as JWT authentication, real-time notifications with Socket.io, 
              advanced search using MongoDB Aggregation Pipeline, image upload with Cloudinary, 
              and comprehensive admin interface with Material-UI. The system is optimized for performance with 
              server-side pagination, debounce search, and direct data processing in the database.
            </Typography>
          </Paper>

          {/* Features Grid */}
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
            Key Features
          </Typography>
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  border: `2px solid ${feature.color}20`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 24px ${feature.color}30`
                  }
                }}>
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{ 
                      width: 80, 
                      height: 80, 
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: `${feature.color}15`,
                      color: feature.color,
                      mx: 'auto',
                      mb: 3
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Stats Section */}
          <Paper elevation={0} sx={{ 
            p: 5, 
            mb: 6, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
              Technology Stack
            </Typography>
            <Grid container spacing={4}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 800, 
                        color: stat.color,
                        mb: 1
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Vision Section */}
          <Paper elevation={0} sx={{ p: 5, borderRadius: 3, bgcolor: 'white' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
              Technical Features
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary', textAlign: 'center', maxWidth: 800, mx: 'auto', mb: 3 }}>
              • <strong>Authentication & Authorization:</strong> JWT authentication, HTTP-only cookies, Admin/User role-based access<br/>
              • <strong>Real-time Notifications:</strong> Socket.io for instant updates on likes, comments, and notifications<br/>
              • <strong>Smart Search:</strong> MongoDB Aggregation Pipeline with relevance scoring and fuzzy matching<br/>
              • <strong>Performance Optimization:</strong> Server-side pagination, debounce search, lazy loading<br/>
              • <strong>Image Management:</strong> Cloudinary integration for upload and image optimization<br/>
              • <strong>Security:</strong> Helmet, rate limiting, XSS protection, MongoDB injection prevention<br/>
              • <strong>Modern UI/UX:</strong> Material-UI, responsive design, gradient themes, smooth animations
            </Typography>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default About;
