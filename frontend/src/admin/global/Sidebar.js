import React, { useEffect } from "react";
import { Sidebar, Menu, MenuItem, menuClasses } from "react-pro-sidebar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Box, Typography, Avatar, Divider } from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ArticleIcon from "@mui/icons-material/Article";
import PeopleIcon from "@mui/icons-material/People";
import MailIcon from "@mui/icons-material/Mail";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  userLogoutAction,
  userProfileAction,
} from "../../redux/actions/userAction";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

const SidebarAdm = () => {
  const { userInfo } = useSelector((state) => state.signIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(userProfileAction());
  }, [dispatch]);

  //log out
  const logOut = () => {
    dispatch(userLogoutAction());
    window.location.reload(true);
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  return (
    <>
      <Sidebar 
        backgroundColor="#ffffff" 
        style={{ 
          borderRight: "1px solid rgba(0,0,0,0.08)",
          boxShadow: '2px 0 8px rgba(0,0,0,0.04)'
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Header with Logo */}
          <Box>
            <Box sx={{ 
              p: 3, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 800,
                  color: 'white',
                  fontSize: '1.5rem',
                  letterSpacing: '0.5px'
                }}
              >
                📝 Admin Panel
              </Typography>
            </Box>

            {/* User Profile Section */}
            {userInfo && (
              <Box sx={{ 
                p: 2.5, 
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                bgcolor: '#fafafa'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar 
                    sx={{ 
                      width: 44, 
                      height: 44,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    {userInfo.name?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {userInfo.name}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                        display: 'block',
                        bgcolor: userInfo.role === 'admin' ? 'rgba(102, 126, 234, 0.1)' : 'rgba(0,0,0,0.05)',
                        color: userInfo.role === 'admin' ? '#667eea' : 'text.secondary',
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        width: 'fit-content'
                      }}
                    >
                      {userInfo.role || 'User'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            <Box sx={{ pt: 2 }}>
              <Menu
                menuItemStyles={{
                  button: {
                    [`&.${menuClasses.button}`]: {
                      color: "#333",
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      padding: '12px 20px',
                      margin: '4px 12px',
                      borderRadius: '8px',
                    },
                    "&:hover": {
                      backgroundColor: "rgba(102, 126, 234, 0.08)",
                      color: "#667eea",
                    },
                    "&.ps-active": {
                      backgroundColor: "rgba(102, 126, 234, 0.12)",
                      color: "#667eea",
                      fontWeight: 700,
                    }
                  },
                  icon: {
                    [`&.${menuClasses.icon}`]: {
                      color: "#667eea",
                    },
                  },
                }}
              >
                {userInfo && userInfo.role === "admin" ? (
                  <>
                    <MenuItem
                      component={<Link to="/admin/dashboard" />}
                      icon={<DashboardIcon />}
                    >
                      Dashboard
                    </MenuItem>
                    <MenuItem
                      component={<Link to="/admin/posts" />}
                      icon={<ArticleIcon />}
                    >
                      Manage Posts
                    </MenuItem>
                    <MenuItem
                      component={<Link to="/admin/users" />}
                      icon={<PeopleIcon />}
                    >
                      Manage Users
                    </MenuItem>
                    <MenuItem
                      component={<Link to="/admin/contacts" />}
                      icon={<MailIcon />}
                    >
                      Manage Contacts
                    </MenuItem>
                    <Divider sx={{ my: 1, mx: 2 }} />
                    <MenuItem
                      component={<Link to="/admin/post/create" />}
                      icon={<PostAddIcon />}
                    >
                      Create Post
                    </MenuItem>
                    <Divider sx={{ my: 1, mx: 2 }} />
                    <MenuItem
                      component={<Link to="/" />}
                      icon={<HomeIcon />}
                    >
                      Back to Site
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem
                      component={<Link to="/user/dashboard" />}
                      icon={<DashboardIcon />}
                    >
                      Dashboard
                    </MenuItem>
                    <MenuItem
                      component={<Link to="/" />}
                      icon={<HomeIcon />}
                    >
                      Back to Site
                    </MenuItem>
                  </>
                )}
              </Menu>
            </Box>
          </Box>

          {/* Logout Button at Bottom */}
          <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <Menu
              menuItemStyles={{
                button: {
                  [`&.${menuClasses.button}`]: {
                    color: "#f44336",
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    padding: '12px 20px',
                    margin: '0 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(244, 67, 54, 0.2)',
                  },
                  "&:hover": {
                    backgroundColor: "rgba(244, 67, 54, 0.08)",
                    borderColor: "rgba(244, 67, 54, 0.4)",
                  },
                },
                icon: {
                  [`&.${menuClasses.icon}`]: {
                    color: "#f44336",
                  },
                },
              }}
            >
              <MenuItem onClick={logOut} icon={<LogoutIcon />}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Sidebar>
    </>
  );
};

export default SidebarAdm;
