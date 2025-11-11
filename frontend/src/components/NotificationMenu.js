import React, { useState } from 'react';
import {
    IconButton,
    Badge,
    Menu,
    MenuItem,
    Box,
    Typography,
    Avatar,
    Divider,
    Button
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSelector, useDispatch } from 'react-redux';
import { 
    markNotificationReadAction, 
    markAllNotificationsReadAction 
} from '../redux/actions/notificationActions';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const NotificationMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { notifications, unreadCount } = useSelector(state => state.notifications);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            dispatch(markNotificationReadAction(notification._id));
        }
        handleClose();
        // notification.post can be either an object or string ID
        const postId = typeof notification.post === 'object' ? notification.post._id : notification.post;
        navigate(`/post/${postId}`);
    };

    const handleMarkAllRead = () => {
        dispatch(markAllNotificationsReadAction());
    };

    const getNotificationIcon = (type) => {
        return type === 'like' ? '❤️' : '💬';
    };

    return (
        <>
            <IconButton
                onClick={handleClick}
                sx={{
                    color: '#667eea',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                        transform: 'scale(1.05)',
                    }
                }}
            >
                <Badge 
                    badgeContent={unreadCount} 
                    color="error"
                    sx={{
                        '& .MuiBadge-badge': {
                            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                            boxShadow: '0 2px 8px rgba(238, 90, 111, 0.4)',
                        }
                    }}
                >
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        borderRadius: 3,
                        minWidth: 360,
                        maxWidth: 400,
                        maxHeight: 'min(500px, 70vh)', // Fix: Responsive max-height
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                        overflow: 'hidden',
                    }
                }}
                slotProps={{
                    paper: {
                        style: {
                            maxHeight: 'min(500px, 70vh)', // Đảm bảo không vượt quá viewport
                        }
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {/* Header */}
                <Box sx={{ 
                    px: 2.5, 
                    py: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Notifications
                    </Typography>
                    {unreadCount > 0 && (
                        <Button
                            size="small"
                            onClick={handleMarkAllRead}
                            sx={{
                                color: 'white',
                                textTransform: 'none',
                                fontSize: '0.75rem',
                                minWidth: 'auto',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1,
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                                }
                            }}
                        >
                            Mark all read
                        </Button>
                    )}
                </Box>

                {/* Notifications List */}
                <Box sx={{ maxHeight: 'calc(70vh - 80px)', overflowY: 'auto' }}> {/* Fix: Trừ header height */}
                    {notifications.length === 0 ? (
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                No notifications yet
                            </Typography>
                        </Box>
                    ) : (
                        notifications.map((notification, index) => (
                            <React.Fragment key={notification._id}>
                                <MenuItem
                                    onClick={() => handleNotificationClick(notification)}
                                    sx={{
                                        py: 2,
                                        px: 2.5,
                                        bgcolor: notification.read ? 'transparent' : 'rgba(102, 126, 234, 0.05)',
                                        '&:hover': {
                                            bgcolor: notification.read 
                                                ? 'rgba(0, 0, 0, 0.04)' 
                                                : 'rgba(102, 126, 234, 0.1)',
                                        },
                                        display: 'block',
                                        whiteSpace: 'normal',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                        <Avatar
                                            src={notification.sender?.avatar?.url}
                                            sx={{ 
                                                width: 40, 
                                                height: 40,
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            }}
                                        >
                                            {notification.sender?.name?.[0]?.toUpperCase()}
                                        </Avatar>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        fontWeight: notification.read ? 400 : 600,
                                                        flex: 1,
                                                    }}
                                                >
                                                    {notification.message}
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontSize: '1rem' }}>
                                                    {getNotificationIcon(notification.type)}
                                                </Typography>
                                            </Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {moment(notification.createdAt).fromNow()}
                                            </Typography>
                                        </Box>
                                        {!notification.read && (
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    bgcolor: '#667eea',
                                                    flexShrink: 0,
                                                }}
                                            />
                                        )}
                                    </Box>
                                </MenuItem>
                                {index < notifications.length - 1 && <Divider />}
                            </React.Fragment>
                        ))
                    )}
                </Box>
            </Menu>
        </>
    );
};

export default NotificationMenu;
