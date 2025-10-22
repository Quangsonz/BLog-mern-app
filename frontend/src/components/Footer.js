import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  IconButton,
  Divider,
  Stack
} from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        pt: 6,
        pb: 3,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              About Us
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.8 }}>
              Share your stories, connect with readers, and discover amazing content from our vibrant community.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Link 
                href="/" 
                color="inherit" 
                underline="none"
                sx={{ 
                  opacity: 0.9,
                  transition: 'all 0.3s',
                  '&:hover': { 
                    opacity: 1,
                    transform: 'translateX(5px)',
                  }
                }}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                color="inherit" 
                underline="none"
                sx={{ 
                  opacity: 0.9,
                  transition: 'all 0.3s',
                  '&:hover': { 
                    opacity: 1,
                    transform: 'translateX(5px)',
                  }
                }}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                color="inherit" 
                underline="none"
                sx={{ 
                  opacity: 0.9,
                  transition: 'all 0.3s',
                  '&:hover': { 
                    opacity: 1,
                    transform: 'translateX(5px)',
                  }
                }}
              >
                Contact
              </Link>
              <Link 
                href="/privacy" 
                color="inherit" 
                underline="none"
                sx={{ 
                  opacity: 0.9,
                  transition: 'all 0.3s',
                  '&:hover': { 
                    opacity: 1,
                    transform: 'translateX(5px)',
                  }
                }}
              >
                Privacy Policy
              </Link>
            </Stack>
          </Grid>

          {/* Categories */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              Categories
            </Typography>
            <Stack spacing={1}>
              <Link 
                href="/category/technology" 
                color="inherit" 
                underline="none"
                sx={{ 
                  opacity: 0.9,
                  transition: 'all 0.3s',
                  '&:hover': { 
                    opacity: 1,
                    transform: 'translateX(5px)',
                  }
                }}
              >
                Technology
              </Link>
              <Link 
                href="/category/lifestyle" 
                color="inherit" 
                underline="none"
                sx={{ 
                  opacity: 0.9,
                  transition: 'all 0.3s',
                  '&:hover': { 
                    opacity: 1,
                    transform: 'translateX(5px)',
                  }
                }}
              >
                Lifestyle
              </Link>
              <Link 
                href="/category/travel" 
                color="inherit" 
                underline="none"
                sx={{ 
                  opacity: 0.9,
                  transition: 'all 0.3s',
                  '&:hover': { 
                    opacity: 1,
                    transform: 'translateX(5px)',
                  }
                }}
              >
                Travel
              </Link>
              <Link 
                href="/category/food" 
                color="inherit" 
                underline="none"
                sx={{ 
                  opacity: 0.9,
                  transition: 'all 0.3s',
                  '&:hover': { 
                    opacity: 1,
                    transform: 'translateX(5px)',
                  }
                }}
              >
                Food
              </Link>
            </Stack>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              Follow Us
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
              Stay connected with us on social media
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <IconButton 
                aria-label="Facebook"
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-3px)',
                  }
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                aria-label="Twitter"
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-3px)',
                  }
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton 
                aria-label="Instagram"
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-3px)',
                  }
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton 
                aria-label="LinkedIn"
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-3px)',
                  }
                }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton 
                aria-label="GitHub"
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-3px)',
                  }
                }}
              >
                <GitHubIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            © {new Date().getFullYear()} Blog MERN. Made with 
            <FavoriteIcon sx={{ fontSize: 16, color: '#ff1744' }} />
            by Our Team
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
