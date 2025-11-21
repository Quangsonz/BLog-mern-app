import axios from 'axios';
import { toast } from 'react-toastify';

export const NOTIFICATIONS_LOAD_REQUEST = 'NOTIFICATIONS_LOAD_REQUEST';
export const NOTIFICATIONS_LOAD_SUCCESS = 'NOTIFICATIONS_LOAD_SUCCESS';
export const NOTIFICATIONS_LOAD_FAIL = 'NOTIFICATIONS_LOAD_FAIL';
export const NOTIFICATION_MARK_READ_SUCCESS = 'NOTIFICATION_MARK_READ_SUCCESS';
export const NOTIFICATION_MARK_ALL_READ_SUCCESS = 'NOTIFICATION_MARK_ALL_READ_SUCCESS';
export const NEW_NOTIFICATION = 'NEW_NOTIFICATION';
export const INCREMENT_UNREAD = 'INCREMENT_UNREAD';

// định nghĩa các hàm gửi action để tương tác với API và cập nhật state trong Redux store
// Get all notifications
export const notificationsLoadAction = () => async (dispatch) => {
    dispatch({ type: NOTIFICATIONS_LOAD_REQUEST });
    try {
        const { data } = await axios.get('/api/notifications');
        dispatch({
            type: NOTIFICATIONS_LOAD_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: NOTIFICATIONS_LOAD_FAIL,
            payload: error.response && error.response.data.error
                ? error.response.data.error
                : error.message,
        });
    }
};

// Mark notification as read
// dispatch là hàm để gửi action đến reducer
export const markNotificationReadAction = (id) => async (dispatch) => {
    try {
        const { data } = await axios.put(`/api/notifications/${id}/read`);
        dispatch({
            type: NOTIFICATION_MARK_READ_SUCCESS,
            payload: id
        });
    } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to mark as read');
    }
};

// Mark all notifications as read
export const markAllNotificationsReadAction = () => async (dispatch) => {
    try {
        await axios.put('/api/notifications/read-all');
        dispatch({
            type: NOTIFICATION_MARK_ALL_READ_SUCCESS
        });
    } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to mark all as read');
    }
};

// Add new notification from socket
export const addNewNotification = (notification) => ({
    type: NEW_NOTIFICATION,
    payload: notification
});

// Increment unread count
export const incrementUnreadCount = () => ({
    type: INCREMENT_UNREAD
});
