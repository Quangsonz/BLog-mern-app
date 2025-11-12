import React from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Privacy = () => {
  const sections = [
    {
      title: "Information We Collect",
      content: [
        "Personal information (name, email address, profile picture)",
        "Content you create (blog posts, comments, likes)",
        "Usage data (pages visited, time spent, interactions)",
        "Device information (browser type, IP address, operating system)",
        "Cookies and similar tracking technologies"
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        "To provide and maintain our services",
        "To notify you about changes to our service",
        "To allow you to participate in interactive features",
        "To provide customer support",
        "To gather analysis or valuable information to improve our service",
        "To monitor the usage of our service",
        "To detect, prevent and address technical issues"
      ]
    },
    {
      title: "Data Security",
      content: [
        "We use SSL encryption to protect data transmission",
        "Passwords are encrypted using industry-standard algorithms",
        "Regular security audits and updates",
        "Secure data centers with 24/7 monitoring",
        "Limited access to personal data by authorized personnel only"
      ]
    },
    {
      title: "Your Rights",
      content: [
        "Access your personal data",
        "Correct inaccurate data",
        "Request deletion of your data",
        "Object to data processing",
        "Request data portability",
        "Withdraw consent at any time"
      ]
    },
    {
      title: "Cookies Policy",
      content: [
        "Essential cookies: Required for the website to function",
        "Analytics cookies: Help us understand how visitors use our site",
        "Preference cookies: Remember your settings and preferences",
        "You can control cookies through your browser settings"
      ]
    },
    {
      title: "Third-Party Services",
      content: [
        "We may use third-party services (analytics, hosting, email)",
        "These services have their own privacy policies",
        "We ensure third parties comply with data protection regulations",
        "We do not sell your personal information to third parties"
      ]
    }
  ];

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 8 }}>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box sx={{ 
            mb: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 4,
            p: 6,
            color: 'white',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
          }}>
            <Box sx={{ 
              width: 80, 
              height: 80,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'white',
              color: '#667eea',
              mx: 'auto',
              mb: 3
            }}>
              <PrivacyTipIcon sx={{ fontSize: 50 }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              Privacy Policy
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
              Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.8 }}>
              Last Updated: November 7, 2025
            </Typography>
          </Box>

          {/* Introduction */}
          <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Introduction
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', mb: 2 }}>
              Welcome to our Blog Platform. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our website 
              and tell you about your privacy rights and how the law protects you.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
              By using our service, you agree to the collection and use of information in accordance with this policy. 
              We will not use or share your information with anyone except as described in this Privacy Policy.
            </Typography>
          </Paper>

          {/* Privacy Sections */}
          {sections.map((section, index) => (
            <Accordion 
              key={index}
              elevation={0}
              sx={{ 
                mb: 2, 
                borderRadius: '12px !important',
                '&:before': { display: 'none' },
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.08)'
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  bgcolor: 'rgba(102, 126, 234, 0.05)',
                  '&:hover': {
                    bgcolor: 'rgba(102, 126, 234, 0.08)'
                  },
                  '& .MuiAccordionSummary-content': {
                    my: 2
                  }
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {index + 1}. {section.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
                <List>
                  {section.content.map((item, idx) => (
                    <ListItem key={idx} sx={{ px: 0 }}>
                      <ListItemText 
                        primary={
                          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                            • {item}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}

          {/* Data Retention */}
          <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3, mt: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Data Retention
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', mb: 2 }}>
              We will retain your personal data only for as long as is necessary for the purposes set out in this 
              Privacy Policy. We will retain and use your personal data to the extent necessary to comply with our 
              legal obligations, resolve disputes, and enforce our policies.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
              If you delete your account, we will delete your personal data within 30 days, except where we are 
              required to retain it for legal purposes.
            </Typography>
          </Paper>

          {/* Children's Privacy */}
          <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Children's Privacy
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', mb: 2 }}>
              Our service is not directed to children under 13 years of age. We do not knowingly collect personal 
              information from children under 13. If you are a parent or guardian and you are aware that your child 
              has provided us with personal data, please contact us.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
              If we become aware that we have collected personal data from children without verification of parental 
              consent, we take steps to remove that information from our servers.
            </Typography>
          </Paper>

          {/* Changes to Policy */}
          <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Changes to This Privacy Policy
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', mb: 2 }}>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the 
              new Privacy Policy on this page and updating the "Last Updated" date at the top of this policy.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy 
              Policy are effective when they are posted on this page.
            </Typography>
          </Paper>

          {/* Contact Section */}
          <Paper elevation={0} sx={{ 
            p: 4, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Contact Us
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', mb: 2 }}>
              If you have any questions about this Privacy Policy, please contact us:
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                📧 Email: privacy@blogplatform.com
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                📞 Phone: +1 (555) 123-4567
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                📍 Address: 123 Blog Street, Web City, 10001
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Privacy;
