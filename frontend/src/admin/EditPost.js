import { Box, Button, TextField, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
    .min(10, "text content should havea minimum of 10 characters ")
    .required("text content is required"),
});

const EditPost = () => {
  const { id } = useParams();
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  
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
      //alert(JSON.stringify(values, null, 2));
      actions.resetForm();
    },
  });

  //show post by Id
  const singlePostById = async () => {
    // console.log(id)
    try {
      const { data } = await axios.get(`/api/post/${id}`);
      setCategory(data.post.category || "");
      setContent(data.post.content);
      setImagePreview(data.post.image?.url || "");
      // console.log("single post admin", data.post);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  useEffect(() => {
    singlePostById();
  }, [id]);

  const updatePost = async (values) => {
    try {
      const { data } = await axios.put(`/api/post/update/${id}`, values, { withCredentials: true });
      if (data.success === true) {
        toast.success("post updated");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error);
    }
  };

  return (
    <>
      <Box sx={{ bgcolor: "white", padding: "20px 200px" }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Back
          </Button>
          <Typography variant="h5" sx={{ pb: 0 }}>
            Edit post
          </Typography>
        </Box>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            sx={{ mb: 3 }}
            fullWidth
            id="category"
            label="Category"
            name="category"
            select
            SelectProps={{
              native: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            value={values.category}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.category && Boolean(errors.category)}
            helperText={touched.category && errors.category}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </TextField>

          <Box sx={{ mb: 3 }}>
            <ReactQuill
              theme="snow"
              placeholder={"Write the post content..."}
              modules={modules}
              value={values.content}
              onChange={(e) => setFieldValue("content", e)}
            />
            <Box
              component="span"
              sx={{ color: "#d32f2f", fontSize: "12px", pl: 2 }}
            >
              {touched.content && errors.content}
            </Box>
          </Box>

          <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
            Image (Optional - Keep existing or upload new)
          </Typography>
          <Box border="2px dashed blue" sx={{ p: 1 }}>
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png"
              multiple={false}
              //maxFiles={3}
              onDrop={(acceptedFiles) =>
                acceptedFiles.map((file, index) => {
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
                  p="1rem"
                  sx={{
                    "&:hover": { cursor: "pointer" },
                    bgcolor: isDragActive ? "#cceffc" : "#fafafa",
                  }}
                >
                  <input name="image" {...getInputProps()} />
                  {isDragActive ? (
                    <>
                      <p style={{ textAlign: "center" }}>
                        <CloudUploadIcon
                          sx={{ color: "primary.main", mr: 2 }}
                        />
                      </p>
                      <p style={{ textAlign: "center", fontSize: "12px" }}>
                        {" "}
                        Drop here!
                      </p>
                    </>
                  ) : values.image === null ? (
                    <>
                      <p style={{ textAlign: "center" }}>
                        <CloudUploadIcon
                          sx={{ color: "primary.main", mr: 2 }}
                        />
                      </p>
                      <p style={{ textAlign: "center", fontSize: "12px" }}>
                        Drag and Drop image here or click to choose
                      </p>
                    </>
                  ) : (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-around",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <img
                            style={{ maxWidth: "100px" }}
                            src={
                              values.image === "" ? imagePreview : values.image
                            }
                            alt=""
                          />
                        </Box>
                      </Box>
                    </>
                  )}
                </Box>
              )}
            </Dropzone>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            elevation={0}
            sx={{ mt: 3, p: 1, mb: 2, borderRadius: "25px" }}
            // disabled={loading}
          >
            Update post
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default EditPost;
