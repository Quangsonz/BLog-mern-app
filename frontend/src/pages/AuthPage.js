import React, { useState, useEffect } from 'react';
import { Box, Container, TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userSignInAction, userSignUpAction } from '../redux/actions/userAction';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const loginValidationSchema = yup.object({
    email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
    password: yup.string('Enter your password').min(8, 'Password should be of minimum 8 characters length').required('Password is required'),
});

const registerValidationSchema = yup.object({
    name: yup.string('Enter your name').required('Name is required'),
    email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
    password: yup.string('Enter your password').min(8, 'Password should be of minimum 8 characters length').required('Password is required'),
});

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.signIn);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const loginFormik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: loginValidationSchema,
        onSubmit: (values, actions) => {
            dispatch(userSignInAction(values));
            actions.resetForm();
        },
    });

    const registerFormik = useFormik({
        initialValues: { name: '', email: '', password: '' },
        validationSchema: registerValidationSchema,
        onSubmit: (values, actions) => {
            dispatch(userSignUpAction(values));
            actions.resetForm();
        },
    });

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                py: 4,
                px: 2,
            }}
        >

            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <Box
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: 4,
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        p: { xs: 4, sm: 6 },
                        position: 'relative',
                    }}
                >
                    {/* Logo Icon */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 3,
                        }}
                    >
                        <Box
                            sx={{
                                width: 70,
                                height: 70,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                            }}
                        >
                            <AutoAwesomeIcon sx={{ fontSize: 35, color: 'white' }} />
                        </Box>
                    </Box>

                    {/* Title */}
                    <Typography
                        variant="h4"
                        sx={{
                            textAlign: 'center',
                            fontWeight: 700,
                            mb: 1,
                            color: '#1a1a1a',
                        }}
                    >
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            textAlign: 'center',
                            color: '#666',
                            mb: 4,
                            fontSize: '0.95rem',
                        }}
                    >
                        {isLogin ? 'Sign in to continue to your account' : 'Sign up to get started'}
                    </Typography>

                    {/* Forms */}
                    <Box component="form" onSubmit={isLogin ? loginFormik.handleSubmit : registerFormik.handleSubmit}>
                        {!isLogin && (
                            <Box sx={{ position: 'relative', mb: 3 }}>
                                <TextField
                                    fullWidth
                                    id="name"
                                    name="name"
                                    placeholder="Full Name"
                                    value={registerFormik.values.name}
                                    onChange={registerFormik.handleChange}
                                    onBlur={registerFormik.handleBlur}
                                    error={registerFormik.touched.name && Boolean(registerFormik.errors.name)}
                                    helperText={registerFormik.touched.name && registerFormik.errors.name}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon sx={{ color: '#667eea' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: 2,
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#667eea',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#667eea',
                                                borderWidth: 2,
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        )}

                        <Box sx={{ position: 'relative', mb: 3 }}>
                            <TextField
                                fullWidth
                                id="email"
                                name="email"
                                placeholder="Email Address"
                                value={isLogin ? loginFormik.values.email : registerFormik.values.email}
                                onChange={isLogin ? loginFormik.handleChange : registerFormik.handleChange}
                                onBlur={isLogin ? loginFormik.handleBlur : registerFormik.handleBlur}
                                error={isLogin 
                                    ? loginFormik.touched.email && Boolean(loginFormik.errors.email)
                                    : registerFormik.touched.email && Boolean(registerFormik.errors.email)
                                }
                                helperText={isLogin
                                    ? loginFormik.touched.email && loginFormik.errors.email
                                    : registerFormik.touched.email && registerFormik.errors.email
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon sx={{ color: '#667eea' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: 2,
                                        '& fieldset': {
                                            borderColor: '#e0e0e0',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#667eea',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea',
                                            borderWidth: 2,
                                        },
                                    },
                                }}
                            />
                        </Box>

                        <Box sx={{ position: 'relative', mb: 4 }}>
                            <TextField
                                fullWidth
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={isLogin ? loginFormik.values.password : registerFormik.values.password}
                                onChange={isLogin ? loginFormik.handleChange : registerFormik.handleChange}
                                onBlur={isLogin ? loginFormik.handleBlur : registerFormik.handleBlur}
                                error={isLogin
                                    ? loginFormik.touched.password && Boolean(loginFormik.errors.password)
                                    : registerFormik.touched.password && Boolean(registerFormik.errors.password)
                                }
                                helperText={isLogin
                                    ? loginFormik.touched.password && loginFormik.errors.password
                                    : registerFormik.touched.password && registerFormik.errors.password
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon sx={{ color: '#667eea' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{ color: '#667eea' }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: 2,
                                        '& fieldset': {
                                            borderColor: '#e0e0e0',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#667eea',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea',
                                            borderWidth: 2,
                                        },
                                    },
                                }}
                            />
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            startIcon={isLogin ? <LoginIcon /> : <PersonAddIcon />}
                            sx={{
                                py: 1.75,
                                borderRadius: 2,
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
                                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                                    transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#666',
                                    display: 'inline',
                                }}
                            >
                                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                            </Typography>
                            <Typography
                                component="span"
                                onClick={() => setIsLogin(!isLogin)}
                                sx={{
                                    color: '#667eea',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default AuthPage;
