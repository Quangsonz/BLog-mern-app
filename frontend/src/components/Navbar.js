import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import HouseIcon from "@mui/icons-material/House";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { userLogoutAction, userProfileAction } from "../redux/actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import SmartSearch from "./SmartSearch";
import NotificationMenu from "./NotificationMenu";
import { notificationsLoadAction, addNewNotification } from "../redux/actions/notificationActions";
import io from 'socket.io-client';

const navLinks = [
  { title: "Home", path: "/", icon: <HouseIcon fontSize="small" /> },
  { title: "About", path: "/about", icon: <InfoIcon fontSize="small" /> },
  { title: "Contact", path: "/contact", icon: <ContactMailIcon fontSize="small" /> },
  { title: "Privacy Policy", path: "/privacy", icon: <PrivacyTipIcon fontSize="small" /> },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.signIn);
  const { user } = useSelector((state) => state.userProfile);

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  // Load notifications and user profile when logged in
  useEffect(() => {
    if (userInfo) {
      dispatch(notificationsLoadAction());
      dispatch(userProfileAction());
      
      // Setup socket connection for real-time notifications
      const socket = io('http://localhost:9000');
      
      // Join user's notification room
      socket.emit('join-user', userInfo._id);
      
      // Listen for new notifications
      socket.on('new-notification', (notification) => {
        dispatch(addNewNotification(notification));
      });
      
      return () => {
        socket.disconnect();
      };
    }
  }, [dispatch, userInfo]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // log out user
  const logOutUser = () => {
    dispatch(userLogoutAction());
    window.location.reload(true);
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.08)',
        borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        {/* principal Menu */}
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Logo - Desktop */}
          <Box 
            component={Link}
            to="/"
            sx={{ 
              display: { xs: "none", md: "flex" }, 
              alignItems: 'center',
              textDecoration: 'none',
              mr: 4,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5,
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              }}
            >
              <HouseIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 800,
                letterSpacing: ".15rem",
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '1.5rem',
              }}
            >
              D2S
            </Typography>
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{
                color: '#667eea',
                '&:hover': {
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  mt: 1,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                }
              }}
            >
              {navLinks.map((link) => (
                <MenuItem 
                  key={link.title} 
                  onClick={handleCloseNavMenu}
                  component={Link}
                  to={link.path}
                  sx={{
                    py: 1.5,
                    px: 3,
                    '&:hover': {
                      bgcolor: 'rgba(102, 126, 234, 0.08)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ color: '#667eea', display: 'flex' }}>
                      {link.icon}
                    </Box>
                    <Typography>{link.title}</Typography>
                  </Box>
                </MenuItem>
              ))}
              {!userInfo && (
                <MenuItem 
                  onClick={handleCloseNavMenu}
                  component={Link}
                  to="/register"
                  sx={{
                    py: 1.5,
                    px: 3,
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(102, 126, 234, 0.2)',
                    }
                  }}
                >
                  <Typography sx={{ fontWeight: 600, color: '#667eea' }}>
                    Register
                  </Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>

          {/* Logo - Mobile */}
          <Box 
            component={Link}
            to="/"
            sx={{ 
              display: { xs: "flex", md: "none" }, 
              alignItems: 'center',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1,
              }}
            >
              <HouseIcon sx={{ color: 'white', fontSize: '1.25rem' }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 800,
                letterSpacing: ".15rem",
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '1.25rem',
              }}
            >
              BLOG
            </Typography>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 1 }}>
            {navLinks.map((link) => (
              <Button
                key={link.title}
                component={Link}
                to={link.path}
                startIcon={link.icon}
                sx={{
                  color: '#1a237e',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                {link.title}
              </Button>
            ))}
          </Box>

          {/* Smart Search - Desktop */}
          <Box sx={{ flexGrow: 0.5, display: { xs: "none", md: "flex" }, mx: 3 }}>
            <SmartSearch />
          </Box>

          {/* Notification Button - Show only when logged in */}
          {userInfo && (
            <Box sx={{ mr: 2 }}>
              <NotificationMenu />
            </Box>
          )}

          {/* Register Button - Desktop */}
          {!userInfo && (
            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{
                display: { xs: "none", md: "flex" },
                mr: 2,
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Register
            </Button>
          )}

          {/* User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={userInfo ? "Account settings" : "Login"} arrow>
              <IconButton 
                onClick={handleOpenUserMenu} 
                sx={{ 
                  p: 0.5,
                  border: '2px solid transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'rgba(102, 126, 234, 0.3)',
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <Avatar 
                  src={userInfo && user?.avatar?.url ? user.avatar.url : undefined}
                  sx={{ 
                    width: 40, 
                    height: 40,
                    background: userInfo 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'linear-gradient(135deg, #bdbdbd 0%, #757575 100%)',
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  }}
                >
                  {userInfo?.name?.[0]?.toUpperCase() || '?'}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '50px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  minWidth: 240,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                  mt: 1,
                  overflow: 'visible',
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
            >
              {userInfo
                ? [
                    // User Info Header
                    (
                      <Box key="user-header" sx={{ 
                        px: 3, 
                        py: 2, 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        borderRadius: '12px 12px 0 0',
                      }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                          {userInfo.name}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          {userInfo.email}
                        </Typography>
                      </Box>
                    ),
                    userInfo.role === 'admin' && (
                      <MenuItem 
                        key="admin-dashboard"
                        onClick={handleCloseUserMenu}
                        component={Link}
                        to="/admin/dashboard"
                        sx={{
                          py: 1.5,
                          px: 3,
                          mt: 1,
                          '&:hover': {
                            bgcolor: 'rgba(102, 126, 234, 0.08)',
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: 1.5,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                          }}>
                            📊
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              Admin Dashboard
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Manage content
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ),
                    (
                      <MenuItem 
                        key="profile"
                        onClick={handleCloseUserMenu}
                        component={Link}
                        to="/profile"
                        sx={{
                          py: 1.5,
                          px: 3,
                          mt: userInfo.role === 'admin' ? 0 : 1,
                          '&:hover': {
                            bgcolor: 'rgba(102, 126, 234, 0.08)',
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: 1.5,
                            bgcolor: 'rgba(102, 126, 234, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                          }}>
                            👤
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              My Profile
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Edit personal info
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ),
                    (
                      <MenuItem 
                        key="logout"
                        onClick={logOutUser}
                        sx={{
                          py: 1.5,
                          px: 3,
                          mt: 1,
                          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                          '&:hover': {
                            bgcolor: 'rgba(211, 47, 47, 0.08)',
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: 1.5,
                            bgcolor: 'rgba(211, 47, 47, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                          }}>
                            🚪
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#d32f2f' }}>
                            Log Out
                          </Typography>
                        </Box>
                      </MenuItem>
                    ),
                  ].filter(Boolean)
                : [
                    (
                      <Box key="guest" sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Please log in to access your account
                        </Typography>
                        <Button
                          component={Link}
                          to="/login"
                          variant="contained"
                          fullWidth
                          onClick={handleCloseUserMenu}
                          sx={{
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
                          🔐 Log In
                        </Button>
                        <Button
                          component={Link}
                          to="/register"
                          variant="outlined"
                          fullWidth
                          onClick={handleCloseUserMenu}
                          sx={{
                            mt: 1.5,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            borderColor: '#667eea',
                            color: '#667eea',
                            '&:hover': {
                              borderColor: '#667eea',
                              bgcolor: 'rgba(102, 126, 234, 0.08)',
                            }
                          }}
                        >
                          ✨ Create Account
                        </Button>
                      </Box>
                    )
                  ]}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
