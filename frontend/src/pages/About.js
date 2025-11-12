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
      title: "Share Ideas",
      description: "Express your thoughts and share knowledge with our growing community of writers and readers.",
      color: "#667eea"
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      title: "Connect People",
      description: "Build connections with like-minded individuals who share your interests and passions.",
      color: "#764ba2"
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 40 }} />,
      title: "Engage Content",
      description: "Like, comment, and interact with posts that inspire you. Your voice matters here.",
      color: "#f44336"
    }
  ];

  const stats = [
    { label: "Active Users", value: "1,000+", color: "#667eea" },
    { label: "Blog Posts", value: "5,000+", color: "#764ba2" },
    { label: "Comments", value: "10,000+", color: "#4caf50" },
    { label: "Categories", value: "50+", color: "#ff9800" }
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
              About Our Blog
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
              A platform where ideas come to life, stories are shared, and communities thrive.
            </Typography>
          </Box>

          {/* Mission Section */}
          <Paper elevation={0} sx={{ p: 5, mb: 6, borderRadius: 3, bgcolor: 'white' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
              Our Mission
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary', textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
              We believe in the power of words to inspire, educate, and connect people. Our platform 
              provides a space where anyone can share their stories, expertise, and perspectives with 
              a global audience. Whether you're a seasoned writer or just starting out, you'll find 
              a welcoming community ready to engage with your content.
            </Typography>
          </Paper>

          {/* Features Grid */}
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
            What We Offer
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
              Our Community
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
              Our Vision
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary', textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
              We envision a world where everyone has a voice and the opportunity to share their unique 
              perspective. Through our platform, we're building a diverse, inclusive community that 
              celebrates creativity, fosters meaningful dialogue, and empowers individuals to make 
              an impact through their words.
            </Typography>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default About;
