import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { useProSidebar } from "react-pro-sidebar";
import { useSelector } from "react-redux";

const HeaderTop = () => {
  const { collapseSidebar } = useProSidebar();
  const { userInfo } = useSelector((state) => state.signIn);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          bgcolor: "white",
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
      >
        <Toolbar sx={{ minHeight: '64px !important' }}>
          <IconButton
            onClick={() => collapseSidebar()}
            size="large"
            edge="start"
            aria-label="toggle sidebar"
            sx={{ 
              mr: 2, 
              color: "#667eea",
              bgcolor: 'rgba(102, 126, 234, 0.08)',
              '&:hover': {
                bgcolor: 'rgba(102, 126, 234, 0.15)',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: 'text.primary',
                fontSize: '1.1rem'
              }}
            >
              Admin Panel
            </Typography>
          </Box>

          {/* Optional: Add more header actions here */}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default HeaderTop;
