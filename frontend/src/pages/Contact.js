import React, { useState } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Paper,
  Avatar,
  Alert
} from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-toastify";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 40 }} />,
      title: "Email Us",
      value: "contact@blogplatform.com",
      color: "#667eea"
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40 }} />,
      title: "Call Us",
      value: "+1 (555) 123-4567",
      color: "#764ba2"
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 40 }} />,
      title: "Visit Us",
      value: "123 Blog Street, Web City, 10001",
      color: "#4caf50"
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/api/contact/create', formData);
      
      toast.success(data.message);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              Get In Touch
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
              Have a question or feedback? We'd love to hear from you!
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Contact Information */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  Contact Information
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
                  Fill out the form and our team will get back to you within 24 hours.
                </Typography>
              </Box>

              {contactInfo.map((info, index) => (
                <Card key={index} sx={{ 
                  mb: 3,
                  borderRadius: 3,
                  border: `2px solid ${info.color}20`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateX(8px)',
                    boxShadow: `0 8px 16px ${info.color}30`
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        width: 60, 
                        height: 60, 
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: `${info.color}15`,
                        color: info.color
                      }}>
                        {info.icon}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          {info.title}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {info.value}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}

              {/* Office Hours */}
              <Paper elevation={0} sx={{ 
                p: 3, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Office Hours
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Monday - Friday: 9:00 AM - 6:00 PM
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Saturday: 10:00 AM - 4:00 PM
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Sunday: Closed
                </Typography>
              </Paper>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12} md={8}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  Send us a Message
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Your Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={6}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        endIcon={<SendIcon />}
                        disabled={loading}
                        sx={{
                          textTransform: 'none',
                          borderRadius: 2,
                          px: 4,
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 600,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
                            boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
                          },
                          '&:disabled': {
                            background: '#ccc'
                          }
                        }}
                      >
                        {loading ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>

                {/* Info Alert */}
                <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                  We typically respond within 24 hours. For urgent matters, please call us directly.
                </Alert>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Contact;
