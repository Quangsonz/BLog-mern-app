import {
    NOTIFICATIONS_LOAD_REQUEST,
    NOTIFICATIONS_LOAD_SUCCESS,
    NOTIFICATIONS_LOAD_FAIL,
    NOTIFICATION_MARK_READ_SUCCESS,
    NOTIFICATION_MARK_ALL_READ_SUCCESS,
    NEW_NOTIFICATION,
    INCREMENT_UNREAD
} from '../actions/notificationActions';

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null
};
// Nhận action, xử lý và cập nhật lại state notification trong store
// có tác dụng quản lý trạng thái thông báo trong ứng dụng Redux, 
export const notificationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case NOTIFICATIONS_LOAD_REQUEST:
            return { ...state, loading: true };

        case NOTIFICATIONS_LOAD_SUCCESS:
            return {
                ...state,
                loading: false,
                notifications: action.payload.notifications,
                unreadCount: action.payload.unreadCount,
                error: null
            };

        case NOTIFICATIONS_LOAD_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case NEW_NOTIFICATION:
            return {
                ...state,
                notifications: [action.payload, ...state.notifications],
                unreadCount: state.unreadCount + 1
            };

        case NOTIFICATION_MARK_READ_SUCCESS:
            return {
                ...state,
                notifications: state.notifications.map(n =>
                    n._id === action.payload ? { ...n, read: true } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1)
            };

        case NOTIFICATION_MARK_ALL_READ_SUCCESS:
            return {
                ...state,
                notifications: state.notifications.map(n => ({ ...n, read: true })),
                unreadCount: 0
            };

        case INCREMENT_UNREAD:
            return {
                ...state,
                unreadCount: state.unreadCount + 1
            };

        default:
            return state;
    }
};
