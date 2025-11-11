import { 
  Box, 
  Button, 
  TextField, 
  Typography,
  Paper,
  Container,
  IconButton,
  Chip,
  Card,
  CardMedia,
  CircularProgress
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useFormik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules } from "../components/moduleToolbar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const validationSchema = yup.object({
  category: yup
    .string("Select a category")
    .required("Category is required"),
  content: yup
    .string("Add text content")
    .min(10, "text content shoulda minimum of 10 characters ")
    .required("text content is required"),
});

const EditPostUser = () => {
  const { id } = useParams();
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  
  const categories = ['Technology', 'Design', 'Business', 'Lifestyle', 'Other'];

  const navigate = useNavigate();

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      category,
      content,
      image: "",
    },

    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values, actions) => {
      updatePost(values);
      actions.resetForm();
    },
  });

  //show post by Id
  const singlePostById = async () => {
    try {
      const { data } = await axios.get(`/api/post/${id}`);
      setCategory(data.post.category || "");
      setContent(data.post.content);
      setImagePreview(data.post.image?.url || "");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || 'Cannot load post');
    }
  };

  useEffect(() => {
    singlePostById();
  }, [id]);

  const updatePost = async (values) => {
    setLoading(true);
    try {
      const { data } = await axios.put(`/api/post/update/${id}`, values, { withCredentials: true });
      if (data.success === true) {
        toast.success("Post updated successfully! 🎉");
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        pt: { xs: 12, md: 14 },
        pb: 8,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                          radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`,
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              mb: 3,
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            Back
          </Button>
          
          <Typography 
            variant="h3" 
            sx={{ 
              color: 'white',
              fontWeight: 800,
              mb: 1,
              fontSize: { xs: '2rem', md: '3rem' },
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            ✏️ Edit Your Post
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: 600,
              fontSize: { xs: '0.95rem', md: '1rem' }
            }}
          >
            Update your content and make it even better
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: -4, mb: 8, position: 'relative', zIndex: 10 }}>
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          }}
        >
          <Box component="form" noValidate onSubmit={handleSubmit}>
            {/* Form Content */}
            <Box sx={{ p: { xs: 3, md: 5 } }}>
              {/* Category Selection */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                  🏷️ Category
                </Typography>
                <TextField
                  fullWidth
                  id="category"
                  name="category"
                  select
                  SelectProps={{
                    native: true,
                  }}
                  value={values.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.category && Boolean(errors.category)}
                  helperText={touched.category && errors.category}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                      }
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      }
                    }
                  }}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </TextField>
              </Box>

              {/* Content Editor */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                  ✍️ Content
                </Typography>
                <Box sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: touched.content && errors.content ? '1px solid #d32f2f' : '1px solid #e0e0e0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                  },
                  '&:focus-within': {
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                    borderColor: '#667eea',
                  },
                  '& .quill': {
                    bgcolor: 'background.paper',
                  },
                  '& .ql-toolbar': {
                    borderBottom: '1px solid #e0e0e0',
                    bgcolor: '#f8f9fa',
                  },
                  '& .ql-container': {
                    minHeight: 250,
                    fontSize: '15px',
                  }
                }}>
                  <ReactQuill
                    theme="snow"
                    placeholder={"Write your amazing content here..."}
                    modules={modules}
                    value={values.content}
                    onChange={(e) => setFieldValue("content", e)}
                  />
                </Box>
                {touched.content && errors.content && (
                  <Typography
                    variant="caption"
                    sx={{ color: '#d32f2f', mt: 1, display: 'block', pl: 2 }}
                  >
                    {errors.content}
                  </Typography>
                )}
              </Box>

              {/* Image Upload */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                  📸 Cover Image
                </Typography>
                
                <Dropzone
                  acceptedFiles=".jpg,.jpeg,.png"
                  multiple={false}
                  onDrop={(acceptedFiles) =>
                    acceptedFiles.map((file) => {
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onloadend = () => {
                        setFieldValue("image", reader.result);
                      };
                    })
                  }
                >
                  {({ getRootProps, getInputProps, isDragActive }) => (
                    <Box
                      {...getRootProps()}
                      sx={{
                        border: '2px dashed',
                        borderColor: isDragActive ? '#667eea' : '#e0e0e0',
                        borderRadius: 3,
                        p: 4,
                        textAlign: 'center',
                        cursor: 'pointer',
                        bgcolor: isDragActive ? 'rgba(102, 126, 234, 0.05)' : '#fafafa',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#667eea',
                          bgcolor: 'rgba(102, 126, 234, 0.05)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                        }
                      }}
                    >
                      <input name="image" {...getInputProps()} />
                      
                      {values.image || imagePreview ? (
                        <Box sx={{ position: 'relative' }}>
                          <Card sx={{ maxWidth: 500, mx: 'auto', borderRadius: 2, overflow: 'hidden' }}>
                            <CardMedia
                              component="img"
                              image={values.image || imagePreview}
                              alt="Preview"
                              sx={{ 
                                height: { xs: 200, md: 300 },
                                objectFit: 'cover',
                              }}
                            />
                          </Card>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              setFieldValue("image", "");
                              setImagePreview("");
                            }}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: { xs: 'calc(50% - 250px + 8px)', md: 'calc(50% - 250px + 8px)' },
                              bgcolor: 'rgba(0, 0, 0, 0.6)',
                              color: 'white',
                              backdropFilter: 'blur(10px)',
                              '&:hover': {
                                bgcolor: 'rgba(244, 67, 54, 0.9)',
                                transform: 'rotate(90deg)',
                              },
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
                            Click or drag to change image
                          </Typography>
                        </Box>
                      ) : (
                        <Box>
                          <CloudUploadIcon 
                            sx={{ 
                              fontSize: { xs: 50, md: 60 }, 
                              color: isDragActive ? '#667eea' : '#bdbdbd',
                              mb: 2
                            }} 
                          />
                          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                            {isDragActive ? 'Drop it here!' : 'Upload Cover Image'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Drag and drop an image, or click to browse
                          </Typography>
                          <Chip 
                            label="JPG, JPEG, PNG" 
                            size="small" 
                            sx={{ mt: 2, bgcolor: 'rgba(102, 126, 234, 0.1)', color: '#667eea', fontWeight: 600 }}
                          />
                        </Box>
                      )}
                    </Box>
                  )}
                </Dropzone>
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: 'rgba(0, 0, 0, 0.12)',
                  }
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                    <span>Updating...</span>
                  </Box>
                ) : (
                  '🚀 Update Post'
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
      
      <Footer />
    </>
  );
};

export default EditPostUser;
