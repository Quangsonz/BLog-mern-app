import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  IconButton,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import { userProfileAction } from '../redux/actions/userAction';

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.signIn);
  const { user } = useSelector((state) => state.userProfile);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      // Load user profile from API to get latest data including avatar
      dispatch(userProfileAction());
    }
  }, [userInfo, navigate, dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setAvatarPreview(user.avatar?.url || null);
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        uploadAvatar(reader.result);
      };
    }
  };

  const uploadAvatar = async (avatarData) => {
    setUploadingAvatar(true);
    try {
      const { data } = await axios.put('/api/update/avatar', 
        { avatar: avatarData },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success('Avatar updated successfully!');
        // Reload user profile to get updated avatar
        dispatch(userProfileAction());
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.error || 'Failed to upload avatar');
      setAvatarPreview(user?.avatar?.url || null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Cancel edit - reset form
      setFormData({
        name: userInfo.name || '',
        email: userInfo.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
    setEditMode(!editMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password fields if user wants to change password
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        toast.error('Please enter your current password');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }
      if (formData.newPassword.length < 8) {
        toast.error('Password must be at least 8 characters');
        return;
      }
    }

    setLoading(true);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      // Add password fields only if user wants to change password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const { data } = await axios.put('/api/user/update', updateData, {
        withCredentials: true,
      });

      if (data.success) {
        toast.success('Profile updated successfully!');
        setEditMode(false);
        // Clear password fields
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        // Optionally reload to update userInfo in redux
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) {
    return null;
  }

  // Show loading while fetching user profile
  if (!user) {
    return (
      <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh' }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
          <CircularProgress size={60} sx={{ color: '#667eea' }} />
        </Container>
        <Footer />
      </Box>
    );
  }

  const currentUser = user || userInfo;

  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Left Column - Profile Card */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                textAlign: 'center',
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                position: 'sticky',
                top: 100,
              }}
            >
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={avatarPreview}
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: '3rem',
                    fontWeight: 700,
                    background: avatarPreview ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                    border: '4px solid white',
                  }}
                >
                  {!avatarPreview && currentUser.name?.[0]?.toUpperCase()}
                </Avatar>
                
                {/* Upload Avatar Button */}
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleAvatarChange}
                  disabled={uploadingAvatar}
                />
                <label htmlFor="avatar-upload">
                  <IconButton
                    component="span"
                    disabled={uploadingAvatar}
                    sx={{
                      position: 'absolute',
                      bottom: -5,
                      right: -5,
                      bgcolor: '#667eea',
                      color: 'white',
                      width: 40,
                      height: 40,
                      border: '3px solid white',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                      '&:hover': {
                        bgcolor: '#5568d3',
                      },
                      '&:disabled': {
                        bgcolor: '#ccc',
                      }
                    }}
                  >
                    {uploadingAvatar ? (
                      <CircularProgress size={20} sx={{ color: 'white' }} />
                    ) : (
                      <PhotoCameraIcon sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                </label>

                {currentUser.role === 'admin' && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bgcolor: '#ff9800',
                      borderRadius: '50%',
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid white',
                    }}
                  >
                    <AdminPanelSettingsIcon sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                )}
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {currentUser.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {currentUser.email}
              </Typography>

              {currentUser.role === 'admin' ? (
                <Chip
                  icon={<AdminPanelSettingsIcon />}
                  label="Administrator"
                  sx={{
                    background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                    color: 'white',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(255, 152, 0, 0.4)',
                  }}
                />
              ) : (
                <Chip
                  icon={<PersonIcon />}
                  label="User"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                  }}
                />
              )}

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: 'left' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CalendarTodayIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Member since
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {moment(currentUser.createdAt).format('MMMM YYYY')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Edit Form */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Profile Information
                </Typography>
                {!editMode && (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleEditToggle}
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                      }
                    }}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>

              <Divider sx={{ mb: 3 }} />

              {editMode ? (
                <Box component="form" onSubmit={handleSubmit}>
                  <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                    💡 Leave password fields empty if you don't want to change your password
                  </Alert>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: 'white',
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled
                        helperText="Email cannot be changed for security reasons"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: '#f5f5f5',
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }}>
                        <Chip label="Change Password (Optional)" />
                      </Divider>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Enter current password to change"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: 'white',
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Min. 8 characters"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: 'white',
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter new password"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: 'white',
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={handleEditToggle}
                          disabled={loading}
                          sx={{
                            px: 3,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            borderColor: '#d32f2f',
                            color: '#d32f2f',
                            '&:hover': {
                              borderColor: '#d32f2f',
                              bgcolor: 'rgba(211, 47, 47, 0.08)',
                            }
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={<SaveIcon />}
                          disabled={loading}
                          sx={{
                            px: 3,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
                              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                            }
                          }}
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <PersonIcon sx={{ color: '#667eea' }} />
                          <Typography variant="caption" color="text.secondary">
                            Full Name
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {userInfo.name}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <EmailIcon sx={{ color: '#667eea' }} />
                          <Typography variant="caption" color="text.secondary">
                            Email Address
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {userInfo.email}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Alert severity="success" sx={{ borderRadius: 2 }}>
                      ✅ Your profile is up to date. Click "Edit Profile" to make changes.
                    </Alert>
                  </Grid>
                </Grid>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default Profile;
